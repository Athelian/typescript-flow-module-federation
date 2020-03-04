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
import { SHIPMENT, CONTAINER, BATCH, ORDER_ITEM, ORDER } from 'modules/relationMapV2/constants';
import {
  shipmentFocusedListQuery,
  shipmentFullFocusDetailQuery,
} from 'modules/relationMapV2/query';
import {
  loadMore,
  findShipmentIdByContainer,
  findShipmentIdByBatch,
  findParentIdsByBatch,
  findOrderIdByItem,
} from 'modules/relationMapV2/helpers';
import {
  Hits,
  Entities,
  SortAndFilter,
  ExpandRows,
  GlobalExpanded,
  FocusedView,
  ClientSorts,
} from 'modules/relationMapV2/store';
import EditFormSlideView from '../EditFormSlideView';
import SelectedEntity from '../SelectedEntity';
import SplitBatches from '../SplitBatches';
import MoveBatch from '../MoveBatch';
import CloneEntities from '../CloneEntities';
import InlineCreateContainer from '../InlineCreateContainer';
import DeleteContainerConfirm from '../DeleteContainerConfirm';
import DeleteConfirm from '../DeleteConfirm';
import RemoveBatchConfirm from '../RemoveBatchConfirm';
import DeleteBatchConfirm from '../DeleteBatchConfirm';
import DeleteBatchesConfirm from '../DeleteBatchesConfirm';
import StatusConfirm from '../StatusConfirm';
import MoveEntityConfirm from '../MoveEntityConfirm';
import AddTags from '../AddTags';
import Actions from '../Actions';
import Header from '../Header';
import HotKeyHandlers from '../HotKeyHandlers';
import { ShipmentFocusedRow } from '../Row';
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
  ({ children, ...rest }: {| children: React.Node |}, ref) => (
    <div ref={ref} {...rest}>
      <Header />
      {children}
    </div>
  )
);

