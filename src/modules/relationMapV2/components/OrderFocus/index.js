// @flow
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import InfiniteLoader from 'react-window-infinite-loader';
import { VariableSizeList as List } from 'react-window';
import { Query } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import scrollIntoView from 'scroll-into-view-if-needed';
import apolloClient from 'apollo';
import usePrevious from 'hooks/usePrevious';
import useWindowSize from 'hooks/useWindowSize';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import { Display } from 'components/Form';
import { orderFocusedListQuery, orderFullFocusDetailQuery } from 'modules/relationMapV2/query';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import {
  Hits,
  Entities,
  SortAndFilter,
  ClientSorts,
  ExpandRows,
  GlobalExpanded,
  FocusedView,
} from 'modules/relationMapV2/store';
import { loadMore, findOrderIdByItem, findParentIdsByBatch } from 'modules/relationMapV2/helpers';
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
import HotKeyHandlers from '../HotKeyHandlers';
import { OrderFocusedRow } from '../Row';
import generateListData from './generateListData';
import normalize from './normalize';
import RemoveBatchConfirm from '../RemoveBatchConfirm';
import DeleteBatchesConfirm from '../DeleteBatchesConfirm';
import MoveItem from '../MoveItem';
import MoveBatch from '../MoveBatch';
import AddTags from '../AddTags';
import DeleteConfirm from '../DeleteConfirm';
import AddFollowers from '../AddFollowers';
import SplitBatches from '../SplitBatches';
import InitLoadingPlaceholder from '../InitLoadingPlaceholder';
import { WrapperStyle, ListStyle, ActionsBackdropStyle, NoOrdersFoundStyle } from './style';

const hasMoreItems = (data: Object, model: string = 'orders') => {
  const nextPage = getByPathWithDefault(1, `${model}.page`, data) + 1;
  const totalPage = getByPathWithDefault(1, `${model}.totalPage`, data);
  return nextPage <= totalPage;
};

const innerElementType = React.forwardRef(
  ({ children, ...rest }: {| children: React.Node |}, ref) => (
    <div ref={ref} {...rest}>
      <Header />
      {children}
    </div>
  )
);

