// @flow
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { VariableSizeList as List } from 'react-window';
import { Query } from 'react-apollo';
import { get, set, uniq } from 'lodash/fp';
import { FormattedMessage } from 'react-intl';
import scrollIntoView from 'scroll-into-view-if-needed';
import apolloClient from 'apollo';
import usePrevious from 'hooks/usePrevious';
import { uuid } from 'utils/id';
import logger from 'utils/logger';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import { UIContext } from 'modules/ui';
import { partnerPermissionQuery } from 'components/common/QueryForm/query';
import { Display } from 'components/Form';
import {
  orderFocusedListQuery,
  orderFocusDetailQuery,
  orderFullFocusDetailQuery,
} from 'modules/relationMapV2/query';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import { Hits, Entities, SortAndFilter } from 'modules/relationMapV2/store';
import { WrapperStyle, ListStyle, RowStyle, ActionsBackdropStyle } from './style';
import EditFormSlideView from '../EditFormSlideView';
import MoveEntityConfirm from '../MoveEntityConfirm';
import CloneEntities from '../CloneEntities';
import InlineCreateBatch from '../InlineCreateBatch';
import SelectedEntity from '../SelectedEntity';
import Actions from '../Actions';
import Header from '../Header';
import Row from '../Row';
import cellRenderer from './cellRenderer';
import generateListData from './generateListData';
import { reducer, initialState, RelationMapContext } from './store';
import { cacheSorted } from './helpers';
import { moveEntityMutation } from './mutation';
import normalize from './normalize';

const LoadingPlaceHolder = React.memo(() => {
  return (
    <div className={RowStyle} style={{ overflow: 'hidden', height: window.innerHeight - 120 }}>
      {[
        {
          type: 'placeholder',
          entity: ORDER,
          data: {
            id: uuid(),
          },
        },
        {
          type: 'placeholder',
          entity: ORDER_ITEM,
          data: {
            id: uuid(),
          },
        },
        {
          type: 'placeholder',
          entity: BATCH,
          data: {
            id: uuid(),
          },
        },
        {
          type: 'placeholder',
          entity: CONTAINER,
          data: {
            id: uuid(),
          },
        },
        {
          type: 'placeholder',
          entity: SHIPMENT,
          data: {
            id: uuid(),
          },
        },
      ].map(cell =>
        cellRenderer(cell, {
          onClick: () => {},
          dispatch: () => {},
          isExpand: false,
          order: {},
          state: {
            order: {},
            targets: [],
          },
        })
      )}
    </div>
  );
});

const hasMoreItems = (data: Object, model: string = 'orders') => {
  const nextPage = getByPathWithDefault(1, `${model}.page`, data) + 1;
  const totalPage = getByPathWithDefault(1, `${model}.totalPage`, data);
  return nextPage <= totalPage;
};

const innerElementType = React.forwardRef(
  ({ children, ...rest }: { children: React.Node }, ref) => (
    <div ref={ref} {...rest}>
      <Header style={{ top: 0, left: 0, width: '100%', zIndex: 2, position: 'sticky' }} />
      {children}
    </div>
  )
);

const loadMore = (
  clientData: { fetchMore: Function, data: ?Object },
  queryVariables: Object = {},
  selectedField: string = ''
) => {
  const { data = { [`${selectedField}`]: { page: 1, totalPage: 0 } }, fetchMore } = clientData;
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
  }).catch(logger.warn);
};

