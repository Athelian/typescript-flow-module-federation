// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';

import { FieldItem, Label, DashedPlusButton, TagsInput } from 'components/Form';
import GridColumn from 'components/GridColumn';
import { WarehouseCard } from 'components/Cards';

import { FormField } from 'modules/form';
import SelectWareHouse from 'modules/warehouse/common/SelectWareHouse';

import ContainerFormContainer from 'modules/container/form/container';
import validator from 'modules/container/form/validator';
import { textInputFactory, dateTimeInputFactory, textAreaFactory } from 'modules/form/helpers';

import { AssignedTo, Approval, ContainerTotalSummary } from 'modules/container/form/components';

import {
  SectionWrapperStyle,
  MainFieldsWrapperStyle,
  ItemSectionStyle,
  DividerStyle,
  AssignedAndApprovalWrapperStyle,
  SummaryStyle,
} from './style';

const ContainerSection = () => (
  <div className={SectionWrapperStyle}>
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
                  {({ name, ...inputHandlers }) =>
                    textInputFactory({
                      inputHandlers,
                      name,
                      isNew: false,
                      required: true,
                      originalValue: originalValues[name],
                      label: (
                        <FormattedMessage
                          id="module.container.containerNo"
                          defaultMessage="CONTAINER NO"
                        />
                      ),
                    })
                  }
                </FormField>

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

                <div className={AssignedAndApprovalWrapperStyle}>
                  <GridColumn gap="5px">
                    <Label>
                      <FormattedMessage
                        id="modules.container.assignedTo"
                        defaultMessage="ASSIGNED TO"
                      />
                    </Label>
                    <AssignedTo
                      assignedTo={values.warehouseArrivalAgreedDateAssignedTo}
                      setFieldValue={setFieldValue}
                      field="warehouseArrivalAgreedDateAssignedTo"
                    />
                  </GridColumn>

                  <GridColumn gap="5px">
                    <Label align="right">
                      <FormattedMessage id="modules.container.approval" defaultMessage="APPROVAL" />
                    </Label>
                    <Approval
                      approvedBy={values.warehouseArrivalAgreedDateApprovedBy}
                      approvedAt={values.warehouseArrivalAgreedDateApprovedBy}
                      setFieldValue={setFieldValue}
                      field="warehouseArrivalAgreedDateApprovedBy"
                    />
                  </GridColumn>
                </div>

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

                <div className={AssignedAndApprovalWrapperStyle}>
                  <GridColumn gap="5px">
                    <Label>
                      <FormattedMessage
                        id="modules.container.assignedTo"
                        defaultMessage="ASSIGNED TO"
                      />
                    </Label>
                    <AssignedTo
                      assignedTo={values.warehouseArrivalActualDateAssignedTo}
                      setFieldValue={setFieldValue}
                      field="warehouseArrivalActualDateAssignedTo"
                    />
                  </GridColumn>

                  <GridColumn gap="5px">
                    <Label align="right">
                      <FormattedMessage id="modules.container.approval" defaultMessage="APPROVAL" />
                    </Label>
                    <Approval
                      approvedBy={values.warehouseArrivalActualDateApprovedBy}
                      approvedAt={values.warehouseArrivalActualDateApprovedAt}
                      setFieldValue={setFieldValue}
                      field="warehouseArrivalActualDateApprovedBy"
                    />
                  </GridColumn>
                </div>
              </GridColumn>

              <div className={ItemSectionStyle}>
                <Label>
                  <FormattedMessage id="modules.container.warehouse" defaultMessage="WAREHOUSE" />
                </Label>
                <BooleanValue>
                  {({ value: opened, set: slideToggle }) => (
                    <>
                      {!values.warehouse ? (
                        <DashedPlusButton
                          data-testid="selectWarehouseButton"
                          width="195px"
                          height="217px"
                          onClick={() => slideToggle(true)}
                        />
                      ) : (
                        <WarehouseCard
                          selectable
                          warehouse={values.warehouse}
                          onSelect={() => slideToggle(true)}
                          readOnly
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
              {({ name, ...inputHandlers }) =>
                textAreaFactory({
                  name,
                  inputHandlers,
                  isNew: false,
                  originalValue: originalValues[name],
                  label: <FormattedMessage id="modules.container.memo" defaultMessage="memo" />,
                  vertical: true,
                  width: '680px',
                  height: '65px',
                })
              }
            </FormField>

            <div className={DividerStyle} />

            <div className={SummaryStyle}>
              <ContainerTotalSummary />
            </div>
          </>
        );
      }}
    </Subscribe>
  </div>
);

export default ContainerSection;
