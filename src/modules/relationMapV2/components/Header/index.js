// @flow
import * as React from 'react';
import type { IntlShape } from 'react-intl';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Label } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import { useViewerHasPermissions } from 'contexts/Permissions';
import {
  ORDER,
  ORDER_ITEM,
  BATCH,
  CONTAINER,
  SHIPMENT,
  ORDER_WIDTH,
  ORDER_ITEM_WIDTH,
  BATCH_WIDTH,
  CONTAINER_WIDTH,
  SHIPMENT_WIDTH,
} from 'modules/relationMapV2/constants';
import { ORDER_CREATE } from 'modules/permission/constants/order';
import { SHIPMENT_CREATE } from 'modules/permission/constants/shipment';
import Icon from 'components/Icon';
import orderMessages from 'modules/order/messages';
import orderItemMessages from 'modules/orderItem/messages';
import batchMessages from 'modules/batch/messages';
import containerMessages from 'modules/container/messages';
import shipmentMessages from 'modules/shipment/messages';
import MiniShipmentTimeline from 'modules/relationMapV2/components/MiniShipmentTimeline';
import { targetedIds } from 'modules/relationMapV2/helpers';
import {
  Entities,
  SortAndFilter,
  ClientSorts,
  GlobalShipmentPoint,
  FocusedView,
} from 'modules/relationMapV2/store';
import { SortInput } from 'components/NavBar';
import {
  EntitiesNavbarWrapperStyle,
  EntityNavbarWrapperStyle,
  EntityIconWrapperStyle,
  EntityIconStyle,
  TitleWrapperStyle,
  CreateNewTitleWrapperStyle,
  CreateNewButtonCollapsedStyle,
  CreateNewButtonStyle,
  SelectAllButtonStyle,
  SortInputWrapperStyle,
  ShipmentTimelineWrapperStyle,
} from './style';

type Props = { intl: IntlShape };

function currentSort(
  fields: Array<Object>,
  sort: Object
): {
  title: string | React.Node,
  value: string,
} {
  const found = fields.find(item => item.value === sort.field);
  if (found) return found;
  return fields[0];
}

