// @flow

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { diff } from 'deep-object-diff';
import { useIdb } from 'react-use-idb';
import { setConfig } from 'react-hot-loader';
import { HotKeys } from 'react-hotkeys';
import { range, set, cloneDeep, isEqual } from 'lodash';
import { UserConsumer } from 'modules/user';
import emitter from 'utils/emitter';
import Layout from 'components/Layout';
import SlideView from 'components/SlideView';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton, SelectTemplateButton, ExportButton } from 'components/Buttons';
import { ToggleInput, Label, Display } from 'components/Form';
import LoadingIcon from 'components/LoadingIcon';
import logger from 'utils/logger';
import { formatOrders as formatOrderData } from 'modules/relationMap/orderFocused/formatter';
import orderValidator from 'modules/order/form/validator';
import batchValidator from 'modules/batch/form/validator';
import shipmentValidator from 'modules/shipment/form/validator';
import SelectTemplate from 'modules/tableTemplate/common/SelectTemplate';
import {
  orderColumnFields,
  orderItemColumnFields,
  batchColumnFields,
  shipmentColumnFields,
  orderColumns,
  orderItemColumns,
  batchColumns,
  shipmentColumns,
} from 'modules/tableTemplate/constants';
import QueryForAllCustomFields from 'modules/tableTemplate/common/QueryForAllCustomFields';
import {
  TableRow,
  LineNumber,
  TableHeader,
  TableHeaderForCustomFields,
  TableItem,
  TableEmptyItem,
} from './components';
import TableItemForCustomFields from './components/TableItem/index.customFields';
import { entitiesUpdateManyMutation } from './mutation';
import { findAllPossibleOrders, totalLinePerOrder, parseChangedData } from './helpers';
import normalize from './normalize';
import { ordersByIDsExportQuery } from './query';
import {
  EditTableViewWrapperStyle,
  NavbarWrapperStyle,
  HeaderWrapperStyle,
  SidebarWrapperStyle,
  SidebarFadeStyle,
  BodyWrapperStyle,
  LastTemplateUsedStyle,
} from './style';

type Props = {
  onCancel: () => void,
  type: string,
  selected: Object,
};

setConfig({ pureSFC: true });

const keyMap = {
  firstRight: ['command+right', 'ctrl+right'],
  firstLeft: ['command+left', 'ctrl+left'],
  firstTop: ['command+up', 'ctrl+up'],
  firstBottom: ['command+down', 'ctrl+down'],
};

const calculatePosition = (position, type) => {
  const [row, column] = position;
  switch (type) {
    default:
      return position;
    case 'right':
      return [row, +column + 1];
    case 'left':
      return [row, +column - 1];
    case 'top':
      return [+row - 1, column];
    case 'bottom':
      return [+row + 1, column];
  }
};

const focusCell = (position, type) => {
  const [row, column] = calculatePosition(position, type);
  const cell = document.getElementById(`input-${row}-${column}`);
  if (cell && cell.hasAttribute('disabled')) {
    focusCell([row, column], type);
  } else if (cell && !cell.hasAttribute('disabled')) {
    cell.focus();
  }
};

const getCellById = id => id && id.match(/\d+/g);

const handlers = {
  firstRight: e => {
    e.preventDefault();
    const position = getCellById(e.target.id);
    focusCell(position, 'right');
  },
  firstLeft: e => {
    e.preventDefault();
    const position = getCellById(e.target.id);
    focusCell(position, 'left');
  },
  firstTop: e => {
    e.preventDefault();
    const position = getCellById(e.target.id);
    focusCell(position, 'top');
  },
  firstBottom: e => {
    e.preventDefault();
    const position = getCellById(e.target.id);
    focusCell(position, 'bottom');
  },
};

function findColumns({
  entity,
  fields,
  templateColumns,
  showAll,
  hideColumns,
}: {
  entity: string,
  fields: Array<Object>,
  templateColumns: Array<string>,
  showAll: boolean,
  hideColumns: Array<string>,
}) {
  if (templateColumns.length) {
    return showAll
      ? fields
      : fields.filter(
          (item, idx) =>
            !hideColumns.includes(`${entity}-${idx}`) &&
            templateColumns.includes(`${entity}-${idx}`)
        );
  }
  return showAll ? fields : fields.filter((item, idx) => !hideColumns.includes(`${entity}-${idx}`));
}

