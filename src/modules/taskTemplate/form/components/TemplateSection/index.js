// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { TASK_TEMPLATE_CREATE, TASK_TEMPLATE_UPDATE } from 'modules/permission/constants/task';
import usePermission from 'hooks/usePermission';
import TemplateFormContainer from 'modules/taskTemplate/form/container';
import validator from 'modules/taskTemplate/form/validator';
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
import {
  TableTemplateSectionWrapperStyle,
  DescriptionLabelWrapperStyle,
  EntityTypeStyle,
  EntityTypesWrapperStyle,
  EntityIconStyle,
} from './style';

type Props = {
  isNew: boolean,
};

const TableTemplateSection = ({ isNew }: Props) => {
  const { hasPermission } = usePermission();
  const canCreateOrUpdate = hasPermission([TASK_TEMPLATE_CREATE, TASK_TEMPLATE_UPDATE]);
  return (
    <div className={TableTemplateSectionWrapperStyle}>
      <GridColumn>
        <Subscribe to={[TemplateFormContainer]}>
          {({ originalValues, state, setFieldValue }) => {
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
                      editable={canCreateOrUpdate}
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
                        <div className={DescriptionLabelWrapperStyle}>
                          <FormattedMessage
                            id="modules.TaskTemplates.description"
                            defaultMessage="DESCRIPTION"
                          />
                        </div>
                      }
                      editable={canCreateOrUpdate}
                      vertical={false}
                      inputWidth="200px"
                      inputHeight="100px"
                      inputAlign="right"
                    />
                  )}
                </FormField>
                <FormField
                  name="entityType"
                  initValue={values.entityType}
                  setFieldValue={setFieldValue}
                >
                  {({ name, isTouched, errorMessage, ...inputHandlers }) => (
                    <FieldItem
                      vertical
                      label={
                        <Label required>
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
                        <div className={EntityTypesWrapperStyle}>
                          <RadioInput
                            data-testid="orderRadio"
                            selected={inputHandlers.value === 'Order'}
                            onToggle={() => setFieldValue(name, 'Order')}
                            editable={canCreateOrUpdate}
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
                            selected={inputHandlers.value === 'Batch'}
                            onToggle={() => setFieldValue(name, 'Batch')}
                            editable={canCreateOrUpdate}
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
                            onToggle={() => setFieldValue(name, 'Shipment')}
                            editable={canCreateOrUpdate}
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
                        </div>
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