const Header = React.memo<any>(
  injectIntl(({ intl }: Props) => {
    const { state, dispatch, selectors } = FocusedView.useContainer();
    const { mapping } = Entities.useContainer();
    const { entities } = mapping;
    const { filterAndSort, onChangeFilter } = SortAndFilter.useContainer();
    const clientSorts = ClientSorts.useContainer();
    const { globalShipmentPoint, setGlobalShipmentPoint } = GlobalShipmentPoint.useContainer();
    const hasPermissions = useViewerHasPermissions();
    const orderSort = [
      { title: intl.formatMessage(orderMessages.updatedAt), value: 'updatedAt' },
      { title: intl.formatMessage(orderMessages.createdAt), value: 'createdAt' },
      { title: intl.formatMessage(orderMessages.poSort), value: 'poNo' },
      { title: intl.formatMessage(orderMessages.piSort), value: 'piNo' },
      { title: intl.formatMessage(orderMessages.date), value: 'issuedAt' },
      { title: intl.formatMessage(orderMessages.exporterName), value: 'exporterName' },
      { title: intl.formatMessage(orderMessages.currency), value: 'currency' },
      { title: intl.formatMessage(orderMessages.incoterm), value: 'incoterm' },
      { title: intl.formatMessage(orderMessages.deliveryPlace), value: 'deliveryPlace' },
    ];
    const itemSort = [
      { title: intl.formatMessage(orderItemMessages.updatedAt), value: 'updatedAt' },
      { title: intl.formatMessage(orderItemMessages.createdAt), value: 'createdAt' },
      { title: intl.formatMessage(orderItemMessages.no), value: 'no' },
      { title: intl.formatMessage(orderItemMessages.currency), value: 'currency' },
      { title: intl.formatMessage(orderItemMessages.productName), value: 'productName' },
      { title: intl.formatMessage(orderItemMessages.productSerial), value: 'productSerial' },
      {
        title: intl.formatMessage(orderItemMessages.productProviderName),
        value: 'productProviderName',
      },
      { title: intl.formatMessage(orderItemMessages.supplierName), value: 'supplierName' },
    ];
    const batchSort = [
      { title: intl.formatMessage(batchMessages.updatedAt), value: 'updatedAt' },
      { title: intl.formatMessage(batchMessages.createdAt), value: 'createdAt' },
      { title: intl.formatMessage(batchMessages.batchNo), value: 'no' },
      { title: intl.formatMessage(batchMessages.deliveredAt), value: 'deliveredAt' },
      { title: intl.formatMessage(batchMessages.expiredAt), value: 'expiredAt' },
      { title: intl.formatMessage(batchMessages.producedAt), value: 'producedAt' },
    ];
    const containerSort = [
      { title: intl.formatMessage(containerMessages.updatedAt), value: 'updatedAt' },
      { title: intl.formatMessage(containerMessages.createdAt), value: 'createdAt' },
      { title: intl.formatMessage(containerMessages.warehouseName), value: 'warehouseName' },
      {
        title: intl.formatMessage(containerMessages.warehouseArrivalActualDate),
        value: 'warehouseArrivalActualDate',
      },
      {
        title: intl.formatMessage(containerMessages.warehouseArrivalAgreedDate),
        value: 'warehouseArrivalAgreedDate',
      },
    ];
    const shipmentSort = [
      { title: intl.formatMessage(shipmentMessages.updatedAt), value: 'updatedAt' },
      { title: intl.formatMessage(shipmentMessages.createdAt), value: 'createdAt' },
      { title: intl.formatMessage(shipmentMessages.shipmentId), value: 'no' },
      { title: intl.formatMessage(shipmentMessages.blNo), value: 'blNo' },
      { title: intl.formatMessage(shipmentMessages.vesselName), value: 'vesselName' },
      { title: intl.formatMessage(shipmentMessages.cargoReady), value: 'cargoReady' },
      {
        title: intl.formatMessage(shipmentMessages.loadPortDeparture),
        value: 'loadPortDeparture',
      },
      {
        title: intl.formatMessage(shipmentMessages.firstTransitPortArrival),
        value: 'firstTransitPortArrival',
      },
      {
        title: intl.formatMessage(shipmentMessages.firstTransitPortDeparture),
        value: 'firstTransitPortDeparture',
      },
      {
        title: intl.formatMessage(shipmentMessages.secondTransitPortArrival),
        value: 'secondTransitPortArrival',
      },
      {
        title: intl.formatMessage(shipmentMessages.secondTransitPortDeparture),
        value: 'secondTransitPortDeparture',
      },
      {
        title: intl.formatMessage(shipmentMessages.dischargePortArrival),
        value: 'dischargePortArrival',
      },
      {
        title: intl.formatMessage(shipmentMessages.customClearance),
        value: 'customClearance',
      },
      { title: intl.formatMessage(shipmentMessages.warehouseArrival), value: 'warehouseArrival' },
      {
        title: intl.formatMessage(shipmentMessages.deliveryReady),
        value: 'deliveryReady',
      },
    ];

    const orderCount = Object.keys(entities.orders || {}).length;
    const itemCount = Object.keys(entities.orderItems || {}).length;
    const batchCount = Object.keys(entities.batches || {}).length;
    const containerCount = Object.keys(entities.containers || {}).length;
    const shipmentCount = Object.keys(entities.shipments || {}).length;

    const selectedOrdersCount = targetedIds(state.targets, ORDER).length;
    const selectedItemsCount = targetedIds(state.targets, ORDER_ITEM).length;
    const selectedBatchesCount = targetedIds(state.targets, BATCH).length;
    const selectedContainersCount = targetedIds(state.targets, CONTAINER).length;
    const selectedShipmentsCount = targetedIds(state.targets, SHIPMENT).length;

    if (selectors.isShipmentFocus)
      return (
        <div className={EntitiesNavbarWrapperStyle}>
          <div className={EntityNavbarWrapperStyle('SHIPMENT', SHIPMENT_WIDTH + 150)}>
            <div className={EntityIconWrapperStyle}>
              <div className={EntityIconStyle}>
                <Icon icon="SHIPMENT" />
              </div>
            </div>

            <div className={TitleWrapperStyle}>
              <div className={CreateNewTitleWrapperStyle(hasPermissions(SHIPMENT_CREATE))}>
                <Label color="WHITE">
                  <FormattedMessage id="modules.SideBar.shipment" />
                  {' ('}
                  <FormattedNumber value={shipmentCount} />
                  {')'}
                </Label>

                {hasPermissions(SHIPMENT_CREATE) && (
                  <>
                    <div className={CreateNewButtonCollapsedStyle}>
                      <Icon icon="ADD" />
                    </div>

                    <button
                      className={CreateNewButtonStyle}
                      onClick={() => {
                        dispatch({
                          type: 'EDIT',
                          payload: {
                            type: 'NEW_SHIPMENT',
                            selectedId: Date.now(),
                          },
                        });
                      }}
                      type="button"
                    >
                      <FormattedMessage
                        id="modules.RelationMaps.label.newShipment"
                        defaultMessage="NEW SHIPMENT"
                      />
                      <Icon icon="ADD" />
                    </button>
                  </>
                )}
              </div>
              <button
                type="button"
                className={SelectAllButtonStyle}
                onClick={() => {
                  const targets = Object.keys(entities.shipments || {}).map(
                    id => `${SHIPMENT}-${id}`
                  );
                  dispatch({
                    type: 'TARGET_ALL',
                    payload: {
                      targets,
                    },
                  });
                }}
              >
                {selectedShipmentsCount === shipmentCount ? (
                  <FormattedMessage
                    id="components.button.unselectAll"
                    defaultMessage="UNSELECT ALL"
                  />
                ) : (
                  <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
                )}

                <Icon icon="CHECKED" />
              </button>
            </div>

            <div className={SortInputWrapperStyle}>
              <SortInput
                invertColors
                width="125px"
                sort={currentSort(shipmentSort, filterAndSort.sort)}
                ascending={filterAndSort.sort.direction !== 'DESCENDING'}
                fields={shipmentSort}
                sortable
                onChange={({ field: { value }, ascending }) => {
                  onChangeFilter({
                    ...filterAndSort,
                    sort: {
                      field: value,
                      direction: ascending ? 'ASCENDING' : 'DESCENDING',
                    },
                  });
                  dispatch({
                    type: 'RESET_NEW_SHIPMENTS',
                    payload: {},
                  });
                }}
              />
            </div>

            <div className={ShipmentTimelineWrapperStyle}>
              <Label align="center" height="15px" color="TEAL">
                <FormattedMessage id={`modules.Shipments.${globalShipmentPoint}`} />
              </Label>

              <MiniShipmentTimeline
                shipment={{ voyages: [{}, {}, {}] }}
                activePoint={globalShipmentPoint}
                onChangeActivePoint={point => setGlobalShipmentPoint(point)}
              />
            </div>
          </div>

          <div className={EntityNavbarWrapperStyle('CONTAINER', CONTAINER_WIDTH)}>
            <div className={EntityIconWrapperStyle}>
              <div className={EntityIconStyle}>
                <Icon icon="CONTAINER" />
              </div>
            </div>

            <div className={TitleWrapperStyle}>
              <Label color="WHITE">
                <FormattedMessage id="modules.SideBar.container" />
                {' ('}
                <FormattedNumber value={containerCount} />
                {')'}
              </Label>

              <button
                type="button"
                className={SelectAllButtonStyle}
                onClick={() => {
                  const targets = Object.keys(entities.containers || {}).map(
                    id => `${CONTAINER}-${id}`
                  );
                  dispatch({
                    type: 'TARGET_ALL',
                    payload: {
                      targets,
                    },
                  });
                }}
              >
                {selectedContainersCount === containerCount ? (
                  <FormattedMessage
                    id="components.button.unselectAll"
                    defaultMessage="UNSELECT ALL"
                  />
                ) : (
                  <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
                )}

                <Icon icon="CHECKED" />
              </button>
            </div>
            <div className={SortInputWrapperStyle}>
              <SortInput
                invertColors
                sort={currentSort(containerSort, clientSorts?.filterAndSort?.container?.sort)}
                ascending={clientSorts?.filterAndSort?.container?.sort?.direction !== 'DESCENDING'}
                fields={containerSort}
                sortable
                onChange={({ field: { value }, ascending }) => {
                  clientSorts.onChangeFilter({
                    mapping,
                    type: 'container',
                    newFilter: {
                      sort: {
                        field: value,
                        direction: ascending ? 'ASCENDING' : 'DESCENDING',
                      },
                    },
                  });
                }}
              />
            </div>
          </div>

          <div className={EntityNavbarWrapperStyle('BATCH', BATCH_WIDTH)}>
            <div className={EntityIconWrapperStyle}>
              <div className={EntityIconStyle}>
                <Icon icon="BATCH" />
              </div>
            </div>

            <div className={TitleWrapperStyle}>
              <Label color="WHITE">
                <FormattedMessage id="modules.SideBar.batch" />
                {' ('}
                <FormattedNumber value={batchCount} />
                {')'}
              </Label>

              <button
                type="button"
                className={SelectAllButtonStyle}
                onClick={() => {
                  const targets = Object.keys(entities.batches || {}).map(id => `${BATCH}-${id}`);
                  dispatch({
                    type: 'TARGET_ALL',
                    payload: {
                      targets,
                    },
                  });
                }}
              >
                {selectedBatchesCount === batchCount ? (
                  <FormattedMessage
                    id="components.button.unselectAll"
                    defaultMessage="UNSELECT ALL"
                  />
                ) : (
                  <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
                )}

                <Icon icon="CHECKED" />
              </button>
            </div>

            <div className={SortInputWrapperStyle}>
              <SortInput
                invertColors
                sort={currentSort(batchSort, clientSorts?.filterAndSort?.batch?.sort)}
                ascending={clientSorts?.filterAndSort?.batch?.sort?.direction !== 'DESCENDING'}
                fields={batchSort}
                sortable
                onChange={({ field: { value }, ascending }) => {
                  clientSorts.onChangeFilter({
                    mapping,
                    type: 'batch',
                    newFilter: {
                      sort: {
                        field: value,
                        direction: ascending ? 'ASCENDING' : 'DESCENDING',
                      },
                    },
                  });
                }}
              />
            </div>
          </div>

          <div className={EntityNavbarWrapperStyle('ORDER_ITEM', ORDER_ITEM_WIDTH)}>
            <div className={EntityIconWrapperStyle}>
              <div className={EntityIconStyle}>
                <Icon icon="ORDER_ITEM" />
              </div>
            </div>

            <div className={TitleWrapperStyle}>
              <Label color="WHITE">
                <FormattedMessage id="modules.SideBar.orderItem" />
                {' ('}
                <FormattedNumber value={itemCount} />
                {')'}
              </Label>

              <button
                type="button"
                className={SelectAllButtonStyle}
                onClick={() => {
                  const targets = Object.keys(entities.orderItems || {}).map(
                    id => `${ORDER_ITEM}-${id}`
                  );
                  dispatch({
                    type: 'TARGET_ALL',
                    payload: {
                      targets,
                    },
                  });
                }}
              >
                {selectedItemsCount === itemCount ? (
                  <FormattedMessage
                    id="components.button.unselectAll"
                    defaultMessage="UNSELECT ALL"
                  />
                ) : (
                  <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
                )}

                <Icon icon="CHECKED" />
              </button>
            </div>
          </div>

          <div className={EntityNavbarWrapperStyle('ORDER', ORDER_WIDTH)}>
            <div className={EntityIconWrapperStyle}>
              <div className={EntityIconStyle}>
                <Icon icon="ORDER" />
              </div>
            </div>

            <div className={TitleWrapperStyle}>
              <Label color="WHITE">
                <FormattedMessage id="modules.SideBar.order" />
                {' ('}
                <FormattedNumber value={orderCount} />
                {')'}
              </Label>

              <button
                type="button"
                className={SelectAllButtonStyle}
                onClick={() => {
                  const targets = Object.keys(entities.orders || {}).map(id => `${ORDER}-${id}`);
                  dispatch({
                    type: 'TARGET_ALL',
                    payload: {
                      targets,
                    },
                  });
                }}
              >
                {selectedOrdersCount === orderCount ? (
                  <FormattedMessage
                    id="components.button.unselectAll"
                    defaultMessage="UNSELECT ALL"
                  />
                ) : (
                  <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
                )}

                <Icon icon="CHECKED" />
              </button>
            </div>
          </div>
        </div>
      );

    return (
      <div className={EntitiesNavbarWrapperStyle}>
        <div className={EntityNavbarWrapperStyle('ORDER', ORDER_WIDTH)}>
          <div className={EntityIconWrapperStyle}>
            <div className={EntityIconStyle}>
              <Icon icon="ORDER" />
            </div>
          </div>

          <div className={TitleWrapperStyle}>
            <div className={CreateNewTitleWrapperStyle(hasPermissions(ORDER_CREATE))}>
              <Label color="WHITE">
                <FormattedMessage id="modules.SideBar.order" />
                {' ('}
                <FormattedNumber value={orderCount} />
                {')'}
              </Label>

              {hasPermissions(ORDER_CREATE) && (
                <>
                  <div className={CreateNewButtonCollapsedStyle}>
                    <Icon icon="ADD" />
                  </div>

                  <button
                    className={CreateNewButtonStyle}
                    onClick={() => {
                      dispatch({
                        type: 'EDIT',
                        payload: {
                          type: 'NEW_ORDER',
                          selectedId: Date.now(),
                        },
                      });
                    }}
                    type="button"
                  >
                    <FormattedMessage
                      id="modules.RelationMaps.label.newOrder"
                      defaultMessage="NEW ORDER"
                    />
                    <Icon icon="ADD" />
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              className={SelectAllButtonStyle}
              onClick={() => {
                const targets = Object.keys(entities.orders || {}).map(id => `${ORDER}-${id}`);
                dispatch({
                  type: 'TARGET_ALL',
                  payload: {
                    targets,
                  },
                });
              }}
            >
              {selectedOrdersCount === orderCount ? (
                <FormattedMessage
                  id="components.button.unselectAll"
                  defaultMessage="UNSELECT ALL"
                />
              ) : (
                <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
              )}

              <Icon icon="CHECKED" />
            </button>
          </div>

          <div className={SortInputWrapperStyle}>
            <SortInput
              invertColors
              width="125px"
              sort={currentSort(orderSort, filterAndSort.sort)}
              ascending={filterAndSort.sort.direction !== 'DESCENDING'}
              fields={orderSort}
              sortable
              onChange={({ field: { value }, ascending }) => {
                onChangeFilter({
                  ...filterAndSort,
                  sort: {
                    field: value,
                    direction: ascending ? 'ASCENDING' : 'DESCENDING',
                  },
                });
                dispatch({
                  type: 'RESET_NEW_ORDERS',
                  payload: {},
                });
              }}
            />
          </div>
        </div>

        <div className={EntityNavbarWrapperStyle('ORDER_ITEM', ORDER_ITEM_WIDTH)}>
          <div className={EntityIconWrapperStyle}>
            <div className={EntityIconStyle}>
              <Icon icon="ORDER_ITEM" />
            </div>
          </div>

          <div className={TitleWrapperStyle}>
            <Label color="WHITE">
              <FormattedMessage id="modules.SideBar.orderItem" />
              {' ('}
              <FormattedNumber value={itemCount} />
              {')'}
            </Label>

            <button
              type="button"
              className={SelectAllButtonStyle}
              onClick={() => {
                const targets = Object.keys(entities.orderItems || {}).map(
                  id => `${ORDER_ITEM}-${id}`
                );
                dispatch({
                  type: 'TARGET_ALL',
                  payload: {
                    targets,
                  },
                });
              }}
            >
              {selectedItemsCount === itemCount ? (
                <FormattedMessage
                  id="components.button.unselectAll"
                  defaultMessage="UNSELECT ALL"
                />
              ) : (
                <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
              )}

              <Icon icon="CHECKED" />
            </button>
          </div>

          <div className={SortInputWrapperStyle}>
            <SortInput
              invertColors
              sort={currentSort(itemSort, clientSorts?.filterAndSort?.orderItem?.sort)}
              ascending={clientSorts?.filterAndSort?.orderItem?.sort?.direction !== 'DESCENDING'}
              fields={itemSort}
              sortable
              onChange={({ field: { value }, ascending }) => {
                clientSorts.onChangeFilter({
                  mapping,
                  type: 'orderItem',
                  newFilter: {
                    sort: {
                      field: value,
                      direction: ascending ? 'ASCENDING' : 'DESCENDING',
                    },
                  },
                });
              }}
            />
          </div>
        </div>

        <div className={EntityNavbarWrapperStyle('BATCH', BATCH_WIDTH)}>
          <div className={EntityIconWrapperStyle}>
            <div className={EntityIconStyle}>
              <Icon icon="BATCH" />
            </div>
          </div>

          <div className={TitleWrapperStyle}>
            <Label color="WHITE">
              <FormattedMessage id="modules.SideBar.batch" />
              {' ('}
              <FormattedNumber value={batchCount} />
              {')'}
            </Label>

            <button
              type="button"
              className={SelectAllButtonStyle}
              onClick={() => {
                const targets = Object.keys(entities.batches || {}).map(id => `${BATCH}-${id}`);
                dispatch({
                  type: 'TARGET_ALL',
                  payload: {
                    targets,
                  },
                });
              }}
            >
              {selectedBatchesCount === batchCount ? (
                <FormattedMessage
                  id="components.button.unselectAll"
                  defaultMessage="UNSELECT ALL"
                />
              ) : (
                <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
              )}

              <Icon icon="CHECKED" />
            </button>
          </div>

          <div className={SortInputWrapperStyle}>
            <SortInput
              invertColors
              sort={currentSort(batchSort, clientSorts?.filterAndSort?.batch?.sort)}
              ascending={clientSorts?.filterAndSort?.batch?.sort?.direction !== 'DESCENDING'}
              fields={batchSort}
              sortable
              onChange={({ field: { value }, ascending }) => {
                clientSorts.onChangeFilter({
                  mapping,
                  type: 'batch',
                  newFilter: {
                    sort: {
                      field: value,
                      direction: ascending ? 'ASCENDING' : 'DESCENDING',
                    },
                  },
                });
              }}
            />
          </div>
        </div>

        <div className={EntityNavbarWrapperStyle('CONTAINER', CONTAINER_WIDTH)}>
          <div className={EntityIconWrapperStyle}>
            <div className={EntityIconStyle}>
              <Icon icon="CONTAINER" />
            </div>
          </div>

          <div className={TitleWrapperStyle}>
            <Label color="WHITE">
              <FormattedMessage id="modules.SideBar.container" />
              {' ('}
              <FormattedNumber value={containerCount} />
              {')'}
            </Label>

            <button
              type="button"
              className={SelectAllButtonStyle}
              onClick={() => {
                const targets = Object.keys(entities.containers || {}).map(
                  id => `${CONTAINER}-${id}`
                );
                dispatch({
                  type: 'TARGET_ALL',
                  payload: {
                    targets,
                  },
                });
              }}
            >
              {selectedContainersCount === containerCount ? (
                <FormattedMessage
                  id="components.button.unselectAll"
                  defaultMessage="UNSELECT ALL"
                />
              ) : (
                <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
              )}

              <Icon icon="CHECKED" />
            </button>
          </div>
        </div>

        <div className={EntityNavbarWrapperStyle('SHIPMENT', SHIPMENT_WIDTH)}>
          <div className={EntityIconWrapperStyle}>
            <div className={EntityIconStyle}>
              <Icon icon="SHIPMENT" />
            </div>
          </div>

          <div className={TitleWrapperStyle}>
            <Label color="WHITE">
              <FormattedMessage id="modules.SideBar.shipment" />
              {' ('}
              <FormattedNumber value={shipmentCount} />
              {')'}
            </Label>

            <button
              type="button"
              className={SelectAllButtonStyle}
              onClick={() => {
                const targets = Object.keys(entities.shipments || {}).map(
                  id => `${SHIPMENT}-${id}`
                );
                dispatch({
                  type: 'TARGET_ALL',
                  payload: {
                    targets,
                  },
                });
              }}
            >
              {selectedShipmentsCount === shipmentCount ? (
                <FormattedMessage
                  id="components.button.unselectAll"
                  defaultMessage="UNSELECT ALL"
                />
              ) : (
                <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
              )}

              <Icon icon="CHECKED" />
            </button>
          </div>

          <div className={ShipmentTimelineWrapperStyle}>
            <Label align="center" height="15px" color="TEAL">
              <FormattedMessage id={`modules.Shipments.${globalShipmentPoint}`} />
            </Label>

            <MiniShipmentTimeline
              shipment={{ voyages: [{}, {}, {}] }}
              activePoint={globalShipmentPoint}
              onChangeActivePoint={point => setGlobalShipmentPoint(point)}
            />
          </div>
        </div>
      </div>
    );
  })
);

export default Header;
