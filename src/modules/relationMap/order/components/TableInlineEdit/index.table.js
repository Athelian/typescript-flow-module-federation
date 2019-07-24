// @flow
import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { ApolloConsumer } from 'react-apollo';
import type { IntlShape } from 'react-intl';
import { FormattedMessage, injectIntl } from 'react-intl';
import { diff } from 'deep-object-diff';
import { HotKeys } from 'react-hotkeys';
import { set, isEqual, cloneDeep } from 'lodash';
import usePrevious from 'hooks/usePrevious';
import { UserConsumer } from 'modules/user';
import emitter from 'utils/emitter';
import { trackingError } from 'utils/trackingError';
import { getByPathWithDefault, getByPath } from 'utils/fp';
import { calculatePackageQuantity, getBatchLatestQuantity } from 'utils/batch';
import { Content, SlideViewLayout } from 'components/Layout';
import SlideView from 'components/SlideView';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import {
  SaveButton,
  ResetButton,
  SelectTemplateButton,
  ExportGenericButton,
} from 'components/Buttons';
import { ToggleInput, Label, Display } from 'components/Form';
import LoadingIcon from 'components/LoadingIcon';
import logger from 'utils/logger';
import SelectTemplate from 'modules/tableTemplate/common/SelectTemplate';
import {
  orderColumnFields,
  orderItemColumnFields,
  batchColumnFields,
  containerColumnFields,
  shipmentColumnFields,
  productColumnFields,
  allColumnIds,
} from 'modules/tableTemplate/constants';
import QueryForAllCustomFields from 'modules/tableTemplate/common/QueryForAllCustomFields';
import { formatOrders } from './formatter';
import { entitiesUpdateManyMutation } from './mutation';
import {
  parseChangedData,
  getOrderItemIdsByOrderId,
  getExportColumns,
  getExportRows,
} from './helpers';
import { EditTableViewWrapperStyle, NavbarWrapperStyle, LastTemplateUsedStyle } from './style';
import { keyMap, handlers } from './keyMap';
import { Table } from './components';
import { findColumnsForCustomFields, findColumns, totalColumn } from './tableRenders';

type Props = {|
  allId: {
    orderIds: Array<string>,
    orderItemIds: Array<string>,
    batchIds: Array<string>,
    shipmentIds: Array<string>,
    productIds: Array<string>,
    containerIds: Array<string>,
  },
  targetIds: {
    orderIds: Array<string>,
    orderItemIds: Array<string>,
    batchIds: Array<string>,
    shipmentIds: Array<string>,
  },
  orders: Array<Object>,
  shipments: Array<Object>,
  entities: {
    orders: Object,
    orderItems: Object,
    batches: Object,
    products: Object,
    shipments: Object,
    containers: Object,
  },
  intl: IntlShape,
|};

const isModifyPort = (field: string) => {
  const ports = [
    'voyages.0.arrivalPort',
    'voyages.1.departurePort',
    'voyages.1.arrivalPort',
    'voyages.2.departurePort',
  ];
  return ports.some(port => field.includes(port));
};

