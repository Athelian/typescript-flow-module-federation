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
import { Display } from 'components/Form';
import {
  orderFocusedListQuery,
  orderFocusDetailQuery,
  orderFullFocusDetailQuery,
} from 'modules/relationMapV2/query';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import { Hits, Entities, SortAndFilter, ClientSorts } from 'modules/relationMapV2/store';
import { findOrderIdByOrderItem, findOrderIdByBatch } from './helpers';
import EditFormSlideView from '../EditFormSlideView';
import MoveEntityConfirm from '../MoveEntityConfirm';
import CloneEntities from '../CloneEntities';
import InlineCreateItem from '../InlineCreateItem';
import DeleteItemConfirm from '../DeleteItemConfirm';
import AutoFill from '../AutoFill';
import InlineCreateBatch from '../InlineCreateBatch';
import DeleteBatchConfirm from '../DeleteBatchConfirm';
import StatusConfirm from '../StatusConfirm';
import SelectedEntity from '../SelectedEntity';
import Actions from '../Actions';
import Header from '../Header';
import Row from '../Row';
import cellRenderer from './cellRenderer';
import generateListData from './generateListData';
import { reducer, initialState, RelationMapContext } from './store';
import normalize from './normalize';
import RemoveBatchConfirm from '../RemoveBatchConfirm';
import DeleteBatchesConfirm from '../DeleteBatchesConfirm';
import MoveBatch from '../MoveBatch';
import AddTags from '../AddTags';
import DeleteConfirm from '../DeleteConfirm';
import SplitBatches from '../SplitBatches';
import {
  WrapperStyle,
  ListStyle,
  RowStyle,
  ActionsBackdropStyle,
  NoOrdersFoundStyle,
} from './style';

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
      <Header />
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
  const { getBatchesSortByItemId, getItemsSortByOrderId } = ClientSorts.useContainer();
  const {
    initMapping,
    onSetBadges,
    onSetCloneRelated,
    onSetSplitBatchRelated,
    getRelatedBy,
  } = Entities.useContainer();
  const { queryVariables } = SortAndFilter.useContainer();
  const lastQueryVariables = usePrevious(queryVariables);
  React.useEffect(() => {
    if (!isEquals(lastQueryVariables, queryVariables)) {
      setExpandRows([]);
    }
  }, [lastQueryVariables, queryVariables]);

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

              const processOrderIds = [];
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
              baseOrders.forEach(order => {
                if (!processOrderIds.includes(order.id)) {
                  processOrderIds.push(order.id);
                  orders.push(order);
                  const relatedOrders = getRelatedBy('order', order.id);
                  relatedOrders
                    .filter(id => !baseOrders.map(currentOrder => currentOrder.id).includes(id))
                    .forEach(relateId => {
                      const relatedOrder: Object = loadedOrders.find(
                        (currentOrder: ?Object) => currentOrder?.id === relateId
                      );
                      if (relatedOrder) {
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
              const entities = normalize({ orders });
              initMapping({
                orders,
                entities,
              });
              /* FIXME: define a hook under cause the warning from React  */
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
                        onSuccess={({ orderIds }) => {
                          queryOrdersDetail(orderIds);
                          dispatch({
                            type: 'CONFIRM_MOVE_END',
                            payload: { orderIds },
                          });
                        }}
                      />
                      <StatusConfirm
                        onSuccess={orderIds => {
                          queryOrdersDetail(orderIds);
                          dispatch({
                            type: 'STATUS_END',
                            payload: { orderIds },
                          });
                        }}
                      />
                      <AddTags
                        onSuccess={orderIds => {
                          queryOrdersDetail(orderIds);
                          dispatch({
                            type: 'TAGS_END',
                            payload: { orderIds },
                          });
                        }}
                      />
                      <CloneEntities
                        onSuccess={({
                          sources,
                          orderIds,
                          cloneEntities,
                          newOrderItemPositions,
                        }) => {
                          const cloneBadges = [];
                          const newOrderIds = [];
                          cloneEntities.forEach((cloneResult, orderPosition) => {
                            if (cloneResult?.data?.orderCloneMany?.length ?? 0) {
                              const ordersClone = cloneResult?.data?.orderCloneMany ?? [];
                              newOrderIds.push(...ordersClone.map(item => item?.id));
                              ordersClone.forEach(order => {
                                cloneBadges.push({
                                  id: order?.id,
                                  type: 'cloned',
                                  entity: 'order',
                                });
                                order.orderItems.forEach((item, position) => {
                                  cloneBadges.push({
                                    id: item?.id,
                                    type: (newOrderItemPositions?.[orderPosition] ?? []).includes(
                                      position
                                    )
                                      ? 'newItem'
                                      : 'cloned',
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
                              });
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
                          onSetCloneRelated(sources, cloneEntities);
                        }}
                      />
                      <InlineCreateItem
                        onSuccess={(orderId, items) => {
                          if (orderId) {
                            queryOrdersDetail([orderId]);
                            onSetBadges(
                              items.map(item => ({
                                id: item?.id ?? '',
                                type: 'newItem',
                                entity: 'orderItem',
                              }))
                            );
                            const originalItems = entities.orders?.[orderId]?.orderItems ?? [];
                            const orderItems = getItemsSortByOrderId(orderId, originalItems);
                            const itemList = [];
                            if (originalItems.length !== orderItems.length) {
                              orderItems.forEach(itemId => {
                                if (!itemList.includes(itemId)) {
                                  const relatedItems = getRelatedBy('orderItem', itemId);
                                  itemList.push(itemId);
                                  if (relatedItems.length) {
                                    itemList.push(...relatedItems);
                                  }
                                }
                              });
                              originalItems.forEach(itemId => {
                                if (!itemList.includes(itemId)) {
                                  const relatedItems = getRelatedBy('orderItem', itemId);
                                  itemList.push(itemId);
                                  if (relatedItems.length) {
                                    itemList.push(...relatedItems);
                                  }
                                }
                              });
                            } else {
                              itemList.push(...orderItems);
                            }
                            const lastItemId = itemList[itemList.length - 1];
                            const indexPosition = ordersData.findIndex((row: Array<any>) => {
                              const [, itemCell, , , ,] = row;
                              return Number(itemCell.cell?.data?.id) === Number(lastItemId);
                            });
                            const batches = entities.orderItems?.[lastItemId]?.batches ?? [];
                            scrollToRow({
                              position: indexPosition + batches.length - 1,
                              id: lastItemId,
                              type: ORDER_ITEM,
                            });
                            window.requestIdleCallback(
                              () => {
                                dispatch({
                                  type: 'CREATE_ITEM_END',
                                  payload: {},
                                });
                              },
                              {
                                timeout: 250,
                              }
                            );
                          }
                        }}
                      />
                      <MoveBatch
                        onSuccess={orderIds => {
                          queryOrdersDetail(orderIds);
                          // scroll to first orderId if that is exist on UI
                          const orderId = orderIds[0];
                          const indexPosition = ordersData.findIndex((row: Array<any>) => {
                            const [orderCell, , , ,] = row;
                            return Number(orderCell.cell?.data?.id) === Number(orderId);
                          });
                          scrollToRow({
                            position: indexPosition,
                            id: orderId,
                            type: ORDER,
                          });
                          window.requestIdleCallback(
                            () => {
                              dispatch({
                                type: 'MOVE_BATCH_END',
                                payload: {},
                              });
                            },
                            {
                              timeout: 250,
                            }
                          );
                        }}
                      />
                      <SplitBatches
                        onSuccess={(orderIds, batchIds) => {
                          onSetBadges(
                            Object.keys(batchIds).map(id => ({
                              id: batchIds[id],
                              type: 'split',
                              entity: 'batch',
                            }))
                          );
                          onSetSplitBatchRelated(batchIds);
                          queryOrdersDetail(orderIds);
                          window.requestIdleCallback(
                            () => {
                              dispatch({
                                type: 'SPLIT_CLOSE',
                                payload: {},
                              });
                            },
                            {
                              timeout: 250,
                            }
                          );
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
                              const originalBatches =
                                // $FlowIgnore this doesn't support yet
                                entities.orderItems?.[batch?.orderItem?.id ?? '']?.batches ?? [];
                              const batches = getBatchesSortByItemId(
                                // $FlowIgnore this doesn't support yet
                                batch?.orderItem?.id,
                                originalBatches
                              );
                              const batchList = [];
                              if (originalBatches.length !== batches.length) {
                                batches.forEach(batchId => {
                                  if (!batchList.includes(batchId)) {
                                    const relatedBatches = getRelatedBy('batch', batchId);
                                    batchList.push(batchId);
                                    if (relatedBatches.length) {
                                      batchList.push(...relatedBatches);
                                    }
                                  }
                                });
                                originalBatches.forEach(batchId => {
                                  if (!batchList.includes(batchId)) {
                                    const relatedBatches = getRelatedBy('batch', batchId);
                                    batchList.push(batchId);
                                    if (relatedBatches.length) {
                                      batchList.push(...relatedBatches);
                                    }
                                  }
                                });
                              } else {
                                batchList.push(...batches);
                              }
                              const lastBatchId = batchList[batchList.length - 1];
                              const indexPosition = ordersData.findIndex((row: Array<any>) => {
                                const [, , batchCell, , ,] = row;
                                return Number(batchCell.cell?.data?.id) === Number(lastBatchId);
                              });
                              scrollToRow({
                                position: indexPosition,
                                id: lastBatchId,
                                type: BATCH,
                              });
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
                          }
                        }}
                      />
                      <AutoFill
                        onSuccess={(itemIds, batchIds) => {
                          const orderIds = itemIds
                            .map(itemId => findOrderIdByOrderItem(itemId, entities))
                            .filter(Boolean);
                          if (orderIds.length) queryOrdersDetail(orderIds);
                          if (batchIds.length) {
                            onSetBadges(
                              batchIds.map(batchId => ({
                                id: batchId,
                                type: 'autoFilled',
                                entity: 'batch',
                              }))
                            );
                          }
                          window.requestIdleCallback(
                            () => {
                              dispatch({
                                type: 'AUTO_FILL_CLOSE',
                                payload: {},
                              });
                            },
                            {
                              timeout: 250,
                            }
                          );
                        }}
                      />
                      <DeleteItemConfirm
                        onSuccess={itemId => {
                          const parentOrderId = findOrderIdByOrderItem(itemId, entities);
                          const item = entities?.orderItems[itemId];
                          if (parentOrderId) {
                            queryOrdersDetail([parentOrderId]);
                            window.requestIdleCallback(
                              () => {
                                dispatch({
                                  type: 'DELETE_ITEM_CLOSE',
                                  payload: {},
                                });
                                dispatch({
                                  type: 'REMOVE_TARGETS',
                                  payload: {
                                    targets: [
                                      `${ORDER_ITEM}-${itemId}`,
                                      ...(item?.batches ?? []).map(
                                        batchId => `${BATCH}-${batchId}`
                                      ),
                                    ],
                                  },
                                });
                              },
                              {
                                timeout: 250,
                              }
                            );
                          }
                        }}
                      />
                      <RemoveBatchConfirm
                        onSuccess={batchId => {
                          const parentOrderId = findOrderIdByBatch(batchId, entities);
                          if (parentOrderId) {
                            queryOrdersDetail([parentOrderId]);
                            const batch = entities.batches?.[batchId] ?? {};
                            const container = entities.containers?.[batch?.container];
                            const shipment = entities.shipments?.[batch?.shipment];
                            const removeTargets = [];
                            const remainContainersCount = Object.values(entities.batches).filter(
                              (currentBatch: Object) =>
                                currentBatch.container && currentBatch.container === container?.id
                            ).length;
                            if (remainContainersCount === 1) {
                              removeTargets.push(`${CONTAINER}-${container?.id}`);
                            }
                            const remainShipmentsCount = Object.values(entities.batches).filter(
                              (currentBatch: Object) =>
                                currentBatch.shipment && currentBatch.shipment === shipment?.id
                            ).length;
                            if (remainShipmentsCount === 1) {
                              removeTargets.push(`${SHIPMENT}-${shipment?.id}`);
                            }
                            window.requestIdleCallback(
                              () => {
                                if (removeTargets.length) {
                                  dispatch({
                                    type: 'REMOVE_TARGETS',
                                    payload: {
                                      targets: removeTargets,
                                    },
                                  });
                                }
                                dispatch({
                                  type: 'REMOVE_BATCH_CLOSE',
                                  payload: {},
                                });
                              },
                              {
                                timeout: 250,
                              }
                            );
                          }
                        }}
                      />
                      <DeleteConfirm
                        onSuccess={({ orderItemIds, containerIds }) => {
                          const orderIds = [];
                          const batchIds = [];
                          orderItemIds.forEach(itemId => {
                            const parentOrderId = findOrderIdByOrderItem(itemId, entities);
                            if (parentOrderId) {
                              orderIds.push(parentOrderId);
                            }
                            batchIds.push(...(entities.orderItems?.[itemId]?.batches ?? []));
                          });

                          containerIds.forEach(containerId => {
                            const batchIdsOfContainer = Object.values(entities.batches)
                              .filter((batch: ?Object) => batch?.container === containerId)
                              .map((batch: ?Object) => batch?.id ?? '');
                            batchIdsOfContainer.forEach(batchId => {
                              if (batchId) {
                                const parentOrderId = findOrderIdByBatch(batchId, entities);
                                if (parentOrderId) {
                                  orderIds.push(parentOrderId);
                                }
                              }
                            });
                          });
                          queryOrdersDetail(orderIds);
                          window.requestIdleCallback(
                            () => {
                              dispatch({
                                type: 'REMOVE_TARGETS',
                                payload: {
                                  targets: [
                                    ...batchIds.map(batchId => `${BATCH}-${batchId}`),
                                    ...orderItemIds.map(itemId => `${ORDER_ITEM}-${itemId}`),
                                    ...containerIds.map(
                                      containerId => `${CONTAINER}-${containerId}`
                                    ),
                                  ],
                                },
                              });
                              dispatch({
                                type: 'DELETE_CLOSE',
                                payload: {},
                              });
                            },
                            {
                              timeout: 250,
                            }
                          );
                        }}
                      />
                      <DeleteBatchesConfirm onSuccess={console.warn} />
                      <DeleteBatchConfirm
                        onSuccess={batchId => {
                          const parentOrderId = findOrderIdByBatch(batchId, entities);
                          if (parentOrderId) {
                            queryOrdersDetail([parentOrderId]);
                            window.requestIdleCallback(
                              () => {
                                dispatch({
                                  type: 'REMOVE_TARGETS',
                                  payload: {
                                    targets: [`${BATCH}-${batchId}`],
                                  },
                                });
                                dispatch({
                                  type: 'DELETE_BATCH_CLOSE',
                                  payload: {},
                                });
                              },
                              {
                                timeout: 250,
                              }
                            );
                          }
                        }}
                      />
                      <EditFormSlideView
                        onClose={result => {
                          if (state.edit.type === ORDER) {
                            queryOrdersDetail([state.edit.selectedId]);
                          } else if (state.edit.orderId) {
                            queryOrdersDetail([state.edit.orderId]);
                          } else if (state.edit.orderIds && state.edit.orderIds.length) {
                            queryOrdersDetail(state.edit.orderIds);
                          }
                          if (result?.moveToTop) {
                            queryOrdersDetail([result?.id ?? ''].filter(Boolean));
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
                      {state.targets.length > 0 && (
                        <>
                          <div className={ActionsBackdropStyle} />
                          <SelectedEntity targets={state.targets} />
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
                </RelationMapContext.Provider>
              );
            }}
          </Query>
        </DndProvider>
      </div>
    </>
  );
}
