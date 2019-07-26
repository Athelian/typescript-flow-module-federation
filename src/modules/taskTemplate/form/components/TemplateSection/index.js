// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { StringValue } from 'react-values';
import { Subscribe } from 'unstated';
import { TASK_TEMPLATE_UPDATE } from 'modules/permission/constants/task';
import usePermission from 'hooks/usePermission';
import TemplateFormContainer from 'modules/taskTemplate/form/container';
import validator from 'modules/taskTemplate/form/validator';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import { FormField } from 'modules/form';
import Icon from 'components/Icon';
import {
  TextInputFactory,
  TextAreaInputFactory,
  FieldItem,
  Label,
  FormTooltip,
  RadioInput,
} from 'components/Form';
import GridColumn from 'components/GridColumn';
import { hasAutoDate } from 'modules/taskTemplate/form/helpers';
import {
  TableTemplateSectionWrapperStyle,
  EntityTypeStyle,
  EntityTypesWrapperStyle,
  EntityIconStyle,
} from './style';

type Props = {
  isNew: boolean,
};

const TableTemplateSection = ({ isNew }: Props) => {
  const { hasPermission } = usePermission();
  const allowUpdate = hasPermission(TASK_TEMPLATE_UPDATE);

  return (
    <div className={TableTemplateSectionWrapperStyle}>
      <GridColumn>
        <Subscribe to={[TemplateFormContainer]}>
          {({ originalValues, state, setFieldValue, setAllTasksManualDates }) => {
            const values = { ...originalValues, ...state };

            return (
              <>
                <FormField
                  name="name"
                  initValue={values.name}
                  validator={validator}
                  values={values}
                  setFieldValue={setFieldValue}
                >
                  {({ name, ...inputHandlers }) => (
                    <TextInputFactory
                      name={name}
                      {...inputHandlers}
                      isNew={isNew}
                      originalValue={originalValues[name]}
                      label={
                        <FormattedMessage id="modules.TaskTemplates.name" defaultMessage="NAME" />
                      }
                      required
                      editable={allowUpdate}
                    />
                  )}
                </FormField>
                <FormField
                  validator={validator}
                  values={values}
                  name="description"
                  initValue={values.description}
                  setFieldValue={setFieldValue}
                >
                  {({ name, ...inputHandlers }) => (
                    <TextAreaInputFactory
                      name={name}
                      {...inputHandlers}
                      isNew={isNew}
                      originalValue={originalValues[name]}
                      label={
                        <FormattedMessage
                          id="modules.TaskTemplates.description"
                          defaultMessage="DESCRIPTION"
                        />
                      }
                      editable={allowUpdate}
                      vertical={false}
                      inputWidth="200px"
                      inputHeight="100px"
                    />
                  )}
                </FormField>
                <FormField
                  name="entityType"
                  initValue={values.entityType}
                  setFieldValue={setFieldValue}
                  values={values}
                >
                  {({ name, isTouched, errorMessage, ...inputHandlers }) => (
                    <FieldItem
                      vertical
                      label={
                        <Label height="30px" required>
                          <FormattedMessage id="modules.TaskTemplates.type" defaultMessage="TYPE" />
                        </Label>
                      }
                      tooltip={
                        <FormTooltip
                          isNew={isNew}
                          errorMessage={isTouched && errorMessage}
                          changedValues={{
                            oldValue: originalValues[name],
                            newValue: inputHandlers.value,
                          }}
                        />
                      }
                      input={
                        <StringValue>
                          {({ value: dialogIsOpen, set: setDialog }) => (
                            <>
                              <div className={EntityTypesWrapperStyle}>
                                <RadioInput
                                  data-testid="orderRadio"
                                  selected={inputHandlers.value === 'Order'}
                                  onToggle={() => {
                                    if (values.entityType !== 'Order') {
                                      if (hasAutoDate(values.tasks)) {
                                        setDialog('Order');
                                      } else {
                                        setFieldValue(name, 'Order');
                                      }
                                    }
                                  }}
                                  editable={allowUpdate}
                                >
                                  <div className={EntityTypeStyle}>
                                    <div className={EntityIconStyle('ORDER')}>
                                      <Icon icon="ORDER" />
                                    </div>
                                    <Label>
                                      <FormattedMessage
                                        id="modules.TaskTemplates.order"
                                        defaultMessage="ORDER"
                                      />
                                    </Label>
                                  </div>
                                </RadioInput>

                                <RadioInput
                                  selected={inputHandlers.value === 'OrderItem'}
                                  onToggle={() => {
                                    if (values.entityType !== 'OrderItem') {
                                      if (hasAutoDate(values.tasks)) {
                                        setDialog('OrderItem');
                                      } else {
                                        setFieldValue(name, 'OrderItem');
                                      }
                                    }
                                  }}
                                  editable={allowUpdate}
                                >
                                  <div className={EntityTypeStyle}>
                                    <div className={EntityIconStyle('ORDER_ITEM')}>
                                      <Icon icon="ORDER_ITEM" />
                                    </div>
                                    <Label>
                                      <FormattedMessage
                                        id="modules.TaskTemplates.orderItem"
                                        defaultMessage="ITEM"
                                      />
                                    </Label>
                                  </div>
                                </RadioInput>

                                <RadioInput
                                  selected={inputHandlers.value === 'Batch'}
                                  onToggle={() => {
                                    if (values.entityType !== 'Batch') {
                                      if (hasAutoDate(values.tasks)) {
                                        setDialog('Batch');
                                      } else {
                                        setFieldValue(name, 'Batch');
                                      }
                                    }
                                  }}
                                  editable={allowUpdate}
                                >
                                  <div className={EntityTypeStyle}>
                                    <div className={EntityIconStyle('BATCH')}>
                                      <Icon icon="BATCH" />
                                    </div>
                                    <Label>
                                      <FormattedMessage
                                        id="modules.TaskTemplates.batch"
                                        defaultMessage="BATCH"
                                      />
                                    </Label>
                                  </div>
                                </RadioInput>

                                <RadioInput
                                  selected={inputHandlers.value === 'Shipment'}
                                  onToggle={() => {
                                    if (values.entityType !== 'Shipment') {
                                      if (hasAutoDate(values.tasks)) {
                                        setDialog('Shipment');
                                      } else {
                                        setFieldValue(name, 'Shipment');
                                      }
                                    }
                                  }}
                                  editable={allowUpdate}
                                >
                                  <div className={EntityTypeStyle}>
                                    <div className={EntityIconStyle('SHIPMENT')}>
                                      <Icon icon="SHIPMENT" />
                                    </div>
                                    <Label>
                                      <FormattedMessage
                                        id="modules.TaskTemplates.shipment"
                                        defaultMessage="SHIPMENT"
                                      />
                                    </Label>
                                  </div>
                                </RadioInput>

                                <RadioInput
                                  selected={inputHandlers.value === 'Product'}
                                  onToggle={() => {
                                    if (values.entityType !== 'Product') {
                                      if (hasAutoDate(values.tasks)) {
                                        setDialog('Product');
                                      } else {
                                        setFieldValue(name, 'Product');
                                      }
                                    }
                                  }}
                                  editable={allowUpdate}
                                >
                                  <div className={EntityTypeStyle}>
                                    <div className={EntityIconStyle('PRODUCT')}>
                                      <Icon icon="PRODUCT" />
                                    </div>
                                    <Label>
                                      <FormattedMessage
                                        id="modules.TaskTemplates.product"
                                        defaultMessage="PRODUCT"
                                      />
                                    </Label>
                                  </div>
                                </RadioInput>

                                <RadioInput
                                  selected={inputHandlers.value === 'ProductProvider'}
                                  onToggle={() => {
                                    if (values.entityType !== 'ProductProvider') {
                                      if (hasAutoDate(values.tasks)) {
                                        setDialog('ProductProvider');
                                      } else {
                                        setFieldValue(name, 'ProductProvider');
                                      }
                                    }
                                  }}
                                  editable={allowUpdate}
                                >
                                  <div className={EntityTypeStyle}>
                                    <div className={EntityIconStyle('PRODUCT_PROVIDER')}>
                                      <Icon icon="PRODUCT_PROVIDER" />
                                    </div>
                                    <Label>
                                      <FormattedMessage
                                        id="modules.TaskTemplates.endProduct"
                                        defaultMessage="END PRODUCT"
                                      />
                                    </Label>
                                  </div>
                                </RadioInput>
                              </div>

                              <ConfirmDialog
                                isOpen={!!dialogIsOpen}
                                onRequestClose={() => setDialog(null)}
                                onCancel={() => setDialog(null)}
                                onConfirm={() => {
                                  setFieldValue(name, dialogIsOpen);
                                  setAllTasksManualDates();
                                  setDialog(null);
                                }}
                                message={
                                  <FormattedMessage
                                    id="modules.TaskTemplate.entityTypeDialogMessage"
                                    defaultMessage="Changing the Type will reset all Start Dates and Due Dates back to manual input. Are you sure you want to proceed?"
                                  />
                                }
                              />
                            </>
                          )}
                        </StringValue>
                      }
                    />
                  )}
                </FormField>
              </>
            );
          }}
        </Subscribe>
      </GridColumn>
    </div>
  );
};
export default TableTemplateSection;
