// @flow
import * as React from 'react';
import { flatten, flattenDeep } from 'lodash';
import type { IntlShape } from 'react-intl';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Label } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import { useViewerHasPermissions } from 'components/Context/Permissions';
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
import Icon from 'components/Icon';
import orderMessages from 'modules/order/messages';
import orderItemMessages from 'modules/orderItem/messages';
import batchMessages from 'modules/batch/messages';
import MiniShipmentTimeline from 'modules/relationMapV2/components/MiniShipmentTimeline';
import { getByPathWithDefault } from 'utils/fp';
import {
  Entities,
  SortAndFilter,
  ClientSorts,
  GlobalShipmentPoint,
} from 'modules/relationMapV2/store';
import { SortInput } from 'components/NavBar';
import {
  EntitiesNavbarWrapperStyle,
  EntityNavbarWrapperStyle,
  EntityIconWrapperStyle,
  EntityIconStyle,
  TitleWrapperStyle,
  OrderTitleWrapperStyle,
  AddOrderButtonCollapsedStyle,
  AddOrderButtonStyle,
  SelectAllButtonStyle,
  SortInputWrapperStyle,
  ShipmentTimelineWrapperStyle,
} from './style';
import { RelationMapContext } from '../OrderFocus/store';

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
    const { state, dispatch } = React.useContext(RelationMapContext);
    const { mapping } = Entities.useContainer();
    const { filterAndSort, onChangeFilter } = SortAndFilter.useContainer();
    const clientSorts = ClientSorts.useContainer();
    const { globalShipmentPoint, setGlobalShipmentPoint } = GlobalShipmentPoint.useContainer();
    const hasPermissions = useViewerHasPermissions();
    const { orders, entities } = mapping;
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

    const orderCount = Object.keys(entities.orders || {}).length;
    const itemCount = Object.keys(entities.orderItems || {}).length;
    const batchCount = Object.keys(entities.batches || {}).length;
    const containerCount = Object.keys(entities.containers || {}).length;
    const shipmentCount = Object.keys(entities.shipments || {}).length;

    // TODO: Replace with real numbers
    const selectedOrdersCount = 0;
    const selectedItemsCount = 0;
    const selectedBatchesCount = 0;
    const selectedContainersCount = 0;
    const selectedShipmentsCount = 0;

    return (
      <div className={EntitiesNavbarWrapperStyle}>
        <div className={EntityNavbarWrapperStyle('ORDER', ORDER_WIDTH)}>
          <div className={EntityIconWrapperStyle}>
            <div className={EntityIconStyle}>
              <Icon icon="ORDER" />
            </div>
          </div>

          <div className={TitleWrapperStyle}>
            <div className={OrderTitleWrapperStyle(hasPermissions(ORDER_CREATE))}>
              <Label color="WHITE">
                <FormattedMessage id="modules.SideBar.order" />
                (
                <FormattedNumber value={orderCount} />)
              </Label>

              {hasPermissions(ORDER_CREATE) && (
                <>
                  <div className={AddOrderButtonCollapsedStyle}>
                    <Icon icon="ADD" />
                  </div>

                  <button
                    className={AddOrderButtonStyle}
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
                    NEW ORDER
                    <Icon icon="ADD" />
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              className={SelectAllButtonStyle}
              onClick={() => {
                const targets = orders.map(
                  order => `${ORDER}-${getByPathWithDefault('', 'id', order)}`
                );
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
              (
              <FormattedNumber value={itemCount} />)
            </Label>

            <button
              type="button"
              className={SelectAllButtonStyle}
              onClick={() => {
                const orderItemIds = flatten(
                  orders.map(order =>
                    getByPathWithDefault(
                      [],
                      `order.${getByPathWithDefault('', 'id', order)}.orderItems`,
                      state
                    ).map(item => getByPathWithDefault('', 'id', item))
                  )
                ).filter(Boolean);
                const targets = orderItemIds.map(id => `${ORDER_ITEM}-${id}`);
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
              (
              <FormattedNumber value={batchCount} />)
            </Label>

            <button
              type="button"
              className={SelectAllButtonStyle}
              onClick={() => {
                const batchIds = flattenDeep(
                  orders.map(order =>
                    getByPathWithDefault(
                      [],
                      `order.${getByPathWithDefault('', 'id', order)}.orderItems`,
                      state
                    ).map(item =>
                      getByPathWithDefault([], 'batches', item).map(batch =>
                        getByPathWithDefault('', 'id', batch)
                      )
                    )
                  )
                ).filter(Boolean);
                const targets = batchIds.map(id => `${BATCH}-${id}`);
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
              (
              <FormattedNumber value={containerCount} />)
            </Label>

            <button
              type="button"
              className={SelectAllButtonStyle}
              onClick={() => {
                const containerIds = flattenDeep(
                  orders.map(order =>
                    getByPathWithDefault(
                      [],
                      `order.${getByPathWithDefault('', 'id', order)}.orderItems`,
                      state
                    ).map(item =>
                      getByPathWithDefault([], 'batches', item).map(batch =>
                        getByPathWithDefault('', 'container.id', batch)
                      )
                    )
                  )
                ).filter(Boolean);
                const targets = containerIds.map(id => `${CONTAINER}-${id}`);
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
              (
              <FormattedNumber value={shipmentCount} />)
            </Label>

            <button
              type="button"
              className={SelectAllButtonStyle}
              onClick={() => {
                const shipmentIds = flattenDeep(
                  orders.map(order =>
                    getByPathWithDefault(
                      [],
                      `order.${getByPathWithDefault('', 'id', order)}.orderItems`,
                      state
                    ).map(item =>
                      getByPathWithDefault([], 'batches', item).map(batch =>
                        getByPathWithDefault('', 'shipment.id', batch)
                      )
                    )
                  )
                ).filter(Boolean);
                const targets = shipmentIds.map(id => `${SHIPMENT}-${id}`);
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
