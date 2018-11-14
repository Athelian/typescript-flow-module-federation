// @flow
// $FlowFixMe: it is open issue on flow repo https://github.com/facebook/flow/issues/7093
import React, { useEffect, useState, useRef } from 'react';
import { useIdb } from 'react-use-idb';
import { setConfig } from 'react-hot-loader';
import { range, clone, set } from 'lodash';
import { FormattedMessage } from 'react-intl';
import emitter from 'utils/emitter';
import { arrayToObject, isEquals } from 'utils/fp';
import { cleanUpData } from 'utils/data';
import Layout from 'components/Layout';
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
import { TableHeaderStyle, HorizonScrollStyle } from './style';
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
import TableEmptyItem from './components/TableEmptyItem';

type Props = {
  onSave: () => void,
  onCancel: () => void,
  type: string,
  selected: Object,
};

setConfig({ pureSFC: true });

export default function TableInlineEdit({ type, selected, onSave, onCancel }: Props) {
  const [data] = useIdb(type, []);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const editDataRef = useRef();

  useEffect(() => {
    if (data.length) {
      if (
        !editDataRef.current ||
        (Array.isArray(editDataRef.current) && editDataRef.current.length === 0)
      ) {
        logger.warn('copy data');
        editDataRef.current = clone(data);
      }

      const listener = emitter.once('INLINE_CHANGE', newData => {
        const result = arrayToObject(clone(editDataRef.current), 'id');
        const { name, value, hasError } = newData;
        editDataRef.current = [].concat(Object.values(set(result, name, value)));

        if (!touched[name]) {
          setTouched({
            ...touched,
            [name]: true,
          });
        }

        if (hasError) {
          setErrors({ ...errors, [name]: true });
        } else {
          delete errors[name];
          setErrors(errors);
        }
      });
      return () => listener.remove();
    }
    return () => {};
  });

  const { sumShipments, sumOrders, sumOrderItems, sumBatches, ...mappingObjects } = formatOrderData(
    data
  );
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
          <SaveButton
            onClick={onSave}
            disabled={
              !(
                editDataRef.current &&
                isEquals(
                  cleanUpData(arrayToObject(editDataRef.current, 'id')),
                  cleanUpData(arrayToObject(data, 'id'))
                ) &&
                Object.keys(touched).length > 0 &&
                Object.keys(errors).length === 0
              )
            }
          />
        </SlideViewNavBar>
      }
    >
      <div className={HorizonScrollStyle}>
        <TableRow>
          <LineNumber />
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
        </TableRow>
        <TableRow>
          <LineNumber />
          <TableHeader info={orderColumns} />
          <TableHeader info={orderItemColumns} />
          <TableHeader info={batchColumns} />
          <TableHeader info={shipmentColumns} />
        </TableRow>
        {orderIds.map((orderId, counter) => {
          const order = mappingObjects.order[orderId];
          if (!order) return null;
          // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
          const orderItems = (Object.values(mappingObjects.orderItem): any).filter(
            item => order.relation.orderItem[item.data.id] && orderItemsIds.includes(item.data.id)
          );
          const batches = (Object.values(mappingObjects.batch): any).filter(
            item => order.relation.batch[item.data.id] && batchIds.includes(item.data.id)
          );
          let totalLines = 0;
          if (orderItems.length === 0) {
            totalLines = 1;
          } else {
            totalLines = orderItems.reduce((result, orderItem) => {
              const totalBatches = Object.keys(orderItem.relation.batch).length;
              if (totalBatches === 0) {
                return result + 1;
              }
              return result + totalBatches;
            }, 0);
          }
          return (
            <TableRow key={orderId}>
              <LineNumber line={counter + 1} />
              <div>
                {orderItems.length === 0 ? (
                  <TableItem
                    cell={order.data.id}
                    fields={orderColumnFields}
                    values={order.data}
                    validator={orderValidator}
                  />
                ) : (
                  orderItems.map(orderItem =>
                    Object.keys(orderItem.relation.batch).length === 0 ? (
                      <TableItem
                        key={`order.${order.data.id}.${counter + 1}.duplication.${
                          orderItem.data.id
                        }`}
                        cell={order.data.id}
                        fields={orderColumnFields}
                        values={order.data}
                        validator={orderValidator}
                      />
                    ) : (
                      <React.Fragment
                        key={`order.${order.data.id}.${counter + 1}.duplication.${
                          orderItem.data.id
                        }`}
                      >
                        {Object.keys(orderItem.relation.batch)
                          .filter(batchId => batchIds.includes(batchId))
                          .map(batchId => (
                            <TableItem
                              key={`order.${order.data.id}.${counter + 1}.duplication.${
                                orderItem.data.id
                              }.batch.${batchId}`}
                              cell={order.data.id}
                              fields={orderColumnFields}
                              values={order.data}
                              validator={orderValidator}
                            />
                          ))}
                        {Object.keys(orderItem.relation.batch)
                          .filter(batchId => !batchIds.includes(batchId))
                          .map(batchId => (
                            <TableEmptyItem
                              key={`order.${counter + 1}.hidden.${
                                orderItem.data.id
                              }.batch.${batchId}`}
                              fields={orderColumnFields}
                            />
                          ))}
                      </React.Fragment>
                    )
                  )
                )}
              </div>
              <div>
                {orderItems.length ? (
                  orderItems.map((orderItem, position) =>
                    Object.keys(orderItem.relation.batch).length === 0 ? (
                      <TableItem
                        cell={`${order.data.id}.orderItems.${position}`}
                        key={`orderItem.${counter + 1}.${orderItem.data.id}`}
                        fields={orderItemColumnFields}
                        values={orderItem.data}
                        validator={orderValidator}
                      />
                    ) : (
                      <React.Fragment key={`orderItem.${counter + 1}.${orderItem.data.id}`}>
                        {Object.keys(orderItem.relation.batch)
                          .filter(batchId => batchIds.includes(batchId))
                          .map(batchId => (
                            <TableItem
                              cell={`${order.data.id}.orderItems.${position}`}
                              key={`orderItem.${counter + 1}.duplication.${batchId}`}
                              fields={orderItemColumnFields}
                              values={orderItem.data}
                              validator={orderValidator}
                            />
                          ))}
                        {Object.keys(orderItem.relation.batch)
                          .filter(batchId => !batchIds.includes(batchId))
                          .map(batchId => (
                            <TableEmptyItem
                              key={`orderItem.${counter + 1}.hidden.${batchId}`}
                              fields={orderItemColumnFields}
                            />
                          ))}
                      </React.Fragment>
                    )
                  )
                ) : (
                  <TableEmptyItem fields={orderItemColumnFields} />
                )}
              </div>
              <div>
                {batches.length ? (
                  <>
                    {batches.map((batch, position) => (
                      <TableItem
                        cell={`batch.${counter + 1}.${position}`}
                        key={batch.data.id}
                        fields={batchColumnFields}
                        values={batch.data}
                        validator={batchValidator}
                      />
                    ))}
                    {range(totalLines - batches.length).map(index => (
                      <TableEmptyItem key={index} fields={batchColumnFields} />
                    ))}
                  </>
                ) : (
                  range(totalLines).map(index => (
                    <TableEmptyItem key={index} fields={batchColumnFields} />
                  ))
                )}
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
                {range(
                  totalLines -
                    shipmentIds.filter(shipmentId => !!order.relation.shipment[shipmentId]).length
                ).map(index => (
                  <TableEmptyItem key={index} fields={batchColumnFields} />
                ))}
              </div>
            </TableRow>
          );
        })}
      </div>
    </Layout>
  );
}
