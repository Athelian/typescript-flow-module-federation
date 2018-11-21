// @flow
// $FlowFixMe: it is open issue on flow repo https://github.com/facebook/flow/issues/7093
import React, { useEffect, useState, useRef } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { diff } from 'deep-object-diff';
import { useIdb } from 'react-use-idb';
import { setConfig } from 'react-hot-loader';
import { range, set, cloneDeep, isEqual } from 'lodash';
import emitter from 'utils/emitter';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import LoadingIcon from 'components/LoadingIcon';
import logger from 'utils/logger';
import { formatOrderData } from 'modules/relationMap/util';
import orderValidator from 'modules/order/form/validator';
import batchValidator from 'modules/batch/form/validator';
import shipmentValidator from 'modules/shipment/form/validator';
import TableRow from './components/TableRow';
import LineNumber from './components/LineNumber';
import TableHeader from './components/TableHeader';
import TableItem from './components/TableItem';
import TableEmptyItem from './components/TableEmptyItem';
import { entitiesUpdateManyMutation } from './mutation';
import { findAllPossibleOrders, totalLinePerOrder, parseChangedData } from './helpers';
import normalize from './normalize';
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
import {
  EditTableViewWrapperStyle,
  HeaderWrapperStyle,
  SidebarWrapperStyle,
  BodyWrapperStyle,
} from './style';

type Props = {
  onCancel: () => void,
  type: string,
  selected: Object,
};

setConfig({ pureSFC: true });

export default function TableInlineEdit({ type, selected, onCancel }: Props) {
  const [data] = useIdb(type, []);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [editData, setEditData] = useState({
    orders: {},
    orderItems: {},
    batches: {},
    shipments: {},
  });

  useEffect(() => {
    if (data.length) {
      if (Object.keys(editData.orders).length === 0) {
        logger.warn('copy data');
        const { entities } = normalize({ orders: data });
        setEditData(cloneDeep(entities));
      }

      const listener = emitter.once('INLINE_CHANGE', newData => {
        logger.warn({ newData, editData });

        const { name, value, hasError } = newData;
        const newEditData = set(editData, name, value);
        setEditData(newEditData);

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
      return () => {
        listener.remove();
      };
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

  logger.warn({ selected, mappingObjects });
  logger.warn({ orderIds, orderItemsIds, batchIds, shipmentIds });
  const { entities } = normalize({ orders: data });
  return (
    <ApolloConsumer>
      {client => (
        <Layout
          navBar={
            <SlideViewNavBar>
              <EntityIcon icon="EDIT" color="EDIT" />
              <CancelButton onClick={onCancel} />
              <SaveButton
                isLoading={loading}
                onClick={async () => {
                  const changedData = diff(entities, editData);
                  setLoading(true);
                  try {
                    const result = await client.mutate({
                      mutation: entitiesUpdateManyMutation,
                      variables: parseChangedData(changedData, editData),
                    });
                    setLoading(false);
                    setTouched({});
                    console.warn({ result });
                  } catch (error) {
                    console.warn({ error });
                    setLoading(false);
                  }
                }}
                disabled={
                  !(
                    !isEqual(entities, editData) &&
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
              {Object.keys(editData.orders).length === 0 && <LoadingIcon />}
              {orderIds.map((orderId, counter) => {
                const order = mappingObjects.order[orderId];
                if (!order) return null;
                // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
                const orderItems = (Object.values(mappingObjects.orderItem): any).filter(
                  item =>
                    order.relation.orderItem[item.data.id] && orderItemsIds.includes(item.data.id)
                );
                const batches = (Object.values(mappingObjects.batch): any).filter(
                  item => order.relation.batch[item.data.id] && batchIds.includes(item.data.id)
                );
                const totalLines = totalLinePerOrder(orderItems, batchIds);
                return (
                  <TableRow key={orderId}>
                    <div>
                      {orderItems.length === 0 ? (
                        <TableItem
                          cell={`orders.${order.data.id}`}
                          fields={orderColumnFields}
                          values={editData.orders[orderId]}
                          validator={orderValidator}
                        />
                      ) : (
                        orderItems.map(orderItem =>
                          Object.keys(orderItem.relation.batch).length === 0 ? (
                            <TableItem
                              key={`order.${order.data.id}.${counter + 1}.duplication.${
                                orderItem.data.id
                              }`}
                              cell={`orders.${order.data.id}`}
                              fields={orderColumnFields}
                              values={editData.orders[orderId]}
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
                                    cell={`orders.${order.data.id}`}
                                    fields={orderColumnFields}
                                    values={editData.orders[orderId]}
                                    validator={orderValidator}
                                  />
                                ))}
                              {Object.keys(orderItem.relation.batch).filter(
                                batchId => !batchIds.includes(batchId)
                              ).length < totalLines &&
                                Object.keys(orderItem.relation.batch)
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
                        orderItems.map(orderItem =>
                          Object.keys(orderItem.relation.batch).length === 0 ? (
                            <TableItem
                              cell={`orderItems.${orderItem.data.id}`}
                              key={`orderItem.${counter + 1}.${orderItem.data.id}`}
                              fields={orderItemColumnFields}
                              values={editData.orderItems[orderItem.data.id]}
                              validator={orderValidator}
                            />
                          ) : (
                            <React.Fragment key={`orderItem.${counter + 1}.${orderItem.data.id}`}>
                              {Object.keys(orderItem.relation.batch)
                                .filter(batchId => batchIds.includes(batchId))
                                .map(batchId => (
                                  <TableItem
                                    cell={`orderItems.${orderItem.data.id}`}
                                    key={`orderItem.${counter + 1}.duplication.${batchId}`}
                                    fields={orderItemColumnFields}
                                    values={editData.orderItems[orderItem.data.id]}
                                    validator={orderValidator}
                                  />
                                ))}
                              {Object.keys(orderItem.relation.batch).filter(
                                batchId => !batchIds.includes(batchId)
                              ).length < totalLines &&
                                Object.keys(orderItem.relation.batch)
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
                          {orderItems.map(orderItem =>
                            orderItem.data.batches
                              .filter(batch => batchIds.includes(batch.id))
                              .map(batch => (
                                <TableItem
                                  cell={`batches.${batch.id}`}
                                  key={batch.id}
                                  fields={batchColumnFields}
                                  values={editData.batches[batch.id]}
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
                        .map(shipmentId => {
                          const shipment = mappingObjects.shipment[shipmentId];
                          return (
                            <TableItem
                              key={`shipment.${counter + 1}.${shipmentId}`}
                              cell={`shipments.${shipment.data.id}`}
                              fields={shipmentColumnFields}
                              values={editData.shipments[shipment.data.id]}
                              validator={shipmentValidator}
                            />
                          );
                        })}
                      {range(
                        totalLines -
                          shipmentIds.filter(shipmentId => !!order.relation.shipment[shipmentId])
                            .length
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
                  item =>
                    order.relation.orderItem[item.data.id] && orderItemsIds.includes(item.data.id)
                );
                const totalLines = totalLinePerOrder(orderItems, batchIds);
                // TODO: handle vertical scroll for line
                return (
                  <LineNumber
                    height={totalLines * 43}
                    line={counter + 1}
                    key={`line-for-${orderId}`}
                  />
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
      )}
    </ApolloConsumer>
  );
}
