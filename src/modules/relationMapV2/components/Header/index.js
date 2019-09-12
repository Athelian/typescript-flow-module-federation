// @flow
import * as React from 'react';
import { flatten, flattenDeep } from 'lodash';
import type { IntlShape } from 'react-intl';
import { injectIntl, FormattedMessage } from 'react-intl';
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

const Header = React.memo<{ style?: Object }>(
  injectIntl(({ style, intl }: Props) => {
    const { state, dispatch } = React.useContext(RelationMapContext);
    const { mapping } = Entities.useContainer();
    const { filterAndSort, onChangeFilter } = SortAndFilter.useContainer();
    const clientSorts = ClientSorts.useContainer();
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
            <span>
              Orders ({Object.keys(entities.orders || {}).length})
              {hasPermissions(ORDER_CREATE) && (
                <button
                  type="button"
                  onClick={() => {
                    dispatch({
                      type: 'EDIT',
                      payload: {
                        type: 'NEW_ORDER',
                        selectedId: Date.now(),
                      },
                    });
                  }}
                  style={{
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <Icon icon="ADD" />
                </button>
              )}
            </span>
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
          <div />
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
          <div />
        </div>
      </div>
    );
  })
);

export default Header;