export default function OrderFocus() {
  const uiContext = React.useContext(UIContext);
  const listRef = React.createRef();
  const scrollEntity = React.useRef({
    type: '',
    id: '',
  });
  const [expandRows, setExpandRows] = React.useState([]);
  const [scrollPosition, setScrollPosition] = React.useState(-1);
  const { initHits } = Hits.useContainer();
  const { initMapping, onSetBadges } = Entities.useContainer();
  const { queryVariables } = SortAndFilter.useContainer();
  const lastQueryVariables = usePrevious(queryVariables);
  React.useEffect(() => {
    if (!isEquals(lastQueryVariables, queryVariables)) {
      setExpandRows([]);
    }
  }, [lastQueryVariables, queryVariables]);

  const scrollToRow = React.useCallback(
    (position: number, entity: { id: string, type: string, dispatch?: Function }) => {
      const { id, type, dispatch } = entity;
      scrollEntity.current = {
        id,
        type,
      };
      setScrollPosition(position);
      if (dispatch) {
        // refer https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
        // set the close to lower priority task which allow to our application to scroll to element
        // then close dialog
        window.requestIdleCallback(
          () => {
            dispatch({
              type: 'CREATE_BATCH_CLOSE',
              payload: {},
            });
          },
          {
            timeout: 250,
          }
        );
      }
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
      scrollToRow(-1, {});
    }
  }, [listRef, scrollPosition, scrollToRow]);

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const queryOrdersDetail = React.useCallback(
    (orderIds: Array<string>, isPreload: boolean = false) => {
      if (orderIds.length) {
        apolloClient
          .query({
            query: isPreload ? orderFocusDetailQuery : orderFullFocusDetailQuery,
            variables: {
              ids: orderIds,
            },
          })
          .then(result => {
            dispatch({
              type: 'FETCH_ORDERS',
              payload: {
                orders: result.data.ordersByIDs,
              },
            });
          });
      }
    },
    []
  );
  const queryPermission = React.useCallback((organizationId: string) => {
    apolloClient
      .query({
        query: partnerPermissionQuery,
        variables: {
          organizationId,
        },
      })
      .then(result => {
        dispatch({
          type: 'FETCH_PERMISSION',
          payload: {
            [organizationId]: getByPathWithDefault(
              [],
              'data.viewer.permissionsForOrganization',
              result
            ),
          },
        });
      });
  }, []);

  return (
    <>
      <div className={WrapperStyle}>
        <DndProvider backend={HTML5Backend}>
          <Query
            query={orderFocusedListQuery}
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
                    <LoadingPlaceHolder />
                  </>
                );
              }

              const orders = getByPathWithDefault([], 'orders.nodes', data).map(order =>
                state.order[getByPathWithDefault('', 'id', order)]
                  ? {
                      ...order,
                      ...state.order[getByPathWithDefault('', 'id', order)],
                    }
                  : order
              );
              initHits(getByPathWithDefault([], 'orders.hits', data));
              const ordersData = generateListData({
                orders,
                expandRows,
                setExpandRows,
              });
              const rowCount = ordersData.length;
              const entities = normalize({ orders });
              initMapping({
                orders,
                entities,
              });
              Object.keys(entities.organizations || {}).forEach(organizationId => {
                if (!state.permission[organizationId]) {
                  queryPermission(organizationId);
                }
              });
              return (
                <RelationMapContext.Provider value={{ state, dispatch }}>
                  {orders.length > 0 ? (
                    <>
                      {/* $FlowIssue: doesn't match the flow type yet for ref */}
                      <List
                        ref={listRef}
                        itemData={ordersData}
                        className={ListStyle}
                        itemCount={rowCount}
                        innerElementType={innerElementType}
                        itemSize={() => 75}
                        onItemsRendered={({ visibleStartIndex, visibleStopIndex }) => {
                          const isLastCell = visibleStopIndex === rowCount - 1;
                          if (hasMoreItems(data, 'orders') && isLastCell) {
                            loadMore({ fetchMore, data }, queryVariables, 'orders');
                          }
                          const orderIds: Array<string> = [];
                          for (
                            let index = visibleStartIndex;
                            index < visibleStopIndex;
                            index += 1
                          ) {
                            const [{ order }] = ordersData[index];
                            const isLoadedData =
                              getByPathWithDefault([], 'orderItems', order).length ===
                              getByPathWithDefault(0, 'orderItemCount', order);
                            if (
                              !isLoadedData &&
                              getByPathWithDefault(0, 'orderItemCount', order) > 0
                            ) {
                              orderIds.push(getByPathWithDefault('', 'id', order));
                            }
                          }
                          queryOrdersDetail(orderIds, true);
                        }}
                        height={window.innerHeight - 50}
                        width={
                          uiContext.isSideBarExpanded
                            ? window.innerWidth - 200
                            : window.innerWidth - 50
                        }
                      >
                        {Row}
                      </List>
                      <MoveEntityConfirm
                        isProcessing={state.moveEntity.isProcessing}
                        onCancel={() =>
                          dispatch({
                            type: 'CANCEL_MOVE',
                            payload: {},
                          })
                        }
                        onConfirm={async () => {
                          dispatch({
                            type: 'CONFIRM_MOVE_START',
                            payload: {},
                          });

                          const { orderIds = [] } = await moveEntityMutation(state, entities);
                          dispatch({
                            type: 'CONFIRM_MOVE_END',
                            payload: { orderIds },
                          });
                          queryOrdersDetail(orderIds);
                        }}
                        isOpen={state.moveEntity.isOpen}
                        {...state.moveEntity.detail}
                      />
                      <CloneEntities
                        onSuccess={({ sources, orderIds, cloneEntities }) => {
                          console.warn({
                            sources,
                            orderIds,
                            cloneEntities,
                          });
                          const cloneBadges = [];
                          const newOrderIds = [];
                          cloneEntities.forEach(cloneResult => {
                            if (cloneResult?.data?.orderCloneMany?.length ?? 0) {
                              newOrderIds.push(
                                ...(cloneResult?.data?.orderCloneMany ?? []).map(item => item?.id)
                              );
                              cloneBadges.push(
                                ...(cloneResult?.data?.orderCloneMany ?? []).map(item => {
                                  return {
                                    id: item?.id,
                                    type: 'cloned',
                                    entity: 'order',
                                  };
                                })
                              );
                            }
                          });
                          queryOrdersDetail([...orderIds, ...newOrderIds]);
                          cloneEntities.forEach(cloneResult => {
                            if (cloneResult?.data?.batchCloneMany?.length ?? 0) {
                              cloneBadges.push(
                                ...(cloneResult?.data?.batchCloneMany ?? []).map(item => {
                                  return {
                                    id: item?.id,
                                    type: 'cloned',
                                    entity: 'batch',
                                  };
                                })
                              );
                            }
                          });
                          cloneEntities.forEach(cloneResult => {
                            if (cloneResult?.data?.orderItemCloneMany?.length ?? 0) {
                              const itemsClone = cloneResult?.data?.orderItemCloneMany ?? [];
                              itemsClone.forEach(item => {
                                cloneBadges.push({
                                  id: item?.id,
                                  type: 'cloned',
                                  entity: 'orderItem',
                                });
                                cloneBadges.push(
                                  ...(item?.batches ?? []).map(batch => ({
                                    id: batch?.id,
                                    type: 'cloned',
                                    entity: 'batch',
                                  }))
                                );
                              });
                            }
                          });
                          onSetBadges(cloneBadges);
                        }}
                      />
                      <InlineCreateBatch
                        onSuccess={(orderId, batch) => {
                          if (orderId) {
                            queryOrdersDetail([orderId]);
                            const node = document.querySelector(`#${BATCH}-${batch?.id}`);
                            if (node) {
                              // on UI, found the DOM, then try to scroll the center position
                              scrollIntoView(node, {
                                behavior: 'smooth',
                                scrollMode: 'if-needed',
                              });
                            } else {
                              // need to find the position base on the order and batch
                              // then use the react-window to navigate to the row
                              // try to get from sort first, if not there, then try to use from entities
                              let batches =
                                // $FlowIssue it should be okay because we use new syntax for fallback if the property is not exist
                                cacheSorted?.[`${batch?.orderItem?.id}-batches`]?.entities ?? [];
                              if (
                                batches.length <
                                // $FlowIssue it should be okay because we use new syntax for fallback if the property is not exist
                                (entities.orderItems?.[batch?.orderItem?.id]?.batches?.length ?? 0)
                              ) {
                                // $FlowIssue it should be okay because we use new syntax for fallback if the property is not exist
                                batches = entities.orderItems?.[batch?.orderItem?.id]?.batches;
                              }
                              const lastBatchId = batches[batches.length - 1];
                              const indexPosition = ordersData.findIndex((row: Array<any>) => {
                                const [, , batchCell, , ,] = row;
                                return Number(batchCell.cell?.data?.id) === Number(lastBatchId);
                              });
                              scrollToRow(indexPosition, { dispatch, id: batch?.id, type: BATCH });
                            }
                          }
                        }}
                      />
                      <EditFormSlideView
                        type={state.edit.type}
                        selectedId={state.edit.selectedId}
                        onClose={() => {
                          if (state.edit.type === ORDER) {
                            queryOrdersDetail([state.edit.selectedId]);
                          } else if (state.edit.orderId) {
                            queryOrdersDetail([state.edit.orderId]);
                          } else if (state.edit.orderIds && state.edit.orderIds.length) {
                            queryOrdersDetail(state.edit.orderIds);
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
                      {state.targets.length > 0 && (
                        <>
                          <div className={ActionsBackdropStyle} />
                          <SelectedEntity targets={state.targets} />
                          <Actions targets={state.targets} />
                        </>
                      )}
                    </>
                  ) : (
                    <Display>
                      <FormattedMessage
                        id="modules.Orders.noOrderFound"
                        defaultMessage="No orders found"
                      />
                    </Display>
                  )}
                </RelationMapContext.Provider>
              );
            }}
          </Query>
        </DndProvider>
      </div>
    </>
  );
}