export default function ShipmentFocus() {
  const [, innerHeight] = useWindowSize();
  const listRef = React.createRef();
  const scrollEntity = React.useRef({
    type: '',
    id: '',
  });
  const { expandRows, setExpandRows } = ExpandRows.useContainer();
  const {
    getContainersSortByShipmentId,
    getBatchesSortByShipmentId,
    getBatchesSortByContainerId,
  } = ClientSorts.useContainer();
  const { expandAll } = GlobalExpanded.useContainer();
  const [scrollPosition, setScrollPosition] = React.useState(-1);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const { initHits } = Hits.useContainer();
  const {
    initMapping,
    getRelatedBy,
    onSetBadges,
    onSetCloneRelated,
    onSetSplitBatchRelated,
  } = Entities.useContainer();
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
        <HotKeyHandlers />
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
                getContainersSortByShipmentId,
                getBatchesSortByShipmentId,
                getBatchesSortByContainerId,
                getRelatedBy,
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
                        'shipments',
                        {
                          fetchMore,
                          data,
                          onSuccess: () => {
                            setIsLoadingMore(false);
                          },
                        },
                        queryVariables
                      ).then((res: any) => {
                        const moreShipments = res?.data?.shipments?.nodes ?? [];
                        if (expandAll) {
                          setExpandRows([
                            ...expandRows,
                            ...moreShipments.map(shipment => shipment?.id),
                          ]);
                        }
                      });
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
                      } else if (state.edit.shipmentId) {
                        queryShipmentsDetail([state.edit.shipmentId]);
                      } else if (state.edit.shipmentIds && state.edit.shipmentIds.length) {
                        queryShipmentsDetail(state.edit.shipmentIds);
                      }
                      if (result?.moveToTop) {
                        const shipmentId = state.edit.shipment?.id ?? '';
                        if (result?.type === SHIPMENT) {
                          queryShipmentsDetail([result?.id ?? ''].filter(Boolean));
                        } else {
                          // move to new container
                          queryShipmentsDetail([shipmentId].filter(Boolean));
                        }
                        scrollToRow({
                          position: 0,
                          id: result?.id ?? '',
                          type: result?.type ?? '',
                        });
                      }
                      window.requestIdleCallback(
                        () => {
                          dispatch({
                            type: 'EDIT',
                            payload: {
                              type: '',
                              selectedId: '',
                            },
                          });
                        },
                        {
                          timeout: 250,
                        }
                      );
                    }}
                  />
                  <DeleteConfirm
                    onSuccess={({ orderItemIds, containerIds }) => {
                      const orderIds = [];
                      const batchIds = [];
                      let targets = [];

                      if (orderItemIds.length) {
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
                        targets = [
                          ...batchIds.map(batchId => `${BATCH}-${batchId}`),
                          ...orderItemIds.map(itemId => `${ORDER_ITEM}-${itemId}`),
                        ];
                      }

                      if (containerIds) {
                        const ids = containerIds.map(containerId =>
                          findShipmentIdByContainer(containerId, entities)
                        );
                        queryShipmentsDetail(ids);
                        targets = [
                          ...targets,
                          ...containerIds.map(containerId => `${CONTAINER}-${containerId}`),
                        ];
                      }

                      window.requestIdleCallback(
                        () => {
                          dispatch({
                            type: 'DELETE_CLOSE',
                            payload: {},
                          });
                          dispatch({
                            type: 'REMOVE_TARGETS',
                            payload: {
                              targets,
                            },
                          });
                        },
                        {
                          timeout: 250,
                        }
                      );
                    }}
                  />
                  <DeleteContainerConfirm
                    onSuccess={containerId => {
                      const ids = [findShipmentIdByContainer(containerId, entities)];
                      queryShipmentsDetail(ids);
                      window.requestIdleCallback(
                        () => {
                          dispatch({
                            type: 'DELETE_CONTAINER_CLOSE',
                            payload: { containerId },
                          });
                          dispatch({
                            type: 'REMOVE_TARGETS',
                            payload: {
                              targets: [`${CONTAINER}-${containerId}`],
                            },
                          });
                        },
                        {
                          timeout: 250,
                        }
                      );
                    }}
                  />
                  <MoveEntityConfirm
                    onSuccess={ids => {
                      queryShipmentsDetail(ids);
                      dispatch({
                        type: 'CONFIRM_MOVE_END',
                        payload: { ids },
                      });
                    }}
                  />
                  <StatusConfirm
                    onSuccess={ids => {
                      queryShipmentsDetail(ids);
                      dispatch({
                        type: 'STATUS_END',
                        payload: { ids },
                      });
                    }}
                  />
                  <CloneEntities
                    onSuccess={({ sources, shipmentIds, cloneEntities }) => {
                      const cloneBadges = [];
                      const newShipmentIds = [];
                      cloneEntities.forEach(cloneResult => {
                        if (cloneResult?.data?.shipmentCloneMany?.length ?? 0) {
                          const shipmentsClone = cloneResult?.data?.shipmentCloneMany ?? [];
                          newShipmentIds.push(...shipmentsClone.map(shipment => shipment?.id));
                          shipmentsClone.forEach(shipment => {
                            cloneBadges.push({
                              id: shipment?.id,
                              type: 'cloned',
                              entity: 'shipment',
                            });
                            cloneBadges.push(
                              ...(shipment?.containers ?? []).map(container => ({
                                id: container?.id,
                                type: 'cloned',
                                entity: 'container',
                              }))
                            );
                            cloneBadges.push(
                              ...(shipment?.batches ?? []).map(batch => ({
                                id: batch?.id,
                                type: 'cloned',
                                entity: 'batch',
                              }))
                            );
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
                        if (cloneResult?.data?.containerCloneMany?.length ?? 0) {
                          const containersClone = cloneResult?.data?.containerCloneMany ?? [];
                          containersClone.forEach(container => {
                            cloneBadges.push({
                              id: container?.id,
                              type: 'cloned',
                              entity: 'container',
                            });
                            cloneBadges.push(
                              ...(container?.batches ?? []).map(batch => ({
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
                      queryShipmentsDetail([...shipmentIds, ...newShipmentIds]);
                      onSetBadges(cloneBadges);
                      onSetCloneRelated(sources, cloneEntities);
                    }}
                  />
                  <InlineCreateContainer
                    onSuccess={(shipmentId, container) => {
                      if (shipmentId) {
                        queryShipmentsDetail([shipmentId]);
                        const node = document.querySelector(`#${CONTAINER}-${container?.id}`);
                        if (node) {
                          // on UI, found the DOM, then try to scroll the center position
                          scrollIntoView(node, {
                            behavior: 'smooth',
                            scrollMode: 'if-needed',
                          });
                        } else {
                          // TODO: scroll to the position
                          window.requestIdleCallback(
                            () => {
                              dispatch({
                                type: 'CREATE_CONTAINER_CLOSE',
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
                  <MoveBatch
                    onSuccess={(_, shipmentIds) => {
                      queryShipmentsDetail(shipmentIds);
                      if (state.moveActions?.type?.includes('Shipment')) {
                        // scroll to first orderId if that is exist on UI
                        const shipmentId = shipmentIds[0];
                        const indexPosition = shipmentsData.findIndex((row: Array<any>) => {
                          const [shipmentCell, , , ,] = row;
                          return Number(shipmentCell.shipment?.id) === Number(shipmentId);
                        });
                        scrollToRow({
                          position: indexPosition,
                          id: shipmentId,
                          type: SHIPMENT,
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
                      onSuccess={(_, batchIds) => {
                        onSetBadges(
                          Object.keys(batchIds).map(id => ({
                            id: batchIds[id],
                            type: 'split',
                            entity: 'batch',
                          }))
                        );
                        onSetSplitBatchRelated(batchIds);
                        queryShipmentsDetail(
                          Object.keys(batchIds)
                            .map(batchId => findShipmentIdByBatch(batchId, entities))
                            .filter(Boolean)
                        );
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
                  <DeleteBatchConfirm
                    onSuccess={batchId => {
                      queryShipmentsDetail([findShipmentIdByBatch(batchId, entities)]);
                      const [itemId, orderId] = findParentIdsByBatch({
                        batchId,
                        entities,
                        viewer: state.viewer,
                      });
                      const removeTargets = [];
                      const remainItemsCount = Object.values(entities.batches).filter(
                        (currentBatch: Object) =>
                          currentBatch.container && currentBatch.orderItem === itemId
                      ).length;
                      if (!entities.batches?.[batchId]?.container) {
                        removeTargets.push(`${BATCH}-${batchId}`);
                      }
                      if (remainItemsCount === 1 && orderId && itemId) {
                        removeTargets.push(`${ORDER}-${orderId}`);
                        removeTargets.push(`${ORDER_ITEM}-${itemId}`);
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
                    }}
                  />
                  <DeleteBatchesConfirm
                    onSuccess={(batchIds, isRemoveTargeting) => {
                      queryShipmentsDetail(
                        batchIds.map(batchId => findShipmentIdByBatch(batchId, entities))
                      );
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

                  <RemoveBatchConfirm
                    onSuccess={batchId => {
                      queryShipmentsDetail([findShipmentIdByBatch(batchId, entities)]);
                      const [itemId, orderId] = findParentIdsByBatch({
                        batchId,
                        entities,
                        viewer: state.viewer,
                      });
                      const removeTargets = [];
                      const remainItemsCount = Object.values(entities.batches).filter(
                        (currentBatch: Object) =>
                          currentBatch.container && currentBatch.orderItem === itemId
                      ).length;
                      if (!entities.batches?.[batchId]?.container) {
                        removeTargets.push(`${BATCH}-${batchId}`);
                      }
                      if (remainItemsCount === 1 && orderId && itemId) {
                        removeTargets.push(`${ORDER}-${orderId}`);
                        removeTargets.push(`${ORDER_ITEM}-${itemId}`);
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
                    }}
                  />
                  <AddTags
                    onSuccess={ids => {
                      queryShipmentsDetail(ids);
                      dispatch({
                        type: 'TAGS_END',
                        payload: { ids },
                      });
                    }}
                  />
                  {shipments.length > 0 ? (
                    <>
                      <InfiniteLoader
                        isItemLoaded={isItemLoaded}
                        itemCount={hasMoreItems(data, 'shipments') ? rowCount + 1 : rowCount}
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
                            itemData={shipmentsData}
                            className={ListStyle}
                            itemCount={hasMoreItems(data, 'shipments') ? rowCount + 1 : rowCount}
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
                            {ShipmentFocusedRow}
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