const TableInlineEdit = ({ allId, targetIds, intl, entities, ...dataSource }: Props) => {
  const initShowAll = window.localStorage.getItem('filterRMEditViewShowAll');
  const initTemplateColumn = window.localStorage.getItem('rmTemplateFilterColumns');
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [templateColumns, setTemplateColumns] = useState(
    initTemplateColumn ? JSON.parse(initTemplateColumn) : [...allColumnIds]
  );
  const [isReady, setIsReady] = useState(false);
  const [showAll, setShowAll] = useState(Number.isInteger(+initShowAll) ? !!+initShowAll : true);
  const [loading, setLoading] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [touched, setTouched] = useState({});
  const [editData, setEditData] = useState({
    orders: {},
    orderItems: {},
    batches: {},
    shipments: {},
    products: {},
    containers: {},
  });
  const [isChangeData, setIsChangeData] = useState(false);
  const mappingObjects = formatOrders({ ...dataSource, entities });
  const prevEntities = usePrevious(entities);
  const onToggle = useCallback(
    selectedColumn => {
      if (templateColumns && selectedColumn) {
        const filteredTemplateColumns = templateColumns.includes(selectedColumn)
          ? templateColumns.filter(item => item !== selectedColumn)
          : [...templateColumns, selectedColumn];
        setTemplateColumns(filteredTemplateColumns);
        window.localStorage.setItem(
          'rmTemplateFilterColumns',
          JSON.stringify(filteredTemplateColumns)
        );
      }
    },
    [templateColumns]
  );
  useEffect(() => {
    if (!isEqual(prevEntities, entities) || isChangeData) {
      logger.warn('copy data');
      setEditData(entities);
      setIsChangeData(false);
    }
  }, [prevEntities, entities, isChangeData]);
  useEffect(() => {
    if (dataSource.orders.length || dataSource.shipments.length) {
      const listener = emitter.once('INLINE_CHANGE', (newData: mixed) => {
        logger.warn({ newData });
        setErrorMessage('');
        const name = getByPathWithDefault('', 'name', newData);
        const value = getByPathWithDefault(null, 'value', newData);
        const hasError = getByPathWithDefault(false, 'hasError', newData);
        let newEditData = cloneDeep(editData);
        const [entityType, id, ...fields] = name.split('.');
        const [field, subField] = fields || [];
        // init empty values for custom field in case there is empty from api
        if (field === 'customFields') {
          if (
            getByPathWithDefault([], `${entityType}.${id}.customFields.fieldValues`, newEditData)
              .length === 0
          ) {
            const fieldDefinitions = getByPathWithDefault(
              [],
              `${entityType}.${id}.customFields.fieldDefinitions`,
              newEditData
            );
            newEditData = set(
              newEditData,
              `${entityType}.${id}.customFields.fieldValues`,
              fieldDefinitions.map(fieldDefinition => ({
                fieldDefinition,
                value: {
                  string: '',
                },
              }))
            );
          }
        }

        if (entityType === 'orders' && field === 'currency') {
          logger.warn({ field });
          const orderItemIds = getOrderItemIdsByOrderId(id, mappingObjects);
          orderItemIds.forEach(orderItemId => {
            newEditData = set(newEditData, `orderItems.${orderItemId}.price.currency`, value);
          });
        }

        if (entityType === 'batches') {
          if (field === 'autoCalculatePackageQuantity' && !!value) {
            const batch = getByPath(`batches.${id}`, editData);
            if (batch) {
              newEditData = set(
                newEditData,
                `batches.${id}.packageQuantity`,
                calculatePackageQuantity(batch)
              );
            }
          }

          if (field === 'quantity' || field === 'packageCapacity') {
            const batch = getByPath(`batches.${id}`, editData);
            if (batch && batch.autoCalculatePackageQuantity) {
              newEditData = set(
                newEditData,
                `batches.${id}.packageQuantity`,
                calculatePackageQuantity({
                  ...batch,
                  ...(field === 'quantity' ? { quantity: value } : { packageCapacity: value }),
                })
              );
            }
          }

          if (field === 'batchQuantityRevisions') {
            const batch = getByPath(`batches.${id}`, editData);
            // trigger auto calculate when delete quantity
            if (batch && batch.autoCalculatePackageQuantity && Array.isArray(value)) {
              newEditData = set(
                newEditData,
                `batches.${id}.packageQuantity`,
                calculatePackageQuantity({
                  ...batch,
                  batchQuantityRevisions: value,
                })
              );
            }

            // trigger auto calculate for last quantity revision
            if (
              batch &&
              Number(subField) >= 0 &&
              Number(value) >= 0 &&
              Number(subField) === batch.batchQuantityRevisions.length - 1 &&
              batch.autoCalculatePackageQuantity
            ) {
              newEditData = set(
                newEditData,
                `batches.${id}.packageQuantity`,
                calculatePackageQuantity({
                  ...batch,
                  batchQuantityRevisions: [
                    {
                      quantity: value,
                    },
                  ],
                })
              );
            }
          }

          if (field === 'batchQuantityRevisionsHeader') {
            if (subField === 'create') {
              const { batches } = newEditData;
              const newBatchEntries = (Object.entries(batches || {}): Array<any>).map(entries => {
                const [batchId, batch] = entries;
                const { quantity, batchQuantityRevisions } = batch;
                const lastQuantity = getBatchLatestQuantity({ quantity, batchQuantityRevisions });
                for (let i = 0; i < Number(value); i += 1) {
                  if (!batchQuantityRevisions[i]) {
                    batchQuantityRevisions[i] = {
                      type: 'Other',
                      quantity: lastQuantity,
                    };
                  }
                }
                return [
                  batchId,
                  {
                    ...batch,
                    batchQuantityRevisions,
                  },
                ];
              });
              const newBatches = Object.fromEntries(newBatchEntries);
              set(newEditData, `batches`, newBatches);
            }

            if (subField === 'apply') {
              const { batches } = newEditData;
              const { index, type } = value;
              const newBatchEntries = (Object.entries(batches || {}): Array<any>).map(entries => {
                const [batchId, batch] = entries;
                const { batchQuantityRevisions } = batch;
                if (batchQuantityRevisions.length >= index) {
                  set(batch, `batchQuantityRevisions[${index - 1}].type`, type);
                }
                return [batchId, batch];
              });
              const newBatches = Object.fromEntries(newBatchEntries);
              set(newEditData, `batches`, newBatches);
            }
          }
        }

        if (entityType === 'shipments' && field === 'transportType') {
          const currentShipment = newEditData.shipments[id];
          logger.warn({ currentShipment, field });
          currentShipment.voyages.forEach((voyage, counter) => {
            newEditData = set(newEditData, `shipments.${id}.voyages.${counter}.arrivalPort`, {
              airport: null,
              seaport: null,
              __typename: 'Port',
            });
            newEditData = set(newEditData, `shipments.${id}.voyages.${counter}.departurePort`, {
              airport: null,
              seaport: null,
              __typename: 'Port',
            });
          });
        }
        const editField = fields.join('.');
        if (entityType === 'shipments' && isModifyPort(editField)) {
          const currentShipment = newEditData.shipments[id];
          logger.warn({ field: fields.join('.'), currentShipment });
          if (
            currentShipment.voyages.length > 1 &&
            ['voyages.0.arrivalPort', 'voyages.1.departurePort'].some(port =>
              editField.includes(port)
            )
          ) {
            newEditData = set(
              newEditData,
              `shipments.${id}.voyages.0.arrivalPort.${fields[fields.length - 1]}`,
              value
            );
            newEditData = set(
              newEditData,
              `shipments.${id}.voyages.1.departurePort.${fields[fields.length - 1]}`,
              value
            );
          }
          if (
            currentShipment.voyages.length > 2 &&
            ['voyages.1.arrivalPort', 'voyages.2.departurePort'].some(port =>
              editField.includes(port)
            )
          ) {
            newEditData = set(
              newEditData,
              `shipments.${id}.voyages.1.arrivalPort.${fields[fields.length - 1]}`,
              value
            );
            newEditData = set(
              newEditData,
              `shipments.${id}.voyages.2.departurePort.${fields[fields.length - 1]}`,
              value
            );
          }
        }
        if (field !== 'batchQuantityRevisionsHeader') {
          newEditData = set(newEditData, name, value);
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
        }
        setEditData(newEditData);
      });
      return () => {
        listener.remove();
      };
    }
    return () => {};
  });
  const { orderIds, orderItemIds, batchIds } = allId;
  const orderColumnFieldsFilter = findColumns({
    showAll,
    templateColumns,
    fields: orderColumnFields,
  });
  const orderItemColumnFieldsFilter = findColumns({
    showAll,
    templateColumns,
    fields: orderItemColumnFields,
  });
  const batchColumnFieldsFilter = findColumns({
    showAll,
    templateColumns,
    fields: batchColumnFields,
  });
  const containerColumnFieldsFilter = findColumns({
    showAll,
    templateColumns,
    fields: containerColumnFields,
  });
  const shipmentColumnFieldsFilter = findColumns({
    showAll,
    templateColumns,
    fields: shipmentColumnFields,
  });
  const productColumnFieldsFilter = findColumns({
    showAll,
    templateColumns,
    fields: productColumnFields,
  });
  return (
    <QueryForAllCustomFields
      onCompleted={customFields => {
        if (!isReady) {
          setIsReady(true);
        }
        const orderCustomFieldIds = getByPathWithDefault([], 'order', customFields).map(
          customField => `customFields.${customField.id}`
        );
        const orderItemCustomFieldIds = getByPathWithDefault([], 'orderItem', customFields).map(
          customField => `customFields.${customField.id}`
        );
        const batchCustomFieldIds = getByPathWithDefault([], 'batch', customFields).map(
          customField => `customFields.${customField.id}`
        );
        const shipmentCustomFieldIds = getByPathWithDefault([], 'shipment', customFields).map(
          customField => `customFields.${customField.id}`
        );
        const productCustomFieldIds = getByPathWithDefault([], 'product', customFields).map(
          customField => `customFields.${customField.id}`
        );
        const allCustomColumnIds = [
          ...orderCustomFieldIds,
          ...orderItemCustomFieldIds,
          ...batchCustomFieldIds,
          ...shipmentCustomFieldIds,
          ...productCustomFieldIds,
        ];
        const haveCustomFields =
          orderCustomFieldIds.length > 0 ||
          orderItemCustomFieldIds.length > 0 ||
          batchCustomFieldIds.length > 0 ||
          shipmentCustomFieldIds.length > 0 ||
          productCustomFieldIds.length > 0;
        logger.warn({
          haveCustomFields,
          templateColumns,
          allColumnIds,
        });
        if (haveCustomFields && templateColumns.length === allColumnIds.length) {
          setTemplateColumns([...new Set([...templateColumns, ...allCustomColumnIds])]);
        }
      }}
      render={({
        orderCustomFields,
        orderItemCustomFields,
        batchCustomFields,
        shipmentCustomFields,
        productCustomFields,
      }) => {
        const orderCustomFieldsFilter = findColumnsForCustomFields({
          showAll,
          fields: orderCustomFields,
          templateColumns,
        });
        const orderItemCustomFieldsFilter = findColumnsForCustomFields({
          showAll,
          fields: orderItemCustomFields,
          templateColumns,
        });
        const batchCustomFieldsFilter = findColumnsForCustomFields({
          showAll,
          fields: batchCustomFields,
          templateColumns,
        });
        const shipmentCustomFieldsFilter = findColumnsForCustomFields({
          showAll,
          fields: shipmentCustomFields,
          templateColumns,
        });
        const productCustomFieldsFilter = findColumnsForCustomFields({
          showAll,
          fields: productCustomFields,
          templateColumns,
        });
        const allColumns = {
          orderColumnFieldsFilter,
          orderCustomFieldsFilter,
          orderItemColumnFieldsFilter,
          orderItemCustomFieldsFilter,
          batchColumnFieldsFilter,
          batchCustomFieldsFilter,
          containerColumnFieldsFilter,
          shipmentColumnFieldsFilter,
          shipmentCustomFieldsFilter,
          productColumnFieldsFilter,
          productCustomFieldsFilter,
        };
        logger.warn({ mappingObjects, editData, entities, errors });
        return (
          <ApolloConsumer>
            {client => (
              <SlideViewLayout>
                <SlideViewNavBar>
                  <EntityIcon icon="EDIT_TABLE" color="RELATION_MAP" />
                  {!isEqual(entities, editData) && (
                    <>
                      <ResetButton
                        onClick={() => {
                          setEditData(entities);
                        }}
                      />
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
                              errors?: Array<Object>,
                            } = await client.mutate({
                              mutation: entitiesUpdateManyMutation,
                              variables: parseChangedData({
                                changedData,
                                editData,
                                mappingObjects,
                              }),
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
                                if (errorMessages.length)
                                  setErrorMessage(errorMessages[0][0].message);
                              }
                              setIsChangeData(true);
                            } else if (result.errors) {
                              trackingError(result.errors);
                              toast.error('There was an error. Please try again later');
                            }
                          } catch (error) {
                            toast.error('There was an error. Please try again later');
                            setLoading(false);
                            trackingError(error);
                          }
                        }}
                        disabled={isEqual(entities, editData) || Object.keys(errors).length > 0}
                      />
                    </>
                  )}
                  <ExportGenericButton
                    columns={() => getExportColumns(intl, allColumns)}
                    rows={() =>
                      getExportRows({
                        targetIds,
                        data: { editData, mappingObjects },
                        ids: allId,
                        columns: allColumns,
                      })
                    }
                  />
                  {errorMessage && errorMessage.length > 0 && (
                    <div style={{ width: 400 }}> Error: {errorMessage} </div>
                  )}
                </SlideViewNavBar>

                <Content>
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
                                    'rmTemplateFilterColumns',
                                    JSON.stringify(template.fields)
                                  );
                                  setTemplateColumns(template.fields);
                                }}
                                onCancel={() => setShowTemplate(false)}
                              />
                            </SlideView>
                            <ToggleInput
                              toggled={showAll}
                              onToggle={() => {
                                setShowAll(!showAll);
                                window.localStorage.setItem(
                                  'filterRMEditViewShowAll',
                                  showAll ? '0' : '1'
                                );
                              }}
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
                  <HotKeys
                    keyMap={keyMap}
                    handlers={handlers}
                    className={EditTableViewWrapperStyle}
                  >
                    {Object.keys(editData.orders || {}).length === 0 &&
                    Object.keys(editData.shipments || {}).length === 0 ? (
                      <LoadingIcon />
                    ) : (
                      <Table
                        itemData={{
                          targetIds,
                          editData,
                          mappingObjects,
                          ids: allId,
                          columns: allColumns,
                          allColumnIds,
                          showAll,
                          templateColumns,
                        }}
                        rowHeight={40}
                        columnCount={showAll ? totalColumn(allColumns) : templateColumns.length}
                        columnWidth={210}
                        showAllColumn={showAll}
                        customColumns={{
                          orderCustomFields,
                          orderItemCustomFields,
                          batchCustomFields,
                          shipmentCustomFields,
                          productCustomFields,
                        }}
                        templateColumns={templateColumns}
                        onToggle={onToggle}
                        lines={{
                          targetIds,
                          orderIds,
                          batchIds,
                          orderItemIds,
                          mappingObjects,
                        }}
                      />
                    )}
                  </HotKeys>
                </Content>
              </SlideViewLayout>
            )}
          </ApolloConsumer>
        );
      }}
    />
  );
};
export default injectIntl(TableInlineEdit);
