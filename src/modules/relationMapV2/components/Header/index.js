// @flow
import * as React from 'react';
import { flatten, flattenDeep } from 'lodash';
import type { IntlShape } from 'react-intl';
import { injectIntl, FormattedMessage } from 'react-intl';
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
import orderMessages from 'modules/order/messages';
import orderItemMessages from 'modules/orderItem/messages';
import batchMessages from 'modules/batch/messages';
import containerMessages from 'modules/container/messages';
import shipmentMessages from 'modules/shipment/messages';
import { getByPathWithDefault } from 'utils/fp';
import { Entities, SortAndFilter, ClientSorts } from 'modules/relationMapV2/store';
import { SortInput } from 'components/NavBar';
import { HeadingStyle, ButtonStyle, RowStyle } from './style';
import { RelationMapContext } from '../OrderFocus/store';

type Props = { intl: IntlShape, style?: Object };

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

const Header = React.memo<Props>(
  injectIntl(({ style, intl }: Props) => {
    const { state, dispatch } = React.useContext(RelationMapContext);
    const { mapping } = Entities.useContainer();
    const { filterAndSort, onChangeFilter } = SortAndFilter.useContainer();
    const clientSorts = ClientSorts.useContainer();
    console.warn({
      clientSorts,
    });
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
      { title: intl.formatMessage(batchMessages.poNo), value: 'poNo' },
      { title: intl.formatMessage(batchMessages.productName), value: 'productName' },
      { title: intl.formatMessage(batchMessages.productSerial), value: 'productSerial' },
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
    return (
      <div style={style} className={RowStyle}>
        <div
          className={HeadingStyle}
          style={{
            backgroundColor: '#ED5724',
            width: ORDER_WIDTH,
          }}
        >
          <div>
            Orders ({Object.keys(entities.orders || {}).length})
            <button
              type="button"
              className={ButtonStyle}
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
              <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
            </button>
          </div>
          <div>
            <SortInput
              sort={currentSort(orderSort, filterAndSort.sort)}
              ascending={filterAndSort.sort.direction !== 'DESCENDING'}
              fields={orderSort}
              sortable
              onChange={({ field: { value }, ascending }) =>
                onChangeFilter({
                  ...filterAndSort,
                  sort: {
                    field: value,
                    direction: ascending ? 'ASCENDING' : 'DESCENDING',
                  },
                })
              }
            />
          </div>
        </div>
        <div
          className={HeadingStyle}
          style={{
            backgroundColor: '#FBAA1D',
            width: ORDER_ITEM_WIDTH,
          }}
        >
          <div>
            Items ({Object.keys(entities.orderItems || {}).length})
            <button
              type="button"
              className={ButtonStyle}
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
              <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
            </button>
          </div>
          <div>
            <SortInput
              sort={currentSort(itemSort, clientSorts?.filterAndSort?.orderItem?.sort)}
              ascending={clientSorts?.filterAndSort?.orderItem?.sort?.direction !== 'DESCENDING'}
              fields={itemSort}
              sortable
              onChange={({ field: { value }, ascending }) =>
                clientSorts.onChangeFilter('orderItem', {
                  sort: {
                    field: value,
                    direction: ascending ? 'ASCENDING' : 'DESCENDING',
                  },
                })
              }
            />
          </div>
        </div>
        <div
          className={HeadingStyle}
          style={{
            backgroundColor: '#12B937',
            width: BATCH_WIDTH,
          }}
        >
          <div>
            Batches ({Object.keys(entities.batches || {}).length})
            <button
              type="button"
              className={ButtonStyle}
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
              <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
            </button>
          </div>
          <div>
            <SortInput
              sort={currentSort(batchSort, clientSorts?.filterAndSort?.batch?.sort)}
              ascending={clientSorts?.filterAndSort?.batch?.sort?.direction !== 'DESCENDING'}
              fields={batchSort}
              sortable
              onChange={({ field: { value }, ascending }) =>
                clientSorts.onChangeFilter('batch', {
                  sort: {
                    field: value,
                    direction: ascending ? 'ASCENDING' : 'DESCENDING',
                  },
                })
              }
            />
          </div>
        </div>
        <div
          className={HeadingStyle}
          style={{
            backgroundColor: '#30A8E4',
            width: CONTAINER_WIDTH,
          }}
        >
          <div>
            Containers ({Object.keys(entities.containers || {}).length})
            <button
              type="button"
              className={ButtonStyle}
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
              <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
            </button>
          </div>
          <div>
            <SortInput
              sort={currentSort(containerSort, clientSorts?.filterAndSort?.container?.sort)}
              ascending={clientSorts?.filterAndSort?.container?.sort?.direction !== 'DESCENDING'}
              fields={containerSort}
              sortable
              onChange={({ field: { value }, ascending }) =>
                clientSorts.onChangeFilter('container', {
                  sort: {
                    field: value,
                    direction: ascending ? 'ASCENDING' : 'DESCENDING',
                  },
                })
              }
            />
          </div>
        </div>
        <div
          className={HeadingStyle}
          style={{
            backgroundColor: '#0756AF',
            width: SHIPMENT_WIDTH,
          }}
        >
          <div>
            Shipments ({Object.keys(entities.shipments || {}).length})
            <button
              type="button"
              className={ButtonStyle}
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
              <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
            </button>
          </div>
          <div>
            <SortInput
              sort={currentSort(shipmentSort, clientSorts?.filterAndSort?.shipment?.sort)}
              ascending={clientSorts?.filterAndSort?.shipment?.sort?.direction !== 'DESCENDING'}
              fields={shipmentSort}
              sortable
              onChange={({ field: { value }, ascending }) =>
                clientSorts.onChangeFilter('shipment', {
                  sort: {
                    field: value,
                    direction: ascending ? 'ASCENDING' : 'DESCENDING',
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    );
  })
);

export default Header;
