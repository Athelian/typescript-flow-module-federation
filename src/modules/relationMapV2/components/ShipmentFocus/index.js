// @flow
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import InfiniteLoader from 'react-window-infinite-loader';
import { VariableSizeList as List } from 'react-window';
import { Query } from 'react-apollo';
import { get, set, uniq } from 'lodash/fp';
import { FormattedMessage } from 'react-intl';
import scrollIntoView from 'scroll-into-view-if-needed';
import usePrevious from 'hooks/usePrevious';
import logger from 'utils/logger';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import { Display } from 'components/Form';
import { shipmentFocusedListQuery } from 'modules/relationMapV2/query';
import {
  Hits,
  Entities,
  SortAndFilter,
  ExpandRows,
  FocusedView,
} from 'modules/relationMapV2/store';
import SelectedEntity from '../SelectedEntity';
import Actions from '../Actions';
import Header from '../Header';
import Row from '../Row';
import generateListData from '../OrderFocus/generateListData';
import normalize from '../OrderFocus/normalize';
import InitLoadingPlaceholder from '../InitLoadingPlaceholder';
import {
  WrapperStyle,
  ListStyle,
  ActionsBackdropStyle,
  NoOrdersFoundStyle,
} from '../OrderFocus/style';

const hasMoreItems = (data: Object, model: string = 'orders') => {
  const nextPage = getByPathWithDefault(1, `${model}.page`, data) + 1;
  const totalPage = getByPathWithDefault(1, `${model}.totalPage`, data);
  return nextPage <= totalPage;
};

const innerElementType = React.forwardRef(
  ({ children, ...rest }: { children: React.Node }, ref) => (
    <div ref={ref} {...rest}>
      <Header />
      {children}
    </div>
  )
);

const loadMore = (
  clientData: {| fetchMore: Function, data: ?Object, onSuccess: Function |},
  queryVariables: Object = {}
) => {
  const selectedField: string = 'orders';
  const {
    data = { [`${selectedField}`]: { page: 1, totalPage: 0 } },
    fetchMore,
    onSuccess,
  } = clientData;
  if (!data) return Promise.resolve({});
  const nextPage = get(`${selectedField}.page`, data) + 1;
  const totalPage = get(`${selectedField}.totalPage`, data);
  if (nextPage > totalPage) return Promise.resolve({});
  logger.warn('loadMore nextPage', nextPage);
  return fetchMore({
    variables: {
      ...queryVariables,
      filter: queryVariables.filter,
      ...(queryVariables && queryVariables.sort
        ? { sort: { [queryVariables.sort.field]: queryVariables.sort.direction } }
        : {}),
      page: nextPage,
    },
    updateQuery: (prevResult, { fetchMoreResult }) => {
      logger.warn('updateQuery');
      onSuccess();

      if (
        get(`${selectedField}.page`, prevResult) + 1 !==
        get(`${selectedField}.page`, fetchMoreResult)
      ) {
        return prevResult;
      }

      if (get(`${selectedField}.nodes`, fetchMoreResult).length === 0) return prevResult;

      const result = set(
        `${selectedField}.hits`,
        uniq([
          ...get(`${selectedField}.hits`, prevResult),
          ...get(`${selectedField}.hits`, fetchMoreResult),
        ]),
        fetchMoreResult
      );

      return set(
        `${selectedField}.nodes`,
        uniq([
          ...get(`${selectedField}.nodes`, prevResult),
          ...get(`${selectedField}.nodes`, fetchMoreResult),
        ]),
        result
      );
    },
  }).catch(logger.error);
};

