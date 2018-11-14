// @flow
// $FlowFixMe: it is open issue on flow repo https://github.com/facebook/flow/issues/7093
import React, { useEffect, useState, useRef } from 'react';
import { useIdb } from 'react-use-idb';
import { setConfig } from 'react-hot-loader';
import { range, clone, set } from 'lodash';
import emitter from 'utils/emitter';
import { arrayToObject, isEquals } from 'utils/fp';
import { cleanUpData } from 'utils/data';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import logger from 'utils/logger';
import { formatOrderData } from 'modules/relationMap/util';
import orderValidator from 'modules/order/form/validator';
import batchValidator from 'modules/batch/form/validator';
import shipmentValidator from 'modules/shipment/form/validator';
import TableRow from './components/TableRow';
import LineNumber from './components/LineNumber';
import TableHeader from './components/TableHeader';
import TableItem from './components/TableItem';
import { findAllPossibleOrders, totalLinePerOrder } from './helpers';
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
import {
  EditTableViewWrapperStyle,
  HeaderWrapperStyle,
  SidebarWrapperStyle,
  BodyWrapperStyle,
} from './style';

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

  const headerRef = useRef();
  const sidebarRef = useRef();
  const bodyRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
      sidebarRef.current.scrollTop = bodyRef.current.scrollTop;
    };

    bodyRef.current.addEventListener('scroll', handleScroll);
    return () => {
      bodyRef.current.removeEventListener('scroll', handleScroll);
    };
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
          <EntityIcon icon="EDIT" color="EDIT" />
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
      <div className={EditTableViewWrapperStyle}>
        <div className={BodyWrapperStyle} ref={bodyRef}>
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
            const totalLines = totalLinePerOrder(orderItems);
            return (
              <TableRow key={orderId}>
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
                  {batchIds.length ? (
                    <>
                      {orderItems.map((orderItem, position) =>
                        orderItem.data.batches.map((batch, index) => (
                          <TableItem
                            cell={`${order.data.id}.orderItems.${position}.batches.${index}`}
                            key={batch.id}
                            fields={batchColumnFields}
                            values={batch}
                            validator={batchValidator}
                          />
                        ))
                      )}
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
                    <TableEmptyItem key={index} fields={shipmentColumnFields} />
                  ))}
                </div>
              </TableRow>
            );
          })}
        </div>

        <div className={SidebarWrapperStyle} ref={sidebarRef}>
          {orderIds.map((orderId, counter) => {
            const order = mappingObjects.order[orderId];
            if (!order) return null;
            // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
            const orderItems = (Object.values(mappingObjects.orderItem): any).filter(
              item => order.relation.orderItem[item.data.id] && orderItemsIds.includes(item.data.id)
            );
            const totalLines = totalLinePerOrder(orderItems);
            // TODO: handle vertical scroll for line
            return (
              <LineNumber height={totalLines * 43} line={counter + 1} key={`line-for-${orderId}`} />
            );
          })}
        </div>

        <div className={HeaderWrapperStyle} ref={headerRef}>
          <TableRow>
            <TableHeader info={orderColumns} />
            <TableHeader info={orderItemColumns} />
            <TableHeader info={batchColumns} />
            <TableHeader info={shipmentColumns} />
          </TableRow>
        </div>
      </div>
    </Layout>
  );
}