function findColumnsForCustomFields({
  showAll,
  hideColumns,
  fields: customFields,
  templateColumns,
  entity,
}) {
  if (templateColumns && templateColumns.length > 0) {
    return showAll
      ? customFields
      : customFields.filter(
          (field, index) =>
            templateColumns.includes(`${entity}-customFields-${index}`) &&
            !hideColumns.includes(`${entity}-customFields-${index}`)
        );
  }
  return showAll
    ? customFields
    : customFields.filter(
        (field, index) => !hideColumns.includes(`${entity}-customFields-${index}`)
      );
}

function findAllFieldsFilter({
  orderColumnFieldsFilter,
  orderItemColumnFieldsFilter,
  batchColumnFieldsFilter,
  shipmentColumnFieldsFilter,
  orderCustomFieldsFilter,
  orderItemCustomFieldsFilter,
  batchCustomFieldsFilter,
  shipmentCustomFieldsFilter,
}: {
  orderColumnFieldsFilter: Array<Object>,
  orderItemColumnFieldsFilter: Array<Object>,
  batchColumnFieldsFilter: Array<Object>,
  shipmentColumnFieldsFilter: Array<Object>,
  orderCustomFieldsFilter: Array<Object>,
  orderItemCustomFieldsFilter: Array<Object>,
  batchCustomFieldsFilter: Array<Object>,
  shipmentCustomFieldsFilter: Array<Object>,
}): Array<string> {
  return [
    ...orderColumnFieldsFilter.map(item => `${item.name}`),
    ...orderItemColumnFieldsFilter.map(item => `orderItems.${item.name}`),
    ...batchColumnFieldsFilter.map(item => `orderItems.batches.${item.name}`),
    ...shipmentColumnFieldsFilter.map(item => `orderItems.batches.shipment.${item.name}`),
    ...orderCustomFieldsFilter.map(item => `customFields.${item.id}`),
    ...orderItemCustomFieldsFilter.map(item => `orderItems.customFields.${item.id}`),
    ...batchCustomFieldsFilter.map(item => `orderItems.batches.customFields.${item.id}`),
    ...shipmentCustomFieldsFilter.map(
      item => `orderItems.batches.shipment.customFields.${item.id}`
    ),
  ];
}

const getRowCounter = (counter, type) => {
  if (!counter[type]) {
    // eslint-disable-next-line no-param-reassign
    counter[type] = 0;
  }
  // eslint-disable-next-line no-param-reassign
  counter[type] += 1;
  return counter[type];
};

