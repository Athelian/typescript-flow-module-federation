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
import { WrapperStyle, TableHeaderStyle } from './style';
import Badge from '../SummaryBadge/Badge';
import TableHeader from './components/TableHeader';
import TableItem from './components/TableItem';
import { findAllPossibleOrders, totalColumns } from './helpers';
import {
  orderColumnFields,
  orderItemColumnFields,
  batchColumnFields,
  shipmentColumnFields,
  orderColumns,
  orderItemColumns,
  batchColumns,
  shipmentColumns,
} from './constants';

type Props = {
  onSave: () => void,
  onCancel: () => void,
  type: string,
  selected: Object,
};

export default function TableInlineEdit({ type, selected, onSave, onCancel }: Props) {
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
      <div>
        <div className={WrapperStyle}>
          <div className={TableHeaderStyle(totalColumns(orderColumns))}>
            <Badge
              icon="ORDER"
              color="ORDER"
              label={<FormattedMessage {...messages.ordersLabel} />}
              no={orderColumns.length}
            />
          </div>
          <div className={TableHeaderStyle(totalColumns(orderItemColumns))}>
            <Badge
              icon="ORDER_ITEM"
              color="ORDER_ITEM"
              label={<FormattedMessage {...messages.itemsLabel} />}
              no={orderItemsIds.length}
            />
          </div>
          <div className={TableHeaderStyle(totalColumns(batchColumns))}>
            <Badge
              icon="BATCH"
              color="BATCH"
              label={<FormattedMessage {...messages.batchesLabel} />}
              no={batchIds.length}
            />
          </div>
          <div className={TableHeaderStyle(totalColumns(shipmentColumns))}>
            <Badge
              icon="SHIPMENT"
              color="SHIPMENT"
              label={<FormattedMessage {...messages.shipmentsLabel} />}
              no={shipmentIds.length}
            />
          </div>
        </div>
        <TableRow>
          <LineNumber />
          <TableHeader info={orderColumns} />
          <TableHeader info={orderItemColumns} />
          <TableHeader info={batchColumns} />
          <TableHeader info={shipmentColumns} />
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
            <TableRow key={orderId}>
              <LineNumber line={counter + 1} />
              <div>
                {orderItems.length === 0 ? (
                  <TableItem
                    cell={`order.${counter + 1}`}
                    fields={orderColumnFields}
                    values={order.data}
                    validator={orderValidator}
                  />
                ) : (
                  orderItems.map(orderItem =>
                    Object.keys(orderItem.relation.batch).length === 0 ? (
                      <TableItem
                        key={`order.${counter + 1}.duplication.${orderItem.data.id}`}
                        cell={`order.${counter + 1}.duplication.${orderItem.data.id}`}
                        fields={orderColumnFields}
                        values={order.data}
                        validator={orderValidator}
                      />
                    ) : (
                      Object.keys(orderItem.relation.batch)
                        .filter(batchId => batchIds.includes(batchId))
                        .map(batchId => (
                          <TableItem
                            key={`order.${counter + 1}.duplication.${
                              orderItem.data.id
                            }.batch.${batchId}`}
                            cell={`order.${counter + 1}.duplication.${
                              orderItem.data.id
                            }.batch.${batchId}`}
                            fields={orderColumnFields}
                            values={order.data}
                            validator={orderValidator}
                          />
                        ))
                    )
                  )
                )}
              </div>
              <div>
                {orderItems.map((orderItem, position) =>
                  Object.keys(orderItem.relation.batch).length === 0 ? (
                    <TableItem
                      cell={`orderItem.${counter + 1}.${position}`}
                      key={`orderItem.${counter + 1}.${orderItem.data.id}`}
                      fields={orderItemColumnFields}
                      values={orderItem.data}
                      validator={orderValidator}
                    />
                  ) : (
                    Object.keys(orderItem.relation.batch)
                      .filter(batchId => batchIds.includes(batchId))
                      .map(batchId => (
                        <TableItem
                          cell={`orderItem.${counter + 1}.${position}.duplication.${batchId}`}
                          key={`orderItem.${counter + 1}.duplication.${batchId}`}
                          fields={orderItemColumnFields}
                          values={orderItem.data}
                          validator={orderValidator}
                        />
                      ))
                  )
                )}
              </div>
              <div>
                {batches.map((batch, position) => (
                  <TableItem
                    cell={`batch.${counter + 1}.${position}`}
                    key={batch.data.id}
                    fields={batchColumnFields}
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
                        fields={shipmentColumnFields}
                        values={shipment.data}
                        validator={shipmentValidator}
                      />
                    );
                  })}
              </div>
            </TableRow>
          );
        })}
      </div>
    </Layout>
  );
}
