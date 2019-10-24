// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { isEnableBetaFeature } from 'utils/env';
import Icon from 'components/Icon';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import {
  targetedIds,
  findParentIdsByBatch,
  findOrderIdByItem,
  findShipmentIdByBatch,
  findShipmentIdByContainer,
  findShipmentIdsByOrderItem,
  findShipmentIdsByOrder,
} from 'modules/relationMapV2/helpers';
import ActionButton from './components/ActionButton';
import ActionSubMenu from './components/ActionSubMenu';
import ActionLabel from './components/ActionLabel';
import { ActionsWrapperStyle, LeftActionsWrapperStyle } from './style';

type Props = {
  targets: Array<string>,
};

export default function Actions({ targets }: Props) {
  const [currentMenu, setCurrentMenu] = React.useState(null);
  const { state, dispatch, selectors } = FocusedView.useContainer();
  const { mapping } = Entities.useContainer();
  const orderIds = targetedIds(targets, ORDER);
  const orderItemIds = targetedIds(targets, ORDER_ITEM);
  const batchIds = targetedIds(targets, BATCH);
  const containerIds = targetedIds(targets, CONTAINER);
  const shipmentIds = targetedIds(targets, SHIPMENT);
  const orderIsDisabled = orderIds.length === 0;
  const itemIsDisabled = orderItemIds.length === 0;
  const batchIsDisabled = batchIds.length === 0;
  const containerIsDisabled = containerIds.length === 0;
  const shipmentIsDisabled = shipmentIds.length === 0;
  const navigateToGTV = () => {
    if (selectors.isOrderFocus) {
      const ids = [...shipmentIds];
      batchIds.forEach(batchId => {
        const [, parentOrderId] = findParentIdsByBatch({
          batchId,
          viewer: state.viewer,
          entities: mapping.entities,
        });
        if (parentOrderId) ids.push(parentOrderId);
      });

      orderItemIds.forEach(orderItemId => {
        const parentOrderId = findOrderIdByItem({
          orderItemId,
          viewer: state.viewer,
          entities: mapping.entities,
        });
        if (parentOrderId) ids.push(parentOrderId);
      });

      Object.values(mapping.entities?.batches ?? {}).forEach((batch: Object) => {
        if (
          (batch.container && containerIds.includes(batch.container)) ||
          (batch.shipment && shipmentIds.includes(batch.shipment))
        ) {
          const [, parentOrderId] = findParentIdsByBatch({
            batchId: batch.id,
            viewer: state.viewer,
            entities: mapping.entities,
          });
          if (parentOrderId) ids.push(parentOrderId);
        }
      });
      navigate('/order/table', {
        state: { orderIds: [...new Set(ids)] },
      });
    } else {
      const ids = [...shipmentIds];
      batchIds.forEach(batchId => {
        const shipmentId = findShipmentIdByBatch(batchId, mapping.entities);
        if (shipmentId && !ids.includes(shipmentId)) {
          ids.push(shipmentId);
        }
      });
      containerIds.forEach(containerId => {
        const shipmentId = findShipmentIdByContainer(containerId, mapping.entities);
        if (shipmentId && !ids.includes(shipmentId)) {
          ids.push(shipmentId);
        }
      });
      orderItemIds.forEach(itemId => {
        const relateIds = findShipmentIdsByOrderItem(itemId, mapping.entities);
        relateIds.forEach(shipmentId => {
          if (shipmentId && !ids.includes(shipmentId)) {
            ids.push(shipmentId);
          }
        });
      });
      orderIds.forEach(orderId => {
        const relateIds = findShipmentIdsByOrder(orderId, mapping.entities);
        relateIds.forEach(shipmentId => {
          if (shipmentId && !ids.includes(shipmentId)) {
            ids.push(shipmentId);
          }
        });
      });
      navigate('/shipment/table', {
        state: { shipmentIds: [...new Set(ids)] },
      });
    }
  };
  // TODO: remove this flag when API is done
  const API_IS_READY = false;

  return (
    <>
      <div className={LeftActionsWrapperStyle}>
        {(!selectors.isShipmentFocus || (selectors.isShipmentFocus && isEnableBetaFeature)) && (
          <ActionButton onClick={navigateToGTV}>
            <Icon icon="TABLE" />
          </ActionButton>
        )}
        <ActionButton
          onClick={() => {
            dispatch({
              type: 'EDIT',
              payload: {
                type: 'TASKS',
                selectedId: 'tasks',
                orderIds,
                orderItemIds,
                batchIds,
                containerIds,
                shipmentIds,
              },
            });
          }}
        >
          <Icon icon="TASK" />
        </ActionButton>
      </div>
      <OutsideClickHandler
        onOutsideClick={() => setCurrentMenu(null)}
        ignoreClick={currentMenu === null}
      >
        <div className={ActionsWrapperStyle}>
          {selectors.isShipmentFocus ? (
            <>
              <ActionButton
                isDisabled={shipmentIsDisabled}
                onClick={() => {
                  if (currentMenu === SHIPMENT) setCurrentMenu(null);
                  else setCurrentMenu(SHIPMENT);
                }}
              >
                <Icon icon="SHIPMENT" />
                <ActionSubMenu isCollapsed={currentMenu !== SHIPMENT}>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'STATUS',
                        payload: {
                          source: SHIPMENT,
                        },
                      });
                    }}
                  >
                    <Icon icon="ACTIVE" /> / <Icon icon="ARCHIVE" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.ActiveOrArchive"
                        defaultMessage="ACTIVE/ARCHIVE"
                      />
                    </ActionLabel>
                  </ActionButton>

                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'TAGS',
                        payload: {
                          source: SHIPMENT,
                        },
                      });
                    }}
                  >
                    <Icon icon="TAG" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.addTags"
                        defaultMessage="ADD TAGS"
                      />
                    </ActionLabel>
                  </ActionButton>
                  {API_IS_READY && (
                    <ActionButton
                      onClick={() => {
                        setCurrentMenu(null);
                        dispatch({
                          type: 'CLONE',
                          payload: {
                            source: SHIPMENT,
                          },
                        });
                      }}
                    >
                      <Icon icon="CLONE" />
                      <ActionLabel>
                        <FormattedMessage
                          id="modules.RelationMaps.label.clone"
                          defaultMessage="CLONE"
                        />
                      </ActionLabel>
                    </ActionButton>
                  )}
                </ActionSubMenu>
              </ActionButton>

              <ActionButton
                isDisabled={containerIsDisabled}
                onClick={() => {
                  if (currentMenu === CONTAINER) setCurrentMenu(null);
                  else setCurrentMenu(CONTAINER);
                }}
              >
                <Icon icon="CONTAINER" />
                <ActionSubMenu isCollapsed={currentMenu !== CONTAINER}>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'DELETE',
                        payload: {
                          source: CONTAINER,
                        },
                      });
                    }}
                  >
                    <Icon icon="REMOVE" />
                    <ActionLabel>
                      <FormattedMessage id="components.button.delete" defaultMessage="DELETE" />
                    </ActionLabel>
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'TAGS',
                        payload: {
                          source: CONTAINER,
                        },
                      });
                    }}
                  >
                    <Icon icon="TAG" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.addTags"
                        defaultMessage="ADD TAGS"
                      />
                    </ActionLabel>
                  </ActionButton>
                  {API_IS_READY && (
                    <ActionButton
                      onClick={() => {
                        setCurrentMenu(null);
                        dispatch({
                          type: 'CLONE',
                          payload: {
                            source: CONTAINER,
                          },
                        });
                      }}
                    >
                      <Icon icon="CLONE" />
                      <ActionLabel>
                        <FormattedMessage
                          id="modules.RelationMaps.label.clone"
                          defaultMessage="CLONE"
                        />
                      </ActionLabel>
                    </ActionButton>
                  )}
                </ActionSubMenu>
              </ActionButton>

              <ActionButton
                isDisabled={batchIsDisabled}
                onClick={() => {
                  if (currentMenu === BATCH) setCurrentMenu(null);
                  else setCurrentMenu(BATCH);
                }}
              >
                <Icon icon="BATCH" />
                <ActionSubMenu isCollapsed={currentMenu !== BATCH}>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'DELETE_BATCHES',
                        payload: {
                          source: BATCH,
                        },
                      });
                    }}
                  >
                    <Icon icon="REMOVE" /> / <Icon icon="CLEAR" />
                    <ActionLabel>
                      <FormattedMessage id="components.button.delete" defaultMessage="DELETE" />
                      /
                      <FormattedMessage id="components.button.remove" defaultMessage="REMOVE" />
                    </ActionLabel>
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'TAGS',
                        payload: {
                          source: BATCH,
                        },
                      });
                    }}
                  >
                    <Icon icon="TAG" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.addTags"
                        defaultMessage="ADD TAGS"
                      />
                    </ActionLabel>
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'MOVE_BATCH',
                        payload: {},
                      });
                    }}
                  >
                    <Icon icon="EXCHANGE" />
                    <ActionLabel>
                      <FormattedMessage id="components.button.move" defaultMessage="MOVE" />
                    </ActionLabel>
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'SPLIT',
                        payload: {
                          source: BATCH,
                        },
                      });
                    }}
                  >
                    <Icon icon="SPLIT" />
                    <ActionLabel>
                      <FormattedMessage id="components.button.split" defaultMessage="SPLIT" />
                    </ActionLabel>
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'CLONE',
                        payload: {
                          source: BATCH,
                        },
                      });
                    }}
                  >
                    <Icon icon="CLONE" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.clone"
                        defaultMessage="CLONE"
                      />
                    </ActionLabel>
                  </ActionButton>
                </ActionSubMenu>
              </ActionButton>

              <ActionButton
                isDisabled={itemIsDisabled}
                onClick={() => {
                  if (currentMenu === ORDER_ITEM) setCurrentMenu(null);
                  else setCurrentMenu(ORDER_ITEM);
                }}
              >
                <Icon icon="ORDER_ITEM" />
                <ActionSubMenu isCollapsed={currentMenu !== ORDER_ITEM}>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'DELETE',
                        payload: {
                          source: ORDER_ITEM,
                        },
                      });
                    }}
                  >
                    <Icon icon="REMOVE" />
                    <ActionLabel>
                      <FormattedMessage id="components.button.delete" defaultMessage="DELETE" />
                    </ActionLabel>
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'TAGS',
                        payload: {
                          source: ORDER_ITEM,
                        },
                      });
                    }}
                  >
                    <Icon icon="TAG" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.addTags"
                        defaultMessage="ADD TAGS"
                      />
                    </ActionLabel>
                  </ActionButton>
                </ActionSubMenu>
              </ActionButton>

              <ActionButton
                isDisabled={orderIsDisabled}
                onClick={() => {
                  if (currentMenu === ORDER) setCurrentMenu(null);
                  else setCurrentMenu(ORDER);
                }}
              >
                <Icon icon="ORDER" />

                <ActionSubMenu isCollapsed={currentMenu !== ORDER}>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'STATUS',
                        payload: {
                          source: ORDER,
                        },
                      });
                    }}
                  >
                    <Icon icon="ACTIVE" /> / <Icon icon="ARCHIVE" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.ACTIVATE"
                        defaultMessage="ACTIVATE/ARCHIVE"
                      />
                    </ActionLabel>
                  </ActionButton>

                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'TAGS',
                        payload: {
                          source: ORDER,
                        },
                      });
                    }}
                  >
                    <Icon icon="TAG" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.addTags"
                        defaultMessage="ADD TAGS"
                      />
                    </ActionLabel>
                  </ActionButton>
                </ActionSubMenu>
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton
                isDisabled={orderIsDisabled}
                onClick={() => {
                  if (currentMenu === ORDER) setCurrentMenu(null);
                  else setCurrentMenu(ORDER);
                }}
              >
                <Icon icon="ORDER" />

                <ActionSubMenu isCollapsed={currentMenu !== ORDER}>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'STATUS',
                        payload: {
                          source: ORDER,
                        },
                      });
                    }}
                  >
                    <Icon icon="ACTIVE" /> / <Icon icon="ARCHIVE" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.ACTIVATE"
                        defaultMessage="ACTIVATE/ARCHIVE"
                      />
                    </ActionLabel>
                  </ActionButton>

                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'TAGS',
                        payload: {
                          source: ORDER,
                        },
                      });
                    }}
                  >
                    <Icon icon="TAG" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.addTags"
                        defaultMessage="ADD TAGS"
                      />
                    </ActionLabel>
                  </ActionButton>

                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'CLONE',
                        payload: {
                          source: ORDER,
                        },
                      });
                    }}
                  >
                    <Icon icon="CLONE" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.clone"
                        defaultMessage="CLONE"
                      />
                    </ActionLabel>
                  </ActionButton>
                </ActionSubMenu>
              </ActionButton>

              <ActionButton
                isDisabled={itemIsDisabled}
                onClick={() => {
                  if (currentMenu === ORDER_ITEM) setCurrentMenu(null);
                  else setCurrentMenu(ORDER_ITEM);
                }}
              >
                <Icon icon="ORDER_ITEM" />
                <ActionSubMenu isCollapsed={currentMenu !== ORDER_ITEM}>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'DELETE',
                        payload: {
                          source: ORDER_ITEM,
                        },
                      });
                    }}
                  >
                    <Icon icon="REMOVE" />
                    <ActionLabel>
                      <FormattedMessage id="components.button.delete" defaultMessage="DELETE" />
                    </ActionLabel>
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'TAGS',
                        payload: {
                          source: ORDER_ITEM,
                        },
                      });
                    }}
                  >
                    <Icon icon="TAG" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.addTags"
                        defaultMessage="ADD TAGS"
                      />
                    </ActionLabel>
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'MOVE_ITEM',
                        payload: {},
                      });
                    }}
                  >
                    <Icon icon="EXCHANGE" />
                    <ActionLabel>
                      <FormattedMessage id="components.button.move" defaultMessage="MOVE" />
                    </ActionLabel>
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'AUTO_FILL',
                        payload: {
                          source: ORDER_ITEM,
                        },
                      });
                    }}
                  >
                    <Icon icon="QUANTITY_ADJUSTMENTS" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.autoFill"
                        defaultMessage="AUTOFILL"
                      />
                    </ActionLabel>
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'CLONE',
                        payload: {
                          source: ORDER_ITEM,
                        },
                      });
                    }}
                  >
                    <Icon icon="CLONE" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.clone"
                        defaultMessage="CLONE"
                      />
                    </ActionLabel>
                  </ActionButton>
                </ActionSubMenu>
              </ActionButton>

              <ActionButton
                isDisabled={batchIsDisabled}
                onClick={() => {
                  if (currentMenu === BATCH) setCurrentMenu(null);
                  else setCurrentMenu(BATCH);
                }}
              >
                <Icon icon="BATCH" />
                <ActionSubMenu isCollapsed={currentMenu !== BATCH}>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'DELETE_BATCHES',
                        payload: {
                          source: BATCH,
                        },
                      });
                    }}
                  >
                    <Icon icon="REMOVE" /> / <Icon icon="CLEAR" />
                    <ActionLabel>
                      <FormattedMessage id="components.button.delete" defaultMessage="DELETE" />
                      /
                      <FormattedMessage id="components.button.remove" defaultMessage="REMOVE" />
                    </ActionLabel>
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'TAGS',
                        payload: {
                          source: BATCH,
                        },
                      });
                    }}
                  >
                    <Icon icon="TAG" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.addTags"
                        defaultMessage="ADD TAGS"
                      />
                    </ActionLabel>
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'MOVE_BATCH',
                        payload: {},
                      });
                    }}
                  >
                    <Icon icon="EXCHANGE" />
                    <ActionLabel>
                      <FormattedMessage id="components.button.move" defaultMessage="MOVE" />
                    </ActionLabel>
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'SPLIT',
                        payload: {
                          source: BATCH,
                        },
                      });
                    }}
                  >
                    <Icon icon="SPLIT" />
                    <ActionLabel>
                      <FormattedMessage id="components.button.split" defaultMessage="SPLIT" />
                    </ActionLabel>
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'CLONE',
                        payload: {
                          source: BATCH,
                        },
                      });
                    }}
                  >
                    <Icon icon="CLONE" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.clone"
                        defaultMessage="CLONE"
                      />
                    </ActionLabel>
                  </ActionButton>
                </ActionSubMenu>
              </ActionButton>

              <ActionButton
                isDisabled={containerIsDisabled}
                onClick={() => {
                  if (currentMenu === CONTAINER) setCurrentMenu(null);
                  else setCurrentMenu(CONTAINER);
                }}
              >
                <Icon icon="CONTAINER" />
                <ActionSubMenu isCollapsed={currentMenu !== CONTAINER}>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'DELETE',
                        payload: {
                          source: CONTAINER,
                        },
                      });
                    }}
                  >
                    <Icon icon="REMOVE" />
                    <ActionLabel>
                      <FormattedMessage id="components.button.delete" defaultMessage="DELETE" />
                    </ActionLabel>
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'TAGS',
                        payload: {
                          source: CONTAINER,
                        },
                      });
                    }}
                  >
                    <Icon icon="TAG" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.addTags"
                        defaultMessage="ADD TAGS"
                      />
                    </ActionLabel>
                  </ActionButton>
                </ActionSubMenu>
              </ActionButton>

              <ActionButton
                isDisabled={shipmentIsDisabled}
                onClick={() => {
                  if (currentMenu === SHIPMENT) setCurrentMenu(null);
                  else setCurrentMenu(SHIPMENT);
                }}
              >
                <Icon icon="SHIPMENT" />
                <ActionSubMenu isCollapsed={currentMenu !== SHIPMENT}>
                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'STATUS',
                        payload: {
                          source: SHIPMENT,
                        },
                      });
                    }}
                  >
                    <Icon icon="ACTIVE" /> / <Icon icon="ARCHIVE" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.ActiveOrArchive"
                        defaultMessage="ACTIVE/ARCHIVE"
                      />
                    </ActionLabel>
                  </ActionButton>

                  <ActionButton
                    onClick={() => {
                      setCurrentMenu(null);
                      dispatch({
                        type: 'TAGS',
                        payload: {
                          source: SHIPMENT,
                        },
                      });
                    }}
                  >
                    <Icon icon="TAG" />
                    <ActionLabel>
                      <FormattedMessage
                        id="modules.RelationMaps.label.addTags"
                        defaultMessage="ADD TAGS"
                      />
                    </ActionLabel>
                  </ActionButton>
                </ActionSubMenu>
              </ActionButton>
            </>
          )}
        </div>
      </OutsideClickHandler>
    </>
  );
}