export default function ShipmentFocus() {
  const listRef = React.createRef();
  const scrollEntity = React.useRef({
    type: '',
    id: '',
  });
  const { expandRows, setExpandRows } = ExpandRows.useContainer();
  const [scrollPosition, setScrollPosition] = React.useState(-1);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const { initHits } = Hits.useContainer();
  const { initMapping, getRelatedBy } = Entities.useContainer();
  const { queryVariables } = SortAndFilter.useContainer();
  const lastQueryVariables = usePrevious(queryVariables);
  React.useEffect(() => {
    if (!isEquals(lastQueryVariables, queryVariables)) {
      setExpandRows([]);
    }
  }, [lastQueryVariables, queryVariables, setExpandRows]);

  const scrollToRow = React.useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ position, id, type }: { position: number, id: string, type: string }) => {
      scrollEntity.current = {
        id,
        type,
      };
      setScrollPosition(position);
    },
    []
  );

  React.useEffect(() => {
    if (scrollPosition >= 0) {
      if (listRef.current) listRef.current.scrollToItem(scrollPosition, 'center');
      const node = document.querySelector(
        `#${scrollEntity.current?.type}-${scrollEntity.current?.id}`
      );
      if (node) {
        // on UI, found the DOM, then try to scroll the center position
        scrollIntoView(node, {
          behavior: 'smooth',
          scrollMode: 'if-needed',
        });
      }
      scrollToRow({ position: -1, id: '', type: '' });
    }
  }, [listRef, scrollPosition, scrollToRow]);

  const { state } = FocusedView.useContainer();

  return (
    <>
      <div className={WrapperStyle}>
        <DndProvider backend={HTML5Backend}>
          <Query
            query={shipmentFocusedListQuery}
            variables={queryVariables}
            fetchPolicy="network-only"
          >
            {({ loading, data, error, fetchMore }) => {
              if (error) {
                return error.message;
              }

              if (loading) {
                return (
                  <>
                    <Header />
                    <InitLoadingPlaceholder />
                  </>
                );
              }

              const baseOrders = getByPathWithDefault([], 'orders.nodes', data).map(order =>
                state.order[getByPathWithDefault('', 'id', order)]
                  ? {
                      ...order,
                      ...state.order[getByPathWithDefault('', 'id', order)],
                    }
                  : order
              );
              const loadedOrders = Object.values(state.order || {});
              const orders = state.newOrders.map(orderId => state.order[orderId]);
              const processOrderIds = orders.map(order => order?.id).filter(Boolean);
              baseOrders.forEach(order => {
                if (!processOrderIds.includes(order.id)) {
                  processOrderIds.push(order.id);
                  if (!orders.includes(order)) orders.push(order);
                  const relatedOrders = getRelatedBy('order', order.id);
                  relatedOrders
                    .filter(id => !baseOrders.map(currentOrder => currentOrder.id).includes(id))
                    .forEach(relateId => {
                      const relatedOrder: Object = loadedOrders.find(
                        (currentOrder: ?Object) => currentOrder?.id === relateId
                      );
                      if (relatedOrder && !processOrderIds.includes(relatedOrder.id)) {
                        orders.push(relatedOrder);
                        processOrderIds.push(relatedOrder.id);
                      }
                    });
                }
              });
              initHits(getByPathWithDefault([], 'orders.hits', data));
              const ordersData = generateListData({
                orders,
                expandRows,
                setExpandRows,
              });
              const rowCount = ordersData.length;
              const isItemLoaded = (index: number) =>
                !hasMoreItems(data, 'orders') || index < rowCount;
              const loadMoreItems =
                loading || isLoadingMore
                  ? () => {}
                  : () => {
                      setIsLoadingMore(true);
                      loadMore(
                        { fetchMore, data, onSuccess: () => setIsLoadingMore(false) },
                        queryVariables
                      );
                    };
              const entities = normalize({ orders });
              initMapping({
                orders,
                entities,
              });
              return (
                <>
                  {orders.length > 0 ? (
                    <>
                      <InfiniteLoader
                        isItemLoaded={isItemLoaded}
                        itemCount={hasMoreItems(data, 'orders') ? rowCount + 1 : rowCount}
                        loadMoreItems={loadMoreItems}
                      >
                        {({ onItemsRendered, ref }) => (
                          <List
                            // $FlowIgnore: doesn't support https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
                            ref={element => {
                              listRef.current = element;
                              ref(element);
                            }}
                            itemData={ordersData}
                            className={ListStyle}
                            itemCount={hasMoreItems(data, 'orders') ? rowCount + 1 : rowCount}
                            innerElementType={innerElementType}
                            itemSize={index => {
                              if (index === 0) return 50;
                              return 75;
                            }}
                            onItemsRendered={onItemsRendered}
                            height={window.innerHeight - 50}
                            width="100%"
                            overscanCount={5}
                          >
                            {Row}
                          </List>
                        )}
                      </InfiniteLoader>
                      {state.targets.length > 0 && (
                        <>
                          <div className={ActionsBackdropStyle} />
                          <SelectedEntity />
                          <Actions targets={state.targets} />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Header />
                      <div className={NoOrdersFoundStyle}>
                        <Display>
                          <FormattedMessage
                            id="modules.Orders.noOrderFound"
                            defaultMessage="No orders found"
                          />
                        </Display>
                      </div>
                    </>
                  )}
                </>
              );
            }}
          </Query>
        </DndProvider>
      </div>
    </>
  );
}
