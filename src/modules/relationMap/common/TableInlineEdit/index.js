// @flow
import * as React from 'react';
import Layout from 'components/Layout';
import { FormattedMessage } from 'react-intl';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import logger from 'utils/logger';
import messages from 'modules/relationMap/messages';
import { formatOrderData } from 'modules/relationMap/util';
import orderValidator from 'modules/order/form/validator';
import batchValidator from 'modules/batch/form/validator';
import shipmentValidator from 'modules/shipment/form/validator';
import TableRow from './components/TableRow';
import LineNumber from './components/LineNumber';
import { WrapperStyle } from './style';
import ExpandHeader from '../ExpandHeader';
import Badge from '../SummaryBadge/Badge';
import TableHeader from './components/TableHeader';
import TableItem from './components/TableItem';
import EmptyCell from './components/EmptyCell';

type Props = {
  onSave: () => void,
  onCancel: () => void,
  onExpand: () => void,
  type: string,
  selected: Object,
};

type MappingObject = {
  data: {
    id: string,
  },
  relation: {
    order: Object,
    orderItem: Object,
    batch: Object,
    shipment: Object,
  },
};

const findAllPossibleOrders = (
  selected: {
    order: Object,
    orderItem: Object,
    batch: Object,
    shipment: Object,
  },
  mappingObjects: {
    order: Object,
    orderItem: Object,
    batch: Object,
    shipment: Object,
  }
): {
  orderIds: Array<string>,
  orderItemsIds: Array<string>,
  batchIds: Array<string>,
  shipmentIds: Array<string>,
} => {
  const orderIds = Object.keys(selected.order);
  const orderItemsIds = Object.keys(selected.orderItem);
  const batchIds = Object.keys(selected.batch);
  const shipmentIds = Object.keys(selected.shipment);

  // find all orders from selected order
  if (orderIds.length) {
    // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
    (Object.entries(mappingObjects.order): any).forEach((item: [string, MappingObject]) => {
      const [orderId, order] = item;
      if (selected.order[orderId]) {
        orderItemsIds.push(...Object.keys(order.relation.orderItem));
        batchIds.push(...Object.keys(order.relation.batch));
        shipmentIds.push(...Object.keys(order.relation.shipment));
      }
    });
  }

  if (orderItemsIds.length) {
    // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
    (Object.entries(mappingObjects.orderItem): any).forEach((item: [string, MappingObject]) => {
      const [orderItemId, orderItem] = item;
      if (selected.orderItem[orderItemId]) {
        orderIds.push(...Object.keys(orderItem.relation.order));
        batchIds.push(...Object.keys(orderItem.relation.batch));
        shipmentIds.push(...Object.keys(orderItem.relation.shipment));
      }
    });
  }

  if (shipmentIds.length) {
    // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
    (Object.entries(mappingObjects.shipment): any).forEach((item: [string, MappingObject]) => {
      const [shipmentId, shipment] = item;
      if (selected.shipment[shipmentId]) {
        orderIds.push(...Object.keys(shipment.relation.order));
        orderItemsIds.push(...Object.keys(shipment.relation.orderItem));
        batchIds.push(...Object.keys(shipment.relation.batch));
      }
    });
  }

  if (batchIds.length) {
    // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
    (Object.entries(mappingObjects.batch): any).forEach((item: [string, MappingObject]) => {
      const [batchId, batch] = item;
      if (selected.batch[batchId]) {
        orderIds.push(...Object.keys(batch.relation.order));
        orderItemsIds.push(...Object.keys(batch.relation.orderItem));
        shipmentIds.push(...Object.keys(batch.relation.shipment));
      }
    });
  }

  return {
    orderIds: [...new Set(orderIds)],
    orderItemsIds: [...new Set(orderItemsIds)],
    batchIds: [...new Set(batchIds)],
    shipmentIds: [...new Set(shipmentIds)],
  };
};