export default function TableInlineEdit({ type, selected, onCancel }: Props) {
  const [data] = useIdb(type, []);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [hideColumns, setHideColumns] = useState([]);
  const [templateColumns, setTemplateColumns] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [touched, setTouched] = useState({});
  const [editData, setEditData] = useState({
    orders: {},
    orderItems: {},
    batches: {},
    shipments: {},
  });

  const headerRef = useRef();
  const sidebarRef = useRef();
  const bodyRef = useRef();

  logger.warn({ hideColumns });

  const handleScroll = () => {
    if (bodyRef.current) {
      if (headerRef.current) headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
      if (sidebarRef.current) sidebarRef.current.scrollTop = bodyRef.current.scrollTop;
    }
  };

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.addEventListener('scroll', handleScroll);

    return () => {
      if (bodyRef.current) bodyRef.current.removeEventListener('scroll', handleScroll);
    };
  });

  const onToggle = useCallback(
    selectedColumn => {
      if (hideColumns && selectedColumn) {
        setHideColumns(
          hideColumns.includes(selectedColumn)
            ? hideColumns.filter(item => item !== selectedColumn)
            : [...hideColumns, selectedColumn]
        );
      }
    },
    [hideColumns]
  );

  useEffect(() => {
    if (data.length) {
      if (Object.keys(editData.orders).length === 0) {
        logger.warn('copy data');
        const { entities } = normalize({ orders: data });
        setEditData(cloneDeep(entities));
      }

      const listener = emitter.once('INLINE_CHANGE', newData => {
        logger.warn({ newData, editData });
        setErrorMessage('');

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

  const {
    sumShipments,
    sumOrders,
    sumOrderItems,
    sumBatches,
    collapsedRelation,
    expandRelation,
    ...mappingObjects
  } = formatOrderData(data);

  const { orderIds, orderItemsIds, batchIds, shipmentIds } = findAllPossibleOrders(
    selected,
    mappingObjects
  );

  logger.warn({ selected, mappingObjects });
  logger.warn({ orderIds, orderItemsIds, batchIds, shipmentIds });
  const { entities } = normalize({ orders: data });
  const orderColumnFieldsFilter = findColumns({
    showAll,
    hideColumns,
    templateColumns,
    fields: orderColumnFields,
    entity: 'ORDER',
  });

  const orderItemColumnFieldsFilter = findColumns({
    showAll,
    hideColumns,
    templateColumns,
    fields: orderItemColumnFields,
    entity: 'ORDER_ITEM',
  });
  const batchColumnFieldsFilter = findColumns({
    showAll,
    hideColumns,
    templateColumns,
    fields: batchColumnFields,
    entity: 'BATCH',
  });
  const shipmentColumnFieldsFilter = findColumns({
    showAll,
    hideColumns,
    templateColumns,
    fields: shipmentColumnFields,
    entity: 'SHIPMENT',
  });
  return (
    <QueryForAllCustomFields
      onCompleted={() => (!isReady ? setIsReady(true) : null)}
      render={({
        orderCustomFields,
        orderItemCustomFields,
        batchCustomFields,
        shipmentCustomFields,
      }) => {
        const orderCustomFieldsFilter = findColumnsForCustomFields({
          showAll,
          hideColumns,
          fields: orderCustomFields,
          templateColumns,
          entity: 'ORDER',
        });
        const orderItemCustomFieldsFilter = findColumnsForCustomFields({
          showAll,
          hideColumns,
          fields: orderItemCustomFields,
          templateColumns,
          entity: 'ORDER_ITEM',
        });
        const batchCustomFieldsFilter = findColumnsForCustomFields({
          showAll,
          hideColumns,
          fields: batchCustomFields,
          templateColumns,
          entity: 'BATCH',
        });
        const shipmentCustomFieldsFilter = findColumnsForCustomFields({
          showAll,
          hideColumns,
          fields: shipmentCustomFields,
          templateColumns,
          entity: 'SHIPMENT',
        });
        const rowCounter = {};
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
                          const result: {
                            data: ?{
                              entitiesUpdateMany: {
                                orders: {
                                  violations?: Array<{ message: string }>,
                                },
                                shipments: {
                                  violations?: Array<{ message: string }>,
                                },
                                batches: {
                                  violations?: Array<{ message: string }>,
                                },
                              },
                            },
                          } = await client.mutate({
                            mutation: entitiesUpdateManyMutation,
                            variables: parseChangedData(changedData, editData),
                          });
                          setLoading(false);
                          logger.warn({ result });
                          if (result && result.data && result.data.entitiesUpdateMany) {
                            if (
                              result.data.entitiesUpdateMany.orders.violations &&
                              result.data.entitiesUpdateMany.orders.violations.length
                            ) {
                              const errorMessages = result.data.entitiesUpdateMany.orders.violations.filter(
                                item => !!item
                              );
                              logger.warn({ errorMessages });
                              if (errorMessages.length)
                                setErrorMessage(errorMessages[0][0].message);
                            }
                            if (
                              result.data.entitiesUpdateMany.shipments.violations &&
                              result.data.entitiesUpdateMany.shipments.violations.length
                            ) {
                              const errorMessages = result.data.entitiesUpdateMany.shipments.violations.filter(
                                item => !!item
                              );
                              logger.warn({ errorMessages });
                              if (errorMessages.length)
                                setErrorMessage(errorMessages[0][0].message);
                            }
                            if (
                              result.data.entitiesUpdateMany.batches.violations &&
                              result.data.entitiesUpdateMany.batches.violations.length
                            ) {
                              const errorMessages = result.data.entitiesUpdateMany.batches.violations.filter(
                                item => !!item
                              );
                              logger.warn({ errorMessages });
                              if (errorMessages.length)
                                setErrorMessage(errorMessages[0][0].message);
                            }
                          }
                          setTouched({});
                        } catch (error) {
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
                    <ExportButton
                      type="Orders"
                      exportQuery={ordersByIDsExportQuery}
                      variables={{
                        fields: findAllFieldsFilter({
                          orderColumnFieldsFilter,
                          orderItemColumnFieldsFilter,
                          batchColumnFieldsFilter,
                          shipmentColumnFieldsFilter,
                          orderCustomFieldsFilter,
                          orderItemCustomFieldsFilter,
                          batchCustomFieldsFilter,
                          shipmentCustomFieldsFilter,
                        }),
                        ids: orderIds,
                      }}
                    />
                    {errorMessage && errorMessage.length > 0 && (
                      <div style={{ width: 400 }}> Error: {errorMessage} </div>
                    )}
                  </SlideViewNavBar>
                }
              >
                <div className={NavbarWrapperStyle}>
                  <UserConsumer>
                    {({ user }) => {
                      const lastUsedTemplate = window.localStorage.getItem(
                        `${user.id}-table-template`
                      );
                      return (
                        <>
                          {lastUsedTemplate && (
                            <div className={LastTemplateUsedStyle}>
                              <Label>
                                <FormattedMessage
                                  id="modules.RelationMaps.lastUsed"
                                  defaultMessage="LAST USED TEMPLATE:"
                                />
                              </Label>
                              <Display width="400px" align="left">
                                {lastUsedTemplate}
                              </Display>
                            </div>
                          )}
                          <SelectTemplateButton onClick={() => setShowTemplate(true)} />
                          <SlideView
                            isOpen={showTemplate}
                            onRequestClose={() => setShowTemplate(false)}
                            options={{ width: '980px' }}
                          >
                            <SelectTemplate
                              onSelect={template => {
                                setShowTemplate(false);
                                setShowAll(false);
                                window.localStorage.setItem(
                                  `${user.id}-table-template`,
                                  template.name
                                );
                                window.localStorage.setItem(
                                  `${user.id}-table-template-fields`,
                                  template.fields
                                );
                                setTemplateColumns(template.fields);
                              }}
                              onCancel={() => setShowTemplate(false)}
                            />
                          </SlideView>
                          <ToggleInput
                            toggled={showAll}
                            onToggle={() => (showAll ? setShowAll(false) : setShowAll(true))}
                          >
                            <Label>
                              <FormattedMessage
                                id="modules.RelationMaps.showAll"
                                defaultMessage="SHOW ALL"
                              />
                            </Label>
                          </ToggleInput>
                        </>
                      );
                    }}
                  </UserConsumer>
                </div>
                <HotKeys keyMap={keyMap} handlers={handlers}>
                  <div className={EditTableViewWrapperStyle}>
                    <div className={BodyWrapperStyle} ref={bodyRef}>
                      {Object.keys(editData.orders).length === 0 && <LoadingIcon />}
                      {orderIds.map((orderId, counter) => {
                        const order = mappingObjects.order[orderId];
                        if (!order) return null;
                        // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
                        const orderItems = (Object.values(mappingObjects.orderItem): any).filter(
                          item =>
                            order.relation.orderItem[item.data.id] &&
                            orderItemsIds.includes(item.data.id)
                        );
                        const batches = (Object.values(mappingObjects.batch): any).filter(
                          item =>
                            order.relation.batch[item.data.id] && batchIds.includes(item.data.id)
                        );
                        const totalLines = totalLinePerOrder(orderItems, batchIds);
                        return (
                          <TableRow key={orderId}>
                            <div>
                              {orderItems.length === 0 ? (
                                <TableItem
                                  rowNo={getRowCounter(rowCounter, 'order')}
                                  cell={`orders.${order.data.id}`}
                                  fields={orderColumnFieldsFilter}
                                  values={editData.orders[orderId]}
                                  validator={orderValidator}
                                />
                              ) : (
                                orderItems.map(orderItem =>
                                  Object.keys(orderItem.relation.batch).length === 0 ? (
                                    <TableItem
                                      rowNo={getRowCounter(rowCounter, 'order')}
                                      key={`order.${order.data.id}.${counter + 1}.duplication.${
                                        orderItem.data.id
                                      }`}
                                      cell={`orders.${order.data.id}`}
                                      fields={orderColumnFieldsFilter}
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
                                            key={`order.${order.data.id}.${counter +
                                              1}.duplication.${orderItem.data.id}.batch.${batchId}`}
                                            rowNo={getRowCounter(rowCounter, 'order')}
                                            cell={`orders.${order.data.id}`}
                                            fields={orderColumnFieldsFilter}
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
                                              rowNo={getRowCounter(rowCounter, 'order')}
                                              key={`order.${counter + 1}.hidden.${
                                                orderItem.data.id
                                              }.batch.${batchId}`}
                                              fields={orderColumnFieldsFilter}
                                            />
                                          ))}
                                    </React.Fragment>
                                  )
                                )
                              )}
                            </div>
                            <div>
                              {orderItems.length === 0 ? (
                                <TableItemForCustomFields
                                  rowNo={getRowCounter(rowCounter, 'orderCustom')}
                                  columnNo={orderColumnFieldsFilter.length}
                                  cell={`orders.${order.data.id}`}
                                  key={`orders.customField.${order.data.id}`}
                                  fields={orderCustomFieldsFilter}
                                  values={editData.orders[orderId]}
                                  validator={orderValidator}
                                />
                              ) : (
                                orderItems.map(orderItem =>
                                  Object.keys(orderItem.relation.batch).length === 0 ? (
                                    <TableItemForCustomFields
                                      rowNo={getRowCounter(rowCounter, 'orderCustom')}
                                      columnNo={orderColumnFieldsFilter.length}
                                      key={`order.${order.data.id}.${counter + 1}.duplication.${
                                        orderItem.data.id
                                      }`}
                                      cell={`orders.${order.data.id}`}
                                      fields={orderCustomFieldsFilter}
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
                                          <TableItemForCustomFields
                                            rowNo={getRowCounter(rowCounter, 'orderCustom')}
                                            columnNo={orderColumnFieldsFilter.length}
                                            key={`order.${order.data.id}.${counter +
                                              1}.duplication.${orderItem.data.id}.batch.${batchId}`}
                                            cell={`orders.${order.data.id}`}
                                            fields={orderCustomFieldsFilter}
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
                                              rowNo={getRowCounter(rowCounter, 'order')}
                                              columnNo={orderColumnFieldsFilter.length}
                                              key={`order.${counter + 1}.hidden.${
                                                orderItem.data.id
                                              }.batch.${batchId}`}
                                              fields={orderCustomFieldsFilter}
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
                                      rowNo={getRowCounter(rowCounter, 'orderItem')}
                                      columnNo={
                                        orderColumnFieldsFilter.length +
                                        orderCustomFieldsFilter.length
                                      }
                                      cell={`orderItems.${orderItem.data.id}`}
                                      key={`orderItem.${counter + 1}.${orderItem.data.id}`}
                                      fields={orderItemColumnFieldsFilter}
                                      values={editData.orderItems[orderItem.data.id]}
                                      validator={orderValidator}
                                    />
                                  ) : (
                                    <React.Fragment
                                      key={`orderItem.${counter + 1}.${orderItem.data.id}`}
                                    >
                                      {Object.keys(orderItem.relation.batch)
                                        .filter(batchId => batchIds.includes(batchId))
                                        .map(batchId => (
                                          <TableItem
                                            rowNo={getRowCounter(rowCounter, 'orderItem')}
                                            columnNo={
                                              orderColumnFieldsFilter.length +
                                              orderCustomFieldsFilter.length
                                            }
                                            cell={`orderItems.${orderItem.data.id}`}
                                            key={`orderItem.${counter + 1}.duplication.${batchId}`}
                                            fields={orderItemColumnFieldsFilter}
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
                                              rowNo={getRowCounter(rowCounter, 'orderItem')}
                                              columnNo={
                                                orderColumnFieldsFilter.length +
                                                orderCustomFieldsFilter.length
                                              }
                                              key={`orderItem.${counter + 1}.hidden.${batchId}`}
                                              fields={orderItemColumnFieldsFilter}
                                            />
                                          ))}
                                    </React.Fragment>
                                  )
                                )
                              ) : (
                                <TableEmptyItem
                                  fields={orderItemColumnFieldsFilter}
                                  rowNo={getRowCounter(rowCounter, 'orderItem')}
                                  columnNo={
                                    orderColumnFieldsFilter.length + orderCustomFieldsFilter.length
                                  }
                                />
                              )}
                            </div>
                            <div>
                              {orderItems.length ? (
                                orderItems.map(orderItem =>
                                  Object.keys(orderItem.relation.batch).length === 0 ? (
                                    <TableItemForCustomFields
                                      rowNo={getRowCounter(rowCounter, 'orderItemCustom')}
                                      columnNo={
                                        orderColumnFieldsFilter.length +
                                        orderCustomFieldsFilter.length +
                                        orderItemColumnFieldsFilter.length
                                      }
                                      key={`orderItem.${counter + 1}.${orderItem.data.id}`}
                                      cell={`orderItems.${orderItem.data.id}`}
                                      fields={orderItemCustomFieldsFilter}
                                      values={editData.orderItems[orderItem.data.id]}
                                      validator={orderValidator}
                                    />
                                  ) : (
                                    <React.Fragment
                                      key={`orderItem.${counter + 1}.${orderItem.data.id}`}
                                    >
                                      {Object.keys(orderItem.relation.batch)
                                        .filter(batchId => batchIds.includes(batchId))
                                        .map(batchId => (
                                          <TableItemForCustomFields
                                            rowNo={getRowCounter(rowCounter, 'orderItemCustom')}
                                            columnNo={
                                              orderColumnFieldsFilter.length +
                                              orderCustomFieldsFilter.length +
                                              orderItemColumnFieldsFilter.length
                                            }
                                            key={`orderItem.${counter + 1}.duplication.${batchId}`}
                                            cell={`orders.${order.data.id}`}
                                            fields={orderItemCustomFieldsFilter}
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
                                              rowNo={getRowCounter(rowCounter, 'orderItemCustom')}
                                              columnNo={
                                                orderColumnFieldsFilter.length +
                                                orderCustomFieldsFilter.length +
                                                orderItemColumnFieldsFilter.length
                                              }
                                              key={`orderItem.${counter + 1}.hidden.${batchId}`}
                                              fields={orderItemCustomFieldsFilter}
                                            />
                                          ))}
                                    </React.Fragment>
                                  )
                                )
                              ) : (
                                <TableEmptyItem
                                  fields={orderItemCustomFieldsFilter}
                                  rowNo={getRowCounter(rowCounter, 'orderItemCustom')}
                                  columnNo={
                                    orderColumnFieldsFilter.length +
                                    orderCustomFieldsFilter.length +
                                    orderItemColumnFieldsFilter.length
                                  }
                                />
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
                                          rowNo={getRowCounter(rowCounter, 'batch')}
                                          columnNo={
                                            orderColumnFieldsFilter.length +
                                            orderCustomFieldsFilter.length +
                                            orderItemColumnFieldsFilter.length +
                                            orderItemCustomFieldsFilter.length
                                          }
                                          cell={`batches.${batch.id}`}
                                          key={batch.id}
                                          fields={batchColumnFieldsFilter}
                                          values={editData.batches[batch.id]}
                                          validator={batchValidator}
                                        />
                                      ))
                                  )}
                                  {range(totalLines - batches.length).map(index => (
                                    <TableEmptyItem
                                      key={index}
                                      fields={batchColumnFieldsFilter}
                                      rowNo={getRowCounter(rowCounter, 'batch')}
                                      columnNo={
                                        orderColumnFieldsFilter.length +
                                        orderCustomFieldsFilter.length +
                                        orderItemColumnFieldsFilter.length +
                                        orderItemCustomFieldsFilter.length
                                      }
                                    />
                                  ))}
                                </>
                              ) : (
                                range(totalLines).map(index => (
                                  <TableEmptyItem
                                    key={index}
                                    fields={batchColumnFieldsFilter}
                                    rowNo={getRowCounter(rowCounter, 'batch')}
                                    columnNo={
                                      orderColumnFieldsFilter.length +
                                      orderCustomFieldsFilter.length +
                                      orderItemColumnFieldsFilter.length +
                                      orderItemCustomFieldsFilter.length
                                    }
                                  />
                                ))
                              )}
                            </div>

                            <div>
                              {batchIds.length ? (
                                <>
                                  {orderItems.map(orderItem =>
                                    orderItem.data.batches
                                      .filter(batch => batchIds.includes(batch.id))
                                      .map(batch => (
                                        <TableItemForCustomFields
                                          rowNo={getRowCounter(rowCounter, 'batchCustom')}
                                          columnNo={
                                            orderColumnFieldsFilter.length +
                                            orderCustomFieldsFilter.length +
                                            orderItemColumnFieldsFilter.length +
                                            orderItemCustomFieldsFilter.length +
                                            batchColumnFieldsFilter.length
                                          }
                                          cell={`batches.${batch.id}`}
                                          key={`batches.customFields.${batch.id}`}
                                          fields={batchCustomFieldsFilter}
                                          values={editData.batches[batch.id]}
                                          validator={batchValidator}
                                        />
                                      ))
                                  )}
                                  {range(totalLines - batches.length).map(index => (
                                    <TableEmptyItem
                                      key={index}
                                      fields={batchCustomFieldsFilter}
                                      rowNo={getRowCounter(rowCounter, 'batchCustom')}
                                      columnNo={
                                        orderColumnFieldsFilter.length +
                                        orderCustomFieldsFilter.length +
                                        orderItemColumnFieldsFilter.length +
                                        orderItemCustomFieldsFilter.length +
                                        batchColumnFieldsFilter.length
                                      }
                                    />
                                  ))}
                                </>
                              ) : (
                                range(totalLines).map(index => (
                                  <TableEmptyItem
                                    key={index}
                                    fields={batchCustomFieldsFilter}
                                    rowNo={getRowCounter(rowCounter, 'batchCustom')}
                                    columnNo={
                                      orderColumnFieldsFilter.length +
                                      orderCustomFieldsFilter.length +
                                      orderItemColumnFieldsFilter.length +
                                      orderItemCustomFieldsFilter.length +
                                      batchColumnFieldsFilter.length
                                    }
                                  />
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
                                      rowNo={getRowCounter(rowCounter, 'shipment')}
                                      columnNo={
                                        orderColumnFieldsFilter.length +
                                        orderCustomFieldsFilter.length +
                                        orderItemColumnFieldsFilter.length +
                                        orderItemCustomFieldsFilter.length +
                                        batchColumnFieldsFilter.length +
                                        batchCustomFieldsFilter.length
                                      }
                                      key={`shipment.${counter + 1}.${shipmentId}`}
                                      cell={`shipments.${shipment.data.id}`}
                                      fields={shipmentColumnFieldsFilter}
                                      values={editData.shipments[shipment.data.id]}
                                      validator={shipmentValidator}
                                    />
                                  );
                                })}
                              {range(
                                totalLines -
                                  shipmentIds.filter(
                                    shipmentId => !!order.relation.shipment[shipmentId]
                                  ).length
                              ).map(index => (
                                <TableEmptyItem
                                  key={index}
                                  fields={shipmentColumnFieldsFilter}
                                  rowNo={getRowCounter(rowCounter, 'shipment')}
                                  columnNo={
                                    orderColumnFieldsFilter.length +
                                    orderCustomFieldsFilter.length +
                                    orderItemColumnFieldsFilter.length +
                                    orderItemCustomFieldsFilter.length +
                                    batchColumnFieldsFilter.length +
                                    batchCustomFieldsFilter.length
                                  }
                                />
                              ))}
                            </div>

                            <div>
                              {shipmentIds
                                .filter(shipmentId => !!order.relation.shipment[shipmentId])
                                .map(shipmentId => {
                                  const shipment = mappingObjects.shipment[shipmentId];
                                  return (
                                    <TableItemForCustomFields
                                      rowNo={getRowCounter(rowCounter, 'shipmentCustom')}
                                      columnNo={
                                        orderColumnFieldsFilter.length +
                                        orderCustomFieldsFilter.length +
                                        orderItemColumnFieldsFilter.length +
                                        orderItemCustomFieldsFilter.length +
                                        batchColumnFieldsFilter.length +
                                        batchCustomFieldsFilter.length +
                                        shipmentColumnFieldsFilter.length
                                      }
                                      cell={`shipments.${shipment.data.id}`}
                                      key={`shipments.customFields.${shipment.data.id}`}
                                      fields={shipmentCustomFieldsFilter}
                                      values={editData.shipments[shipment.data.id]}
                                      validator={shipmentValidator}
                                    />
                                  );
                                })}
                              {range(
                                totalLines -
                                  shipmentIds.filter(
                                    shipmentId => !!order.relation.shipment[shipmentId]
                                  ).length
                              ).map(index => (
                                <TableEmptyItem
                                  key={index}
                                  fields={shipmentCustomFieldsFilter}
                                  rowNo={getRowCounter(rowCounter, 'shipmentCustom')}
                                  columnNo={
                                    orderColumnFieldsFilter.length +
                                    orderCustomFieldsFilter.length +
                                    orderItemColumnFieldsFilter.length +
                                    orderItemCustomFieldsFilter.length +
                                    batchColumnFieldsFilter.length +
                                    batchCustomFieldsFilter.length +
                                    shipmentColumnFieldsFilter.length
                                  }
                                />
                              ))}
                            </div>
                          </TableRow>
                        );
                      })}
                    </div>

                    <div className={HeaderWrapperStyle} ref={headerRef}>
                      <TableHeader
                        entity="ORDER"
                        showAll={showAll}
                        info={orderColumns}
                        hideColumns={hideColumns}
                        templateColumns={templateColumns}
                        onToggle={onToggle}
                      />
                      <TableHeaderForCustomFields
                        entity="ORDER"
                        customFields={orderCustomFields}
                        onToggle={onToggle}
                        hideColumns={hideColumns}
                        showAll={showAll}
                        templateColumns={templateColumns}
                      />
                      <TableHeader
                        entity="ORDER_ITEM"
                        showAll={showAll}
                        info={orderItemColumns}
                        hideColumns={hideColumns}
                        templateColumns={templateColumns}
                        onToggle={onToggle}
                      />
                      <TableHeaderForCustomFields
                        entity="ORDER_ITEM"
                        customFields={orderItemCustomFields}
                        onToggle={onToggle}
                        hideColumns={hideColumns}
                        showAll={showAll}
                        templateColumns={templateColumns}
                      />
                      <TableHeader
                        entity="BATCH"
                        showAll={showAll}
                        info={batchColumns}
                        hideColumns={hideColumns}
                        templateColumns={templateColumns}
                        onToggle={onToggle}
                      />
                      <TableHeaderForCustomFields
                        entity="BATCH"
                        customFields={batchCustomFields}
                        onToggle={onToggle}
                        hideColumns={hideColumns}
                        showAll={showAll}
                        templateColumns={templateColumns}
                      />
                      <TableHeader
                        entity="SHIPMENT"
                        showAll={showAll}
                        info={shipmentColumns}
                        hideColumns={hideColumns}
                        templateColumns={templateColumns}
                        onToggle={onToggle}
                      />
                      <TableHeaderForCustomFields
                        entity="SHIPMENT"
                        customFields={shipmentCustomFields}
                        onToggle={onToggle}
                        hideColumns={hideColumns}
                        showAll={showAll}
                        templateColumns={templateColumns}
                      />
                    </div>

                    <div className={SidebarWrapperStyle} ref={sidebarRef}>
                      {orderIds.map((orderId, counter) => {
                        const order = mappingObjects.order[orderId];
                        if (!order) return null;
                        // it is a flow issue so cast value to any https://github.com/facebook/flow/issues/2174
                        const orderItems = (Object.values(mappingObjects.orderItem): any).filter(
                          item =>
                            order.relation.orderItem[item.data.id] &&
                            orderItemsIds.includes(item.data.id)
                        );
                        const totalLines = totalLinePerOrder(orderItems, batchIds);

                        return (
                          <LineNumber
                            height={`${totalLines * 40}px`}
                            line={counter + 1}
                            key={`line-for-${orderId}`}
                          />
                        );
                      })}
                    </div>

                    <div className={SidebarFadeStyle} />
                  </div>
                </HotKeys>
              </Layout>
            )}
          </ApolloConsumer>
        );
      }}
    />
  );
}
