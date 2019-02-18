// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { CONTAINER_CREATE, CONTAINER_UPDATE } from 'modules/permission/constants/container';
import usePermission from 'hooks/usePermission';
import {
  TextInputFactory,
  TextAreaInputFactory,
  AssignmentApprovalFactory,
} from 'modules/form/factories';
import SlideView from 'components/SlideView';
import { FieldItem, Label, DashedPlusButton, TagsInput } from 'components/Form';
import GridColumn from 'components/GridColumn';
import { WarehouseCard, GrayCard } from 'components/Cards';
import { FormField } from 'modules/form';
import SelectWareHouse from 'modules/warehouse/common/SelectWareHouse';
import ContainerFormContainer from 'modules/container/form/container';
import validator from 'modules/container/form/validator';
import { dateTimeInputFactory } from 'modules/form/helpers';
import ContainerSummary from './ContainerSummary';
import {
  ContainerSectionWrapperStyle,
  MainFieldsWrapperStyle,
  WarehouseSectionStyle,
  DividerStyle,
  SummaryStyle,
} from './style';

const ContainerSection = () => {
  const { hasPermission } = usePermission();
  const allowCreateOrUpdate = hasPermission(CONTAINER_CREATE) || hasPermission(CONTAINER_UPDATE);

  return (
    <div className={ContainerSectionWrapperStyle}>
      <Subscribe to={[ContainerFormContainer]}>
        {({ originalValues, state, setFieldValue, setDeepFieldValue }) => {
          const values = { ...originalValues, ...state };
          return (
            <>
              <div className={MainFieldsWrapperStyle}>
                <GridColumn>
                  <FormField
                    name="no"
                    initValue={values.no}
                    setFieldValue={setDeepFieldValue}
                    validator={validator}
                    values={values}
                  >
                    {({ name, ...inputHandlers }) => (
                      <TextInputFactory
                        name={name}
                        {...inputHandlers}
                        required
                        originalValue={originalValues[name]}
                        label={
                          <FormattedMessage
                            id="module.container.containerNo"
                            defaultMessage="CONTAINER NO"
                          />
                        }
                        editable={allowCreateOrUpdate}
                      />
                    )}
                  </FormField>

                  <GridColumn gap="40px">
                    <GridColumn>
                      <FormField
                        name="warehouseArrivalAgreedDate"
                        initValue={values.warehouseArrivalAgreedDate}
                        setFieldValue={setDeepFieldValue}
                        validator={validator}
                        values={values}
                      >
                        {({ name, ...inputHandlers }) =>
                          dateTimeInputFactory({
                            inputHandlers,
                            name,
                            isNew: false,
                            originalValue: originalValues[name],
                            label: (
                              <FormattedMessage
                                id="module.container.agreedArrival"
                                defaultMessage="AGREED ARRIVAL"
                              />
                            ),
                          })
                        }
                      </FormField>
                      <AssignmentApprovalFactory
                        assignmentsName="warehouseArrivalAgreedDateAssignedTo"
                        assignments={values.warehouseArrivalAgreedDateAssignedTo}
                        approvedAtName="warehouseArrivalAgreedDateApprovedAt"
                        approvedAt={values.warehouseArrivalAgreedDateApprovedAt}
                        approvedByName="warehouseArrivalAgreedDateApprovedBy"
                        approvedBy={values.warehouseArrivalAgreedDateApprovedBy}
                        setFieldValue={setFieldValue}
                        editable={allowCreateOrUpdate}
                      />
                    </GridColumn>

                    <GridColumn>
                      <FormField
                        name="warehouseArrivalActualDate"
                        initValue={values.warehouseArrivalActualDate}
                        setFieldValue={setDeepFieldValue}
                        validator={validator}
                        values={values.warehouseArrivalActualDate}
                      >
                        {({ name, ...inputHandlers }) =>
                          dateTimeInputFactory({
                            inputHandlers,
                            name,
                            isNew: false,
                            originalValue: originalValues[name],
                            label: (
                              <FormattedMessage
                                id="module.container.actualArrival"
                                defaultMessage="ACTUAL ARRIVAL"
                              />
                            ),
                          })
                        }
                      </FormField>

                      <AssignmentApprovalFactory
                        assignmentsName="warehouseArrivalActualDateAssignedTo"
                        assignments={values.warehouseArrivalActualDateAssignedTo}
                        approvedAtName="warehouseArrivalActualDateApprovedAt"
                        approvedAt={values.warehouseArrivalActualDateApprovedAt}
                        approvedByName="warehouseArrivalActualDateApprovedBy"
                        approvedBy={values.warehouseArrivalActualDateApprovedBy}
                        setFieldValue={setFieldValue}
                        editable={allowCreateOrUpdate}
                      />
                    </GridColumn>
                  </GridColumn>
                </GridColumn>

                <div className={WarehouseSectionStyle}>
                  <Label>
                    <FormattedMessage id="modules.container.warehouse" defaultMessage="WAREHOUSE" />
                  </Label>
                  {allowCreateOrUpdate ? (
                    <BooleanValue>
                      {({ value: opened, set: slideToggle }) => (
                        <>
                          {values.warehouse ? (
                            <WarehouseCard
                              warehouse={values.warehouse}
                              selectable
                              readOnly
                              onSelect={() => slideToggle(true)}
                            />
                          ) : (
                            <DashedPlusButton
                              data-testid="selectWarehouseButton"
                              width="195px"
                              height="215px"
                              onClick={() => slideToggle(true)}
                            />
                          )}

                          <SlideView
                            isOpen={opened}
                            onRequestClose={() => slideToggle(false)}
                            options={{ width: '1030px' }}
                          >
                            {opened && (
                              <SelectWareHouse
                                selected={values.warehouse}
                                onCancel={() => slideToggle(false)}
                                onSelect={newValue => {
                                  slideToggle(false);
                                  setFieldValue('warehouse', newValue);
                                }}
                              />
                            )}
                          </SlideView>
                        </>
                      )}
                    </BooleanValue>
                  ) : (
                    <>
                      {values.warehouse ? (
                        <WarehouseCard warehouse={values.warehouse} selectable readOnly />
                      ) : (
                        <GrayCard width="195px" height="215px" />
                      )}
                    </>
                  )}
                </div>
              </div>

              <FieldItem
                vertical
                label={
                  <Label>
                    <FormattedMessage id="modules.container.tags" defaultMessage="TAGS" />
                  </Label>
                }
                input={
                  <TagsInput
                    id="tags"
                    name="tags"
                    tagType="Container"
                    values={values.tags}
                    onChange={(field, value) => {
                      setFieldValue(field, value);
                    }}
                    editable={allowCreateOrUpdate}
                  />
                }
              />

              <FormField
                name="memo"
                initValue={values.memo}
                values={values}
                validator={validator}
                setFieldValue={setFieldValue}
              >
                {({ name, ...inputHandlers }) => (
                  <TextAreaInputFactory
                    name={name}
                    {...inputHandlers}
                    originalValue={originalValues[name]}
                    label={<FormattedMessage id="modules.container.memo" defaultMessage="MEMO" />}
                    vertical
                    inputWidth="680px"
                    inputHeight="65px"
                    editable={allowCreateOrUpdate}
                  />
                )}
              </FormField>

              <div className={DividerStyle} />

              <div className={SummaryStyle}>
                <ContainerSummary />
              </div>
            </>
          );
        }}
      </Subscribe>
    </div>
  );
};

export default ContainerSection;