export default function OrderFocus() {
  const [, innerHeight] = useWindowSize();
  const listRef = React.createRef();
  const scrollEntity = React.useRef({
    type: '',
    id: '',
  });
  const { expandRows, setExpandRows } = ExpandRows.useContainer();
  const { expandAll } = GlobalExpanded.useContainer();
  const [scrollPosition, setScrollPosition] = React.useState(-1);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
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
  }, [lastQueryVariables, queryVariables, setExpandRows]);

  const scrollToRow = React.useCallback(
    // eslint-disable-next-line
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
  const queryOrdersDetail = React.useCallback(
    (orderIds: Array<string>) => {
      if (orderIds.length) {
        apolloClient
          .query({
            query: orderFullFocusDetailQuery,
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
    [dispatch]
  );

  return (
    <>
      <div className={WrapperStyle}>
        <HotKeyHandlers />
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
                getItemsSortByOrderId,
                getBatchesSortByItemId,
                getRelatedBy,
                newBatchIDs: state.newBatchIDs,
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
                        'orders',
                        {
                          fetchMore,
                          data,
                          onSuccess: () => {
                            setIsLoadingMore(false);
                          },
                        },
                        queryVariables
                      ).then((res: any) => {
                        const moreOrders = res?.data?.orders?.nodes ?? [];
                        if (expandAll) {
                          setExpandRows([...expandRows, ...moreOrders.map(order => order?.id)]);
                        }
                      });
                    };
              const entities = normalize({ orders });
              initMapping({
                orders,
                entities,
              });
              return (
                <>
                  <MoveEntityConfirm
                    onSuccess={orderIds => {
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
                    onSuccess={({ sources, orderIds, cloneEntities, newOrderItemPositions }) => {
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
                      dispatch({
                        type: 'CLONE_END',
                        payload: {
                          sources,
                          cloneEntities,
                        },
                      });
                      queryOrdersDetail([...orderIds, ...newOrderIds]);
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
                        const originalItems = (entities.orders?.[orderId]?.orderItems ?? []).map(
                          itemId => entities.orderItems?.[itemId]
                        );
                        const itemList = getItemsSortByOrderId({
                          getRelatedBy,
                          id: orderId,
                          orderItems: originalItems,
                        });
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
                  <MoveItem
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
                            type: 'MOVE_ITEM_END',
                            payload: {},
                          });
                        },
                        {
                          timeout: 250,
                        }
                      );
                    }}
                  />
                  <MoveBatch
                    onSuccess={orderIds => {
                      queryOrdersDetail(orderIds);
                      if (state.moveActions?.type?.includes('Order')) {
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
                      }
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
                  {state.split.isOpen && (
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
                  )}
                  <InlineCreateBatch
                    onSuccess={orderId => {
                      if (orderId) {
                        queryOrdersDetail([orderId]);

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
                    }}
                  />
                  <AutoFill
                    onSuccess={(itemIds, batchIds) => {
                      const orderIds = itemIds
                        .map(orderItemId =>
                          findOrderIdByItem({ orderItemId, entities, viewer: ORDER })
                        )
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
                    onSuccess={orderItemId => {
                      const parentOrderId = findOrderIdByItem({
                        orderItemId,
                        entities,
                        viewer: ORDER,
                      });
                      const item = entities?.orderItems[orderItemId];
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
                                  `${ORDER_ITEM}-${orderItemId}`,
                                  ...(item?.batches ?? []).map(batchId => `${BATCH}-${batchId}`),
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
                      const [, parentOrderId] = findParentIdsByBatch({
                        batchId,
                        entities,
                        viewer: ORDER,
                      });
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
                  {state.followers.isOpen && <AddFollowers />}
                  <DeleteConfirm
                    onSuccess={({ orderItemIds, containerIds }) => {
                      const orderIds = [];
                      const batchIds = [];
                      orderItemIds.forEach(orderItemId => {
                        const parentOrderId = findOrderIdByItem({
                          orderItemId,
                          entities,
                          viewer: ORDER,
                        });
                        if (parentOrderId) {
                          orderIds.push(parentOrderId);
                        }
                        batchIds.push(...(entities.orderItems?.[orderItemId]?.batches ?? []));
                      });

                      containerIds.forEach(containerId => {
                        const batchIdsOfContainer = Object.values(entities.batches)
                          .filter((batch: ?Object) => batch?.container === containerId)
                          .map((batch: ?Object) => batch?.id ?? '');
                        batchIdsOfContainer.forEach(batchId => {
                          if (batchId) {
                            const [, parentOrderId] = findParentIdsByBatch({
                              batchId,
                              entities,
                              viewer: ORDER,
                            });
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
                                ...containerIds.map(containerId => `${CONTAINER}-${containerId}`),
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
                  <DeleteBatchesConfirm
                    onSuccess={(batchIds, isRemoveTargeting) => {
                      const orderIds = batchIds
                        .map(batchId => {
                          const [, parentOrderId] = findParentIdsByBatch({
                            batchId,
                            entities,
                            viewer: ORDER,
                          });
                          return parentOrderId;
                        })
                        .filter(Boolean);
                      queryOrdersDetail(orderIds);
                      window.requestIdleCallback(
                        () => {
                          if (isRemoveTargeting) {
                            dispatch({
                              type: 'REMOVE_TARGETS',
                              payload: {
                                targets: batchIds.map(batchId => `${BATCH}-${batchId}`),
                              },
                            });
                          }
                          dispatch({
                            type: 'DELETE_BATCHES_CLOSE',
                            payload: {},
                          });
                        },
                        {
                          timeout: 250,
                        }
                      );
                    }}
                  />
                  <DeleteBatchConfirm
                    onSuccess={batchId => {
                      const [, parentOrderId] = findParentIdsByBatch({
                        batchId,
                        entities,
                        viewer: ORDER,
                      });
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
                  {orders.length > 0 ? (
                    <>
                      <InfiniteLoader
                        isItemLoaded={isItemLoaded}
                        itemCount={hasMoreItems(data, 'orders') ? rowCount + 1 : rowCount}
                        loadMoreItems={loadMoreItems}
                        threshold={5}
                      >
                        {({ onItemsRendered, ref }) => (
                          // $FlowIgnore: doesn't support
                          <List
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
                            height={innerHeight - 50}
                            width="100%"
                            overscanCount={1}
                          >
                            {OrderFocusedRow}
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
