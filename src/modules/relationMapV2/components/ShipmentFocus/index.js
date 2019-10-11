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
import apolloClient from 'apollo';
import usePrevious from 'hooks/usePrevious';
import logger from 'utils/logger';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import { Display } from 'components/Form';
import { SHIPMENT } from 'modules/relationMapV2/constants';
import {
  shipmentFocusedListQuery,
  shipmentFullFocusDetailQuery,
} from 'modules/relationMapV2/query';
import {
  Hits,
  Entities,
  SortAndFilter,
  ExpandRows,
  FocusedView,
} from 'modules/relationMapV2/store';
import EditFormSlideView from '../EditFormSlideView';
import SelectedEntity from '../SelectedEntity';
import Actions from '../Actions';
import Header from '../Header';
import Row from '../Row';
import InitLoadingPlaceholder from '../InitLoadingPlaceholder';
import generateListData from './generateListData';
import normalize from './normalize';
import { WrapperStyle, ListStyle, ActionsBackdropStyle, NoShipmentsFoundStyle } from './style';

const hasMoreItems = (data: Object, model: string = 'shipments') => {
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
  const selectedField: string = 'shipments';
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

  const { state, dispatch } = FocusedView.useContainer();
  const queryShipmentsDetail = React.useCallback(
    (shipmentIds: Array<string>) => {
      if (shipmentIds.length) {
        apolloClient
          .query({
            query: shipmentFullFocusDetailQuery,
            variables: {
              ids: shipmentIds,
            },
          })
          .then(result => {
            dispatch({
              type: 'FETCH_SHIPMENTS',
              payload: {
                shipments: result.data.shipmentsByIDs,
              },
            });
          });
      }
    },
    [dispatch]
  );

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

              const baseShipments = getByPathWithDefault([], 'shipments.nodes', data).map(
                shipment =>
                  state.shipment[getByPathWithDefault('', 'id', shipment)]
                    ? {
                        ...shipment,
                        ...state.shipment[getByPathWithDefault('', 'id', shipment)],
                      }
                    : shipment
              );
              const loadedShipments = Object.values(state.shipment || {});
              const shipments = state.newShipments.map(orderId => state.shipment[orderId]);
              const processShipmentIds = shipments.map(shipment => shipment?.id).filter(Boolean);
              baseShipments.forEach(shipment => {
                if (!processShipmentIds.includes(shipment.id)) {
                  processShipmentIds.push(shipment.id);
                  if (!shipments.includes(shipment)) shipments.push(shipment);
                  const relatedShipments = getRelatedBy('shipment', shipment.id);
                  relatedShipments
                    .filter(
                      id => !baseShipments.map(currentShipment => currentShipment.id).includes(id)
                    )
                    .forEach(relateId => {
                      const relatedShipment: Object = loadedShipments.find(
                        (currentShipment: ?Object) => currentShipment?.id === relateId
                      );
                      if (relatedShipment && !processShipmentIds.includes(relatedShipment.id)) {
                        shipments.push(relatedShipment);
                        processShipmentIds.push(relatedShipment.id);
                      }
                    });
                }
              });
              initHits(getByPathWithDefault([], 'shipments.hits', data));
              const shipmentsData = generateListData({
                shipments,
                expandRows,
                setExpandRows,
              });
              const rowCount = shipmentsData.length;
              const isItemLoaded = (index: number) =>
                !hasMoreItems(data, 'shipments') || index < rowCount;
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
              const entities = normalize({ shipments });
              initMapping({
                shipments,
                entities,
              });
              return (
                <>
                  <EditFormSlideView
                    onClose={result => {
                      if (state.edit.type === SHIPMENT) {
                        queryShipmentsDetail([state.edit.selectedId]);
                      } else if (state.edit.orderId) {
                        queryShipmentsDetail([state.edit.orderId]);
                      } else if (state.edit.orderIds && state.edit.orderIds.length) {
                        queryShipmentsDetail(state.edit.orderIds);
                      }
                      if (result?.moveToTop) {
                        queryShipmentsDetail([result?.id ?? ''].filter(Boolean));
                        scrollToRow({
                          position: 0,
                          id: result?.id ?? '',
                          type: result?.type ?? '',
                        });
                      }
                      dispatch({
                        type: 'EDIT',
                        payload: {
                          type: '',
                          selectedId: '',
                        },
                      });
                    }}
                  />
                  {shipments.length > 0 ? (
                    <>
                      <InfiniteLoader
                        isItemLoaded={isItemLoaded}
                        itemCount={hasMoreItems(data, 'shipments') ? rowCount + 1 : rowCount}
                        loadMoreItems={loadMoreItems}
                      >
                        {({ onItemsRendered, ref }) => (
                          // $FlowIgnore: doesn't support
                          <List
                            ref={element => {
                              listRef.current = element;
                              ref(element);
                            }}
                            itemData={shipmentsData}
                            className={ListStyle}
                            itemCount={hasMoreItems(data, 'shipments') ? rowCount + 1 : rowCount}
                            innerElementType={innerElementType}
                            itemSize={index => {
                              if (index === 0) return 50;
                              return 75;
                            }}
                            onItemsRendered={onItemsRendered}
                            height={window.innerHeight - 50}
                            width="100%"
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
                      <div className={NoShipmentsFoundStyle}>
                        <Display>
                          <FormattedMessage
                            id="modules.Shipments.noShipmentFound"
                            defaultMessage="No shipments found"
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
