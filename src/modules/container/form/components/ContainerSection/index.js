// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { differenceInCalendarDays } from 'date-fns';
import { isNullOrUndefined, getByPathWithDefault, getByPath } from 'utils/fp';
import { startOfToday } from 'utils/date';
import FormattedDate from 'components/FormattedDate';
import { WAREHOUSE_LIST } from 'modules/permission/constants/warehouse';
import {
  CONTAINER_UPDATE,
  CONTAINER_SET_WAREHOUSE,
  CONTAINER_SET_TAGS,
  CONTAINER_SET_MEMO,
  CONTAINER_ASSIGN_AGREE_ARRIVAL_DATE,
  CONTAINER_APPROVE_ACTUAL_ARRIVAL_DATE,
  CONTAINER_ASSIGN_ACTUAL_ARRIVAL_DATE,
  CONTAINER_APPROVE_AGREE_ARRIVAL_DATE,
  CONTAINER_SET_ACTUAL_ARRIVAL_DATE,
  CONTAINER_SET_AGREE_ARRIVAL_DATE,
  CONTAINER_SET_NO,
  CONTAINER_SET_CONTAINER_TYPE,
  CONTAINER_SET_CONTAINER_OPTION,
  CONTAINER_SET_FREE_TIME_START_DATE,
  CONTAINER_SET_FREE_TIME_DURATION,
  CONTAINER_SET_YARD_NAME,
  CONTAINER_SET_DEPARTURE_DATE,
  CONTAINER_ASSIGN_DEPARTURE_DATE,
  CONTAINER_APPROVE_DEPARTURE_DATE,
} from 'modules/permission/constants/container';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import {
  FieldItem,
  Label,
  DashedPlusButton,
  TagsInput,
  TextInputFactory,
  TextAreaInputFactory,
  AssignmentApprovalFactory,
  DateTimeInputFactory,
  DateInputFactory,
  DayInputFactory,
  SelectInputFactory,
  EnumSelectInputFactory,
  Display,
} from 'components/Form';
import GridColumn from 'components/GridColumn';
import { WarehouseCard, GrayCard } from 'components/Cards';
import { FormField } from 'modules/form';
import SelectWareHouse from 'modules/warehouse/common/SelectWareHouse';
import { ContainerInfoContainer } from 'modules/container/form/containers';
import validator from 'modules/container/form/validator';
import { TAG_LIST } from 'modules/permission/constants/tag';
import { getLatestDate } from 'utils/shipment';
import { calculateDueDate } from 'modules/container/utils';
import { CONTAINER_TYPE_ITEMS } from 'modules/container/constants';
import ContainerSummary from './ContainerSummary';
import {
  ContainerSectionWrapperStyle,
  MainFieldsWrapperStyle,
  WarehouseSectionStyle,
  DividerStyle,
  SummaryStyle,
} from './style';

const renderFreeTime = (date: ?Date, approved: boolean) => {
  if (date) {
    const freeTime = differenceInCalendarDays(date, startOfToday());
    let freeTimeColor;
    if (approved) {
      freeTimeColor = 'GRAY_LIGHT';
    } else if (freeTime > 7) {
      freeTimeColor = 'TEAL';
    } else if (freeTime > 0) {
      freeTimeColor = 'YELLOW';
    } else {
      freeTimeColor = 'RED';
    }

    return (
      <Display color={freeTimeColor}>
        {freeTime >= 0 ? (
          <FormattedMessage
            id="modules.container.freeTimeMessage"
            defaultMessage="{freeTime} days left until due date*"
            values={{
              freeTime,
            }}
          />
        ) : (
          <FormattedMessage
            id="modules.container.overTimeMessage"
            defaultMessage="{freeTime} days over the due date*"
            values={{
              freeTime: Math.abs(freeTime),
            }}
          />
        )}
      </Display>
    );
  }
  return (
    <Display>
      <FormattedMessage id="modules.container.na" defaultMessage="N/A" />
    </Display>
  );
};