export default function TableInlineEdit({ type, selected, onSave, onCancel, onExpand }: Props) {
  const data = JSON.parse(window.localStorage.getItem(type)) || [];
  const { sumShipments, sumOrders, sumOrderItems, sumBatches, ...mappingObjects } = formatOrderData(
    data
  );
  logger.warn('selected', selected);
  logger.warn('mappingObjects', mappingObjects);
  const { orderIds, orderItemsIds, batchIds, shipmentIds } = findAllPossibleOrders(
    selected,
    mappingObjects
  );
  return (
    <Layout
      navBar={
        <SlideViewNavBar>
          <EntityIcon icon="ORDER" color="ORDER" />
          <CancelButton onClick={onCancel} />
          <SaveButton onClick={onSave} />
        </SlideViewNavBar>
      }
    >
      <div className={WrapperStyle}>
        <ExpandHeader isExpanding={false} onClick={onExpand}>
          <Badge
            icon="ORDER"
            color="ORDER"
            label={<FormattedMessage {...messages.ordersLabel} />}
            no={sumOrders}
          />
        </ExpandHeader>
        <ExpandHeader isExpanding={false} onClick={onExpand}>
          <Badge
            icon="ORDER_ITEM"
            color="ORDER_ITEM"
            label={<FormattedMessage {...messages.itemsLabel} />}
            no={sumOrderItems}
          />
        </ExpandHeader>
        <ExpandHeader isExpanding={false} onClick={onExpand}>
          <Badge
            icon="BATCH"
            color="BATCH"
            label={<FormattedMessage {...messages.batchesLabel} />}
            no={sumBatches}
          />
        </ExpandHeader>
        <ExpandHeader isExpanding={false} onClick={onExpand}>
          <Badge
            icon="SHIPMENT"
            color="SHIPMENT"
            label={<FormattedMessage {...messages.shipmentsLabel} />}
            no={sumShipments}
          />
        </ExpandHeader>
      </div>
      <TableRow>
        <LineNumber />
        <TableHeader
          info={[
            {
              group: 'General',
              columns: ['PO No.', 'PI No.'],
            },
          ]}
        />
        <TableHeader
          info={[
            {
              group: 'General',
              columns: ['Product Name', 'Product Serial'],
            },
          ]}
        />
        <TableHeader
          info={[
            {
              group: 'General',
              columns: ['Batch No.', 'Initial Quantity'],
            },
          ]}
        />
        <TableHeader
          info={[
            {
              group: 'General',
              columns: ['Shipment ID', 'B/L No.'],
            },
          ]}
        />
      </TableRow>
      {orderIds.map((orderId, counter) => {
        const order = mappingObjects.order[orderId];
        // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
        const orderItems = (Object.values(mappingObjects.orderItem): any).filter(
          item => order.relation.orderItem[item.data.id] && orderItemsIds.includes(item.data.id)
        );
        const batches = (Object.values(mappingObjects.batch): any).filter(
          item => order.relation.batch[item.data.id] && batchIds.includes(item.data.id)
        );
        return (
          <TableRow>
            <LineNumber line={counter + 1} />
            <TableItem
              cell={`order.${counter + 1}`}
              fields={[
                {
                  name: 'poNo',
                  type: 'text',
                },
                {
                  name: 'piNo',
                  type: 'text',
                },
              ]}
              values={order.data}
              validator={orderValidator}
            />
            <div>
              {orderItems.map((orderItem, position) => (
                <>
                  <TableItem
                    cell={`orderItem.${counter + 1}.${position}`}
                    key={orderItem.data.id}
                    fields={[
                      {
                        name: 'productProvider.product.name',
                        type: 'text',
                      },
                      {
                        name: 'productProvider.product.serial',
                        type: 'text',
                      },
                    ]}
                    values={orderItem.data}
                    validator={orderValidator}
                  />
                  {Object.keys(orderItem.relation.batch)
                    .filter(batchId => batchIds.includes(batchId))
                    .map(batchId => (
                      <EmptyCell key={batchId} />
                    ))}
                </>
              ))}
            </div>
            <div>
              {batches.map((batch, position) => (
                <TableItem
                  cell={`batch.${counter + 1}.${position}`}
                  key={batch.data.id}
                  fields={[
                    {
                      name: 'no',
                      type: 'text',
                    },
                    {
                      name: 'quantity',
                      type: 'number',
                    },
                  ]}
                  values={batch.data}
                  validator={batchValidator}
                />
              ))}
            </div>
            <div>
              {shipmentIds
                .filter(shipmentId => !!order.relation.shipment[shipmentId])
                .map((shipmentId, position) => {
                  const shipment = mappingObjects.shipment[shipmentId];
                  return (
                    <TableItem
                      cell={`shipment.${counter + 1}.${position}`}
                      key={shipment.data.id}
                      fields={[
                        {
                          name: 'no',
                          type: 'text',
                        },
                        {
                          name: 'blNo',
                          type: 'text',
                        },
                      ]}
                      values={shipment.data}
                      validator={shipmentValidator}
                    />
                  );
                })}
            </div>
          </TableRow>
        );
      })}
    </Layout>
  );
}