const ContainerSection = () => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const allowUpdate = hasPermission(CONTAINER_UPDATE);

  const allowSetWarehouse =
    hasPermission([CONTAINER_UPDATE, CONTAINER_SET_WAREHOUSE]) && hasPermission(WAREHOUSE_LIST);

  return (
    <div className={ContainerSectionWrapperStyle}>
      <Subscribe to={[ContainerInfoContainer]}>
        {({ originalValues, state, setFieldValue, setDeepFieldValue }) => {
          const values = { ...originalValues, ...state };

          const dueDate =
            isNullOrUndefined(values.freeTimeStartDate) ||
            values.freeTimeStartDate === '' ||
            isNullOrUndefined(values.freeTimeDuration)
              ? null
              : calculateDueDate(values.freeTimeStartDate, values.freeTimeDuration);

          const freeTime = renderFreeTime(
            dueDate,
            !isNullOrUndefined(values.departureDateApprovedAt)
          );

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
                        editable={allowUpdate || hasPermission(CONTAINER_SET_NO)}
                      />
                    )}
                  </FormField>

                  <FormField
                    name="containerType"
                    initValue={values.containerType}
                    setFieldValue={setDeepFieldValue}
                    validator={validator}
                    values={values}
                    saveOnChange
                  >
                    {({ name, ...inputHandlers }) => (
                      <SelectInputFactory
                        name={name}
                        {...inputHandlers}
                        originalValue={originalValues[name]}
                        items={CONTAINER_TYPE_ITEMS}
                        label={
                          <FormattedMessage
                            id="module.container.containerType"
                            defaultMessage="CONTAINER TYPE"
                          />
                        }
                        editable={allowUpdate || hasPermission(CONTAINER_SET_CONTAINER_TYPE)}
                      />
                    )}
                  </FormField>

                  <FormField
                    name="containerOption"
                    initValue={values.containerOption}
                    setFieldValue={setDeepFieldValue}
                    validator={validator}
                    values={values}
                    saveOnChange
                  >
                    {({ name, ...inputHandlers }) => (
                      <EnumSelectInputFactory
                        name={name}
                        {...inputHandlers}
                        originalValue={originalValues[name]}
                        enumType="ContainerOption"
                        label={
                          <FormattedMessage
                            id="module.container.containerOption"
                            defaultMessage="CONTAINER OPTION"
                          />
                        }
                        editable={allowUpdate || hasPermission(CONTAINER_SET_CONTAINER_OPTION)}
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
                        {({ name, ...inputHandlers }) => (
                          <DateTimeInputFactory
                            {...inputHandlers}
                            name={name}
                            originalValue={originalValues[name]}
                            label={
                              <FormattedMessage
                                id="module.container.agreedArrival"
                                defaultMessage="AGREED ARRIVAL"
                              />
                            }
                            editable={
                              allowUpdate || hasPermission(CONTAINER_SET_AGREE_ARRIVAL_DATE)
                            }
                          />
                        )}
                      </FormField>
                      <AssignmentApprovalFactory
                        groupIds={[
                          getByPath('importer.id', values),
                          getByPath('exporter.id', values),
                        ].filter(Boolean)}
                        assignmentsName="warehouseArrivalAgreedDateAssignedTo"
                        assignments={values.warehouseArrivalAgreedDateAssignedTo}
                        approvedAtName="warehouseArrivalAgreedDateApprovedAt"
                        approvedAt={values.warehouseArrivalAgreedDateApprovedAt}
                        approvedByName="warehouseArrivalAgreedDateApprovedBy"
                        approvedBy={values.warehouseArrivalAgreedDateApprovedBy}
                        setFieldValue={setFieldValue}
                        assignable={hasPermission([
                          CONTAINER_UPDATE,
                          CONTAINER_ASSIGN_AGREE_ARRIVAL_DATE,
                        ])}
                        approvable={hasPermission([
                          CONTAINER_UPDATE,
                          CONTAINER_APPROVE_AGREE_ARRIVAL_DATE,
                        ])}
                      />
                    </GridColumn>

                    <GridColumn>
                      <FormField
                        name="warehouseArrivalActualDate"
                        initValue={values.warehouseArrivalActualDate}
                        setFieldValue={setDeepFieldValue}
                        validator={validator}
                        values={values}
                      >
                        {({ name, ...inputHandlers }) => (
                          <DateTimeInputFactory
                            {...inputHandlers}
                            name={name}
                            originalValue={originalValues[name]}
                            label={
                              <FormattedMessage
                                id="module.container.actualArrival"
                                defaultMessage="ACTUAL ARRIVAL"
                              />
                            }
                            editable={
                              allowUpdate || hasPermission(CONTAINER_SET_ACTUAL_ARRIVAL_DATE)
                            }
                          />
                        )}
                      </FormField>

                      <AssignmentApprovalFactory
                        groupIds={[
                          getByPath('importer.id', values),
                          getByPath('exporter.id', values),
                        ].filter(Boolean)}
                        assignmentsName="warehouseArrivalActualDateAssignedTo"
                        assignments={values.warehouseArrivalActualDateAssignedTo}
                        approvedAtName="warehouseArrivalActualDateApprovedAt"
                        approvedAt={values.warehouseArrivalActualDateApprovedAt}
                        approvedByName="warehouseArrivalActualDateApprovedBy"
                        approvedBy={values.warehouseArrivalActualDateApprovedBy}
                        setFieldValue={setFieldValue}
                        assignable={hasPermission([
                          CONTAINER_UPDATE,
                          CONTAINER_ASSIGN_ACTUAL_ARRIVAL_DATE,
                        ])}
                        approvable={hasPermission([
                          CONTAINER_UPDATE,
                          CONTAINER_APPROVE_ACTUAL_ARRIVAL_DATE,
                        ])}
                      />
                    </GridColumn>
                  </GridColumn>

                  <GridColumn>
                    <FieldItem
                      label={
                        <Label>
                          <Icon icon="STOPWATCH" />{' '}
                          <FormattedMessage
                            id="modules.container.freeTime"
                            defaultMessage="FREE TIME"
                          />
                        </Label>
                      }
                      input={freeTime}
                    />

                    <FormField
                      name="freeTimeStartDate"
                      initValue={values.freeTimeStartDate}
                      setFieldValue={setFieldValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <DateInputFactory
                          name={name}
                          {...inputHandlers}
                          originalValue={originalValues[name]}
                          label={
                            <FormattedMessage
                              id="modules.container.startDate"
                              defaultMessage="START DATE"
                            />
                          }
                          showExtraToggle
                          toggled={values.autoCalculatedFreeTimeStartDate}
                          onToggle={() => {
                            const { autoCalculatedFreeTimeStartDate } = values;
                            if (!autoCalculatedFreeTimeStartDate) {
                              const voyages = getByPathWithDefault([], 'shipment.voyages', values);
                              const freeTimeStartDate = getLatestDate(
                                voyages[voyages.length - 1].arrival
                              );
                              setFieldValue('freeTimeStartDate', freeTimeStartDate);
                            }
                            setFieldValue(
                              'autoCalculatedFreeTimeStartDate',
                              !autoCalculatedFreeTimeStartDate
                            );
                          }}
                          toggleMessages={{
                            editable: {
                              on: (
                                <FormattedMessage
                                  id="modules.Containers.startDateTooltipEditableOn"
                                  defaultMessage="Automatically sync with Shipment's Discharge Port Arrival. Manual input is still available, but will be overridden when Shipment's Discharge Port Arrival changes."
                                />
                              ),
                              off: (
                                <FormattedMessage
                                  id="modules.Containers.startDateTooltipEditableOff"
                                  defaultMessage="Manual input only."
                                />
                              ),
                            },
                            readonly: {
                              on: (
                                <FormattedMessage
                                  id="modules.Containers.startDateTooltipReadonlyOn"
                                  defaultMessage="This field is being automatically synced with Shipment's Discharge Port Arrival."
                                />
                              ),
                              off: (
                                <FormattedMessage
                                  id="modules.Containers.startDateTooltipReadonlyOff"
                                  defaultMessage="This field is not being automatically synced with Shipment's Discharge Port Arrival."
                                />
                              ),
                            },
                          }}
                          editable={
                            allowUpdate || hasPermission(CONTAINER_SET_FREE_TIME_START_DATE)
                          }
                        />
                      )}
                    </FormField>

                    <FormField
                      name="freeTimeDuration"
                      initValue={values.freeTimeDuration}
                      setFieldValue={setFieldValue}
                      values={values}
                    >
                      {({ name, ...inputHandlers }) => (
                        <DayInputFactory
                          name={name}
                          {...inputHandlers}
                          originalValue={originalValues[name]}
                          label={
                            <FormattedMessage
                              id="modules.container.duration"
                              defaultMessage="DURATION"
                            />
                          }
                          editable={allowUpdate || hasPermission(CONTAINER_SET_FREE_TIME_DURATION)}
                        />
                      )}
                    </FormField>

                    <FieldItem
                      label={
                        <Label>
                          <FormattedMessage id="dueDate" defaultMessage="DUE DATE" />
                        </Label>
                      }
                      input={
                        <Display>
                          {dueDate ? (
                            <FormattedDate value={dueDate} />
                          ) : (
                            <FormattedMessage id="modules.container.na" defaultMessage="N/A" />
                          )}
                        </Display>
                      }
                    />

                    <FormField
                      name="yardName"
                      initValue={values.yardName}
                      setFieldValue={setDeepFieldValue}
                      validator={validator}
                      values={values}
                    >
                      {({ name, ...inputHandlers }) => (
                        <TextInputFactory
                          name={name}
                          {...inputHandlers}
                          originalValue={originalValues[name]}
                          label={
                            <FormattedMessage
                              id="module.container.yardName"
                              defaultMessage="YARD NAME"
                            />
                          }
                          editable={allowUpdate || hasPermission(CONTAINER_SET_YARD_NAME)}
                        />
                      )}
                    </FormField>

                    <FormField
                      name="departureDate"
                      initValue={values.departureDate}
                      setFieldValue={setFieldValue}
                      values={values}
                      validator={validator}
                    >
                      {({ name, ...inputHandlers }) => (
                        <DateInputFactory
                          name={name}
                          {...inputHandlers}
                          originalValue={originalValues[name]}
                          label={
                            <FormattedMessage
                              id="modules.container.yardDeparture"
                              defaultMessage="YARD DEPARTURE"
                            />
                          }
                          editable={allowUpdate || hasPermission(CONTAINER_SET_DEPARTURE_DATE)}
                        />
                      )}
                    </FormField>

                    <AssignmentApprovalFactory
                      groupIds={[
                        getByPath('importer.id', values),
                        getByPath('exporter.id', values),
                      ].filter(Boolean)}
                      assignmentsName="departureDateAssignedTo"
                      assignments={values.departureDateAssignedTo}
                      approvedAtName="departureDateApprovedAt"
                      approvedAt={values.departureDateApprovedAt}
                      approvedByName="departureDateApprovedBy"
                      approvedBy={values.departureDateApprovedBy}
                      setFieldValue={setFieldValue}
                      assignable={allowUpdate || hasPermission(CONTAINER_ASSIGN_DEPARTURE_DATE)}
                      approvable={allowUpdate || hasPermission(CONTAINER_APPROVE_DEPARTURE_DATE)}
                    />
                  </GridColumn>
                </GridColumn>

                <div className={WarehouseSectionStyle}>
                  <Label>
                    <FormattedMessage id="modules.container.warehouse" defaultMessage="WAREHOUSE" />
                  </Label>
                  {allowSetWarehouse ? (
                    <BooleanValue>
                      {({ value: opened, set: slideToggle }) => (
                        <>
                          {values.warehouse ? (
                            <WarehouseCard
                              warehouse={values.warehouse}
                              onClick={() => slideToggle(true)}
                            />
                          ) : (
                            <DashedPlusButton
                              data-testid="selectWarehouseButton"
                              width="195px"
                              height="215px"
                              onClick={() => slideToggle(true)}
                            />
                          )}

                          <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
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
                        <WarehouseCard warehouse={values.warehouse} readOnly />
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
                  <Label height="30px">
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
                    editable={{
                      set:
                        hasPermission(TAG_LIST) &&
                        hasPermission([CONTAINER_UPDATE, CONTAINER_SET_TAGS]),
                      remove: hasPermission([CONTAINER_UPDATE, CONTAINER_SET_TAGS]),
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
                {({ name, ...inputHandlers }) => (
                  <TextAreaInputFactory
                    name={name}
                    {...inputHandlers}
                    originalValue={originalValues[name]}
                    label={<FormattedMessage id="modules.container.memo" defaultMessage="MEMO" />}
                    vertical
                    inputWidth="680px"
                    inputHeight="65px"
                    editable={allowUpdate || hasPermission(CONTAINER_SET_MEMO)}
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
