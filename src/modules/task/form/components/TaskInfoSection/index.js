// @flow
import React from 'react';
import { type IntlShape, injectIntl, FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Subscribe } from 'unstated';
import { isBefore } from 'date-fns';
import { ObjectValue } from 'react-values';
import { ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { PRODUCT_FORM } from 'modules/permission/constants/product';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import { encodeId } from 'utils/id';
import emitter from 'utils/emitter';
import { spreadOrderItem } from 'utils/item';
import { formatToGraphql, startOfToday } from 'utils/date';
import {
  ShipmentCard,
  OrderCard,
  ItemCard,
  BatchCard,
  ProductCard,
  OrderProductProviderCard,
} from 'components/Cards';
import {
  SectionWrapper,
  SectionHeader,
  LastModified,
  TextInputFactory,
  DateInputFactory,
  TextAreaInputFactory,
  FieldItem,
  Label,
  TagsInput,
  TaskAssignmentInput,
  Display,
  TaskStatusInput,
  ToggleInput,
  ApproveRejectMenu,
  TaskApprovalStatusInput,
  RadioInput,
  MetricInputFactory,
  SelectInputFactory,
} from 'components/Form';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import GridColumn from 'components/GridColumn';
import FormattedNumber from 'components/FormattedNumber';
import { COMPLETED, IN_PROGRESS } from 'components/Form/TaskStatusInput/constants';
import { FormField, FormContainer } from 'modules/form';
import TaskContainer from 'modules/task/form/container';
import validator from 'modules/task/form/validator';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { TASK_UPDATE } from 'modules/permission/constants/task';
import { TAG_LIST } from 'modules/permission/constants/tag';
import {
  orderBinding,
  orderItemBinding,
  batchBinding,
  shipmentBinding,
  START_DATE,
} from './constants';
import {
  convertBindingToSelection,
  getFieldsByEntity,
  calculateDate,
  findDuration,
} from './helpers';
import {
  TaskFormWrapperStyle,
  TaskSectionWrapperStyle,
  MainFieldsWrapperStyle,
  MemoWrapperStyle,
  TaskStatusWrapperStyle,
  AssignedToStyle,
  ApprovalToggleWrapperStyle,
  AutoDateBackgroundStyle,
  RadioWrapperStyle,
  AutoDateWrapperStyle,
  AutoDateOffsetWrapperStyle,
  AutoDateSyncIconStyle,
} from './style';

type OptionalProps = {
  isInTemplate: boolean,
  hideParentInfo: boolean,
  parentEntity?: string,
};

type Props = OptionalProps & {
  task: Object,
  intl: IntlShape,
};

const defaultProps = {
  isInTemplate: false,
  hideParentInfo: false,
};

const getStatusState = ({
  inProgressBy,
  completedBy,
}: {
  inProgressAt: string,
  completedAt: string,
  inProgressBy: Object,
  completedBy: Object,
}) => {
  if (completedBy)
    return {
      status: COMPLETED,
      activeUser: completedBy,
    };
  if (inProgressBy)
    return {
      status: IN_PROGRESS,
      activeUser: inProgressBy,
    };
  return {
    status: '',
    activeUser: null,
  };
};

const TaskInfoSection = ({ intl, task, isInTemplate, hideParentInfo, parentEntity }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const editable = hasPermission(TASK_UPDATE);
  const initDuration = {};
  if (task && task.startDateBinding) {
    const { months = 0, weeks = 0, days = 0 } = task.startDateInterval || {};
    initDuration[task.startDateBinding] = calculateDate({
      duration: findDuration({ months, weeks }),
      date: task.startDate,
      offset: -(months || weeks || days),
    });
  }

  if (task && task.dueDateBinding) {
    const { months = 0, weeks = 0, days = 0 } = task.dueDateInterval || {};
    initDuration[task.dueDateBinding] = calculateDate({
      duration: findDuration({ months, weeks }),
      date: task.dueDate,
      offset: -(months || weeks || days),
    });
  }

  const parentValues = React.useRef(initDuration);

  const onChangeBinding = React.useCallback(
    ({
      isManual,
      field,
      type,
      onChange,
    }: {
      isManual: boolean,
      type: string,
      field: 'startDate' | 'dueDate',
      onChange: Object => void,
    }) => {
      if (!isManual) {
        switch (type) {
          case 'Shipment': {
            onChange({
              [`${field}Binding`]:
                field === 'dueDate' ? START_DATE : shipmentBinding(intl).blDate.field,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit('FIND_SHIPMENT_VALUE', {
              field: field === 'dueDate' ? START_DATE : shipmentBinding(intl).blDate.field,
              entityId: getByPath('entity.id', task),
              selectedField: field,
            });
            break;
          }
          case 'Batch': {
            onChange({
              [`${field}Binding`]:
                field === 'dueDate' ? START_DATE : batchBinding(intl).deliveredAt.field,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit('FIND_BATCH_VALUE', {
              field: field === 'dueDate' ? START_DATE : batchBinding(intl).deliveredAt.field,
              entityId: getByPath('entity.id', task),
              selectedField: field,
            });
            break;
          }
          case 'Order': {
            onChange({
              [`${field}Binding`]:
                field === 'dueDate' ? START_DATE : orderBinding(intl).issuedAt.field,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit(`FIND_${type.toUpperCase()}_VALUE`, {
              field: field === 'dueDate' ? START_DATE : orderBinding(intl).issuedAt.field,
              entityId: getByPath('entity.id', task),
              selectedField: field,
            });
            break;
          }
          case 'OrderItem': {
            onChange({
              [`${field}Binding`]:
                field === 'dueDate' ? START_DATE : orderItemBinding(intl).issuedAt.field,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit(`FIND_${type.toUpperCase()}_VALUE`, {
              field: field === 'dueDate' ? START_DATE : orderItemBinding(intl).issuedAt.field,
              entityId: getByPath('entity.id', task),
              selectedField: field,
            });
            break;
          }
          default: {
            onChange({
              [`${field}Binding`]: START_DATE,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit(`FIND_${type.toUpperCase()}_VALUE`, {
              START_DATE,
              entityId: getByPath('entity.id', task),
              selectedField: field,
            });
            break;
          }
        }
      } else {
        onChange({
          [`${field}Binding`]: null,
          [`${field}Interval`]: null,
        });
      }
    },
    [intl, task]
  );

  React.useEffect(() => {
    emitter.addListener('LIVE_VALUE', (field: string, value: ?Date) => {
      if (value && parentValues.current) {
        parentValues.current[field] = value;
      }
    });

    return () => {
      emitter.removeAllListeners('LIVE_VALUE');
    };
  });

  return (
    <div className={TaskFormWrapperStyle}>
      <SectionWrapper id="task_taskSection">
        <SectionHeader
          icon="TASK"
          title={<FormattedMessage id="modules.Tasks.task" defaultMessage="TASK" />}
        >
          {task.updatedAt && <LastModified updatedAt={task.updatedAt} updatedBy={task.updatedBy} />}
        </SectionHeader>
        <Subscribe to={[TaskContainer, FormContainer]}>
          {({ originalValues, state, setFieldValue, setFieldValues }, { setFieldTouched }) => {
            const values = { ...originalValues, ...state };
            const { status, activeUser } = getStatusState(values);
            const isUnapproved = !(
              (values.approvedBy && values.approvedBy.id) ||
              (values.rejectedBy && values.rejectedBy.id)
            );
            const manualSettings = {
              startDate: !values.startDateBinding,
              dueDate: !values.dueDateBinding,
            };

            const entity = getByPathWithDefault(parentEntity, 'entity.__typename', task);
            const startDateSyncUnavailable = ['Product', 'ProductProvider'].includes(entity);

            return (
              <div className={TaskSectionWrapperStyle}>
                {!hideParentInfo &&
                  getByPathWithDefault('', 'entity.__typename', task) === 'Shipment' && (
                    <FieldItem
                      label={
                        <Label>
                          <FormattedMessage id="modules.Tasks.shipment" defaultMessage="SHIPMENT" />
                        </Label>
                      }
                      vertical
                      input={<ShipmentCard shipment={task.entity} />}
                    />
                  )}

                <div className={MainFieldsWrapperStyle}>
                  <GridColumn>
                    <FieldItem
                      label={
                        <Label height="30px">
                          <FormattedMessage id="modules.Tasks.taskNo" defaultMessage="TASK No." />
                        </Label>
                      }
                      input={
                        <Display height="30px">
                          <FormattedNumber value={task.sort + 1} />
                        </Display>
                      }
                    />

                    <FormField
                      name="name"
                      initValue={values.name}
                      values={values}
                      validator={validator}
                      setFieldValue={setFieldValue}
                    >
                      {({ name, ...inputHandlers }) => (
                        <TextInputFactory
                          name={name}
                          label={<FormattedMessage id="modules.Tasks.name" defaultMessage="NAME" />}
                          required
                          {...inputHandlers}
                          originalValue={originalValues[name]}
                          editable={editable}
                        />
                      )}
                    </FormField>

                    <FieldItem
                      label={
                        <Label height="30px">
                          <FormattedMessage
                            id="modules.Tasks.startDate"
                            defaultMessage="START DATE"
                          />
                        </Label>
                      }
                      input={
                        <GridColumn gap="10px">
                          <div
                            className={AutoDateBackgroundStyle(
                              manualSettings.startDate ? 'top' : 'bottom'
                            )}
                          />

                          <div className={RadioWrapperStyle('top')}>
                            <RadioInput
                              align="right"
                              selected={manualSettings.startDate}
                              onToggle={() =>
                                !manualSettings.startDate
                                  ? onChangeBinding({
                                      type: entity,
                                      field: 'startDate',
                                      isManual: true,
                                      onChange: setFieldValues,
                                    })
                                  : () => {}
                              }
                              editable={editable}
                            />
                          </div>

                          {!startDateSyncUnavailable && (
                            <div className={RadioWrapperStyle('bottom')}>
                              <RadioInput
                                align="right"
                                selected={!manualSettings.startDate}
                                onToggle={() =>
                                  manualSettings.startDate
                                    ? onChangeBinding({
                                        type: entity,
                                        field: 'startDate',
                                        isManual: false,
                                        onChange: setFieldValues,
                                      })
                                    : () => {}
                                }
                                editable={editable}
                              />
                            </div>
                          )}

                          {isInTemplate ? (
                            <Display
                              color={manualSettings.startDate ? 'GRAY' : 'GRAY_LIGHT'}
                              height="30px"
                            >
                              <FormattedMessage
                                id="modules.Tasks.datePlaceholder"
                                defaultMessage="yyyy/mm/dd"
                              />
                            </Display>
                          ) : (
                            <FormField
                              name="startDate"
                              initValue={values.startDate}
                              values={values}
                              validator={validator}
                              setFieldValue={(field, value) => {
                                setFieldValue(field, value);
                                if (values.dueDateBinding === START_DATE) {
                                  const { weeks, months, days } = values.dueDateInterval || {};
                                  setFieldValue(
                                    'dueDate',
                                    calculateDate({
                                      date: value,
                                      duration: findDuration({ weeks, months }),
                                      offset: weeks || months || days,
                                    })
                                  );
                                }
                              }}
                            >
                              {({ name, ...inputHandlers }) => (
                                <DateInputFactory
                                  name={name}
                                  {...inputHandlers}
                                  originalValue={originalValues[name]}
                                  editable={editable && manualSettings.startDate}
                                  hideTooltip={!manualSettings.startDate}
                                />
                              )}
                            </FormField>
                          )}

                          {!manualSettings.startDate ? (
                            <ObjectValue
                              value={{
                                autoDateField: values.startDateBinding,
                                ...convertBindingToSelection(values.startDateInterval),
                              }}
                              onChange={({ autoDateOffset, autoDateDuration }) => {
                                const newDate = calculateDate({
                                  date:
                                    parentValues.current &&
                                    parentValues.current[values.startDateBinding],
                                  duration: autoDateDuration.metric,
                                  offset:
                                    autoDateOffset === 'after'
                                      ? Math.abs(autoDateDuration.value)
                                      : -Math.abs(autoDateDuration.value),
                                });
                                setFieldValue('startDate', newDate);
                                if (values.dueDateBinding === START_DATE) {
                                  const { weeks, months, days } = values.dueDateInterval || {};
                                  setFieldValue(
                                    'dueDate',
                                    calculateDate({
                                      date: newDate,
                                      duration: findDuration({ weeks, months }),
                                      offset: weeks || months || days,
                                    })
                                  );
                                }
                                setFieldValue('startDateInterval', {
                                  [autoDateDuration.metric]:
                                    autoDateOffset === 'after'
                                      ? Math.abs(autoDateDuration.value)
                                      : -Math.abs(autoDateDuration.value),
                                });
                              }}
                            >
                              {({
                                value: { autoDateDuration, autoDateOffset, autoDateField },
                                set,
                              }) => (
                                <div className={AutoDateWrapperStyle}>
                                  <div className={AutoDateSyncIconStyle}>
                                    <Icon icon="SYNC" />
                                  </div>

                                  <div className={AutoDateOffsetWrapperStyle}>
                                    <FormField
                                      name="autoStateDateDuration"
                                      initValue={{
                                        ...autoDateDuration,
                                        value: Math.abs(autoDateDuration.value),
                                      }}
                                      setFieldValue={(field, value) =>
                                        set('autoDateDuration', value)
                                      }
                                    >
                                      {({ name, ...inputHandlers }) => (
                                        <MetricInputFactory
                                          name={name}
                                          metricType="duration"
                                          metricSelectWidth="60px"
                                          metricOptionWidth="65px"
                                          inputWidth="135px"
                                          {...inputHandlers}
                                          editable={editable}
                                          hideTooltip
                                        />
                                      )}
                                    </FormField>

                                    <FormField
                                      name="autoDateOffset"
                                      initValue={autoDateOffset}
                                      setFieldValue={set}
                                      saveOnChange
                                    >
                                      {({ ...inputHandlers }) => (
                                        <SelectInputFactory
                                          items={[
                                            {
                                              label: 'Before',
                                              value: 'before',
                                            },
                                            { label: 'After', value: 'after' },
                                          ]}
                                          inputWidth="55px"
                                          {...inputHandlers}
                                          editable={editable}
                                          required
                                          hideDropdownArrow
                                          hideTooltip
                                        />
                                      )}
                                    </FormField>
                                  </div>

                                  <FormField
                                    name="autoDateField"
                                    initValue={autoDateField}
                                    setFieldValue={(field, value) => {
                                      if (values.startDateBinding !== value) {
                                        set(field, value);
                                        setFieldValue('startDateBinding', value);
                                        emitter.emit(`FIND_${entity.toUpperCase()}_VALUE`, {
                                          field: value,
                                          entityId: getByPath('entity.id', task),
                                          selectedField: 'startDate',
                                          autoDateDuration,
                                          autoDateOffset,
                                        });
                                      }
                                    }}
                                    saveOnChange
                                  >
                                    {({ ...inputHandlers }) => (
                                      <SelectInputFactory
                                        {...inputHandlers}
                                        items={getFieldsByEntity(entity, intl)}
                                        editable={editable}
                                        required
                                        hideTooltip
                                      />
                                    )}
                                  </FormField>
                                </div>
                              )}
                            </ObjectValue>
                          ) : (
                            <Display color="GRAY_LIGHT" width="200px" height="30px">
                              {(() => {
                                if (startDateSyncUnavailable) {
                                  return (
                                    <FormattedMessage
                                      id="modules.Tasks.dataSyncingUnavailable"
                                      defaultMessage="Data syncing unavailable"
                                    />
                                  );
                                }

                                return editable ? (
                                  <FormattedMessage
                                    id="modules.Tasks.chooseDataBinding"
                                    defaultMessage="Choose data to sync from"
                                  />
                                ) : (
                                  <FormattedMessage
                                    id="modules.Tasks.noEventBindingChosen"
                                    defaultMessage="No event binding chosen"
                                  />
                                );
                              })()}
                            </Display>
                          )}
                        </GridColumn>
                      }
                    />

                    <FieldItem
                      label={
                        <Label height="30px">
                          <FormattedMessage id="modules.Tasks.dueDate" defaultMessage="DUE DATE" />
                        </Label>
                      }
                      input={
                        <GridColumn gap="10px">
                          <div
                            className={AutoDateBackgroundStyle(
                              manualSettings.dueDate ? 'top' : 'bottom'
                            )}
                          />

                          <div className={RadioWrapperStyle('top')}>
                            <RadioInput
                              align="right"
                              selected={manualSettings.dueDate}
                              onToggle={() =>
                                !manualSettings.dueDate
                                  ? onChangeBinding({
                                      type: entity,
                                      field: 'dueDate',
                                      isManual: true,
                                      onChange: setFieldValues,
                                    })
                                  : () => {}
                              }
                              editable={editable}
                            />
                          </div>

                          <div className={RadioWrapperStyle('bottom')}>
                            <RadioInput
                              align="right"
                              selected={!manualSettings.dueDate}
                              onToggle={() =>
                                manualSettings.dueDate
                                  ? onChangeBinding({
                                      type: entity,
                                      field: 'dueDate',
                                      isManual: false,
                                      onChange: setFieldValues,
                                    })
                                  : () => {}
                              }
                              editable={editable}
                            />
                          </div>

                          {isInTemplate ? (
                            <Display
                              color={manualSettings.dueDate ? 'GRAY' : 'GRAY_LIGHT'}
                              height="30px"
                            >
                              <FormattedMessage
                                id="modules.Tasks.datePlaceholder"
                                defaultMessage="yyyy/mm/dd"
                              />
                            </Display>
                          ) : (
                            <FormField
                              name="dueDate"
                              initValue={values.dueDate}
                              values={values}
                              validator={validator}
                              setFieldValue={setFieldValue}
                            >
                              {({ name, ...inputHandlers }) => (
                                <DateInputFactory
                                  name={name}
                                  inputColor={
                                    values.dueDate &&
                                    isBefore(new Date(values.dueDate), new Date()) &&
                                    status !== COMPLETED
                                      ? 'RED'
                                      : 'BLACK'
                                  }
                                  {...inputHandlers}
                                  originalValue={originalValues[name]}
                                  editable={editable && manualSettings.dueDate}
                                  hideTooltip={!manualSettings.dueDate}
                                />
                              )}
                            </FormField>
                          )}

                          {!manualSettings.dueDate ? (
                            <ObjectValue
                              value={{
                                autoDateField: values.dueDateBinding,
                                ...convertBindingToSelection(values.dueDateInterval),
                              }}
                              onChange={({ autoDateOffset, autoDateDuration }) => {
                                const newDate = calculateDate({
                                  date:
                                    values.dueDateBinding === START_DATE
                                      ? values.startDate
                                      : parentValues.current &&
                                        parentValues.current[values.dueDateBinding],
                                  duration: autoDateDuration.metric,
                                  offset:
                                    autoDateOffset === 'after'
                                      ? Math.abs(autoDateDuration.value)
                                      : -Math.abs(autoDateDuration.value),
                                });
                                setFieldValue('dueDate', newDate);
                                setFieldValue('dueDateInterval', {
                                  [autoDateDuration.metric]:
                                    autoDateOffset === 'after'
                                      ? autoDateDuration.value
                                      : -autoDateDuration.value,
                                });
                              }}
                            >
                              {({
                                value: { autoDateDuration, autoDateOffset, autoDateField },
                                set,
                              }) => (
                                <div className={AutoDateWrapperStyle}>
                                  <div className={AutoDateSyncIconStyle}>
                                    <Icon icon="SYNC" />
                                  </div>

                                  <div className={AutoDateOffsetWrapperStyle}>
                                    <FormField
                                      name="autoDueDateDuration"
                                      initValue={{
                                        ...autoDateDuration,
                                        value: Math.abs(autoDateDuration.value),
                                      }}
                                      setFieldValue={(field, value) =>
                                        set('autoDateDuration', value)
                                      }
                                    >
                                      {({ name, ...inputHandlers }) => (
                                        <MetricInputFactory
                                          name={name}
                                          metricType="duration"
                                          metricSelectWidth="60px"
                                          metricOptionWidth="65px"
                                          inputWidth="135px"
                                          {...inputHandlers}
                                          editable={editable}
                                          hideTooltip
                                        />
                                      )}
                                    </FormField>

                                    <FormField
                                      name="autoDateOffset"
                                      initValue={autoDateOffset}
                                      setFieldValue={set}
                                      saveOnChange
                                    >
                                      {({ ...inputHandlers }) => (
                                        <SelectInputFactory
                                          items={[
                                            {
                                              label: 'Before',
                                              value: 'before',
                                            },
                                            { label: 'After', value: 'after' },
                                          ]}
                                          inputWidth="55px"
                                          {...inputHandlers}
                                          editable={editable}
                                          required
                                          hideDropdownArrow
                                          hideTooltip
                                        />
                                      )}
                                    </FormField>
                                  </div>

                                  <FormField
                                    name="autoDateField"
                                    initValue={autoDateField}
                                    setFieldValue={(field, value) => {
                                      if (values.dueDateBinding !== value) {
                                        set(field, value);
                                        setFieldValue('dueDateBinding', value);
                                        emitter.emit(`FIND_${entity.toUpperCase()}_VALUE`, {
                                          field: value,
                                          entityId: getByPath('entity.id', task),
                                          selectedField: 'dueDate',
                                          autoDateDuration,
                                          autoDateOffset,
                                        });
                                      }
                                    }}
                                    saveOnChange
                                  >
                                    {({ ...inputHandlers }) => (
                                      <SelectInputFactory
                                        {...inputHandlers}
                                        items={
                                          startDateSyncUnavailable
                                            ? [
                                                {
                                                  value: START_DATE,
                                                  label: intl.formatMessage({
                                                    id: 'modules.Tasks.startDate',
                                                    defaultMessage: 'START DATE',
                                                  }),
                                                },
                                              ]
                                            : [
                                                {
                                                  value: START_DATE,
                                                  label: intl.formatMessage({
                                                    id: 'modules.Tasks.startDate',
                                                    defaultMessage: 'START DATE',
                                                  }),
                                                },
                                                ...getFieldsByEntity(entity, intl),
                                              ]
                                        }
                                        editable={editable}
                                        required
                                        hideTooltip
                                      />
                                    )}
                                  </FormField>
                                </div>
                              )}
                            </ObjectValue>
                          ) : (
                            <Display color="GRAY_LIGHT" width="200px" height="30px">
                              {editable ? (
                                <FormattedMessage
                                  id="modules.Tasks.chooseDataBinding"
                                  defaultMessage="Choose data to sync from"
                                />
                              ) : (
                                <FormattedMessage
                                  id="modules.Tasks.noEventBindingChosen"
                                  defaultMessage="No event binding chosen"
                                />
                              )}
                            </Display>
                          )}
                        </GridColumn>
                      }
                    />

                    <FormField
                      name="description"
                      initValue={values.description}
                      values={values}
                      validator={validator}
                      setFieldValue={setFieldValue}
                    >
                      {({ name, ...inputHandlers }) => (
                        <TextAreaInputFactory
                          name={name}
                          {...inputHandlers}
                          originalValue={originalValues[name]}
                          label={
                            <FormattedMessage
                              id="modules.Tasks.description"
                              defaultMessage="DESCRIPTION"
                            />
                          }
                          inputHeight="100px"
                          inputWidth="200px"
                          inputAlign="right"
                          vertical={false}
                          editable={editable}
                        />
                      )}
                    </FormField>

                    <FieldItem
                      vertical
                      label={
                        <Label height="30px">
                          <FormattedMessage id="modules.Tasks.tags" defaultMessage="TAGS" />
                        </Label>
                      }
                      input={
                        <TagsInput
                          id="tags"
                          name="tags"
                          tagType="Task"
                          values={values.tags}
                          onChange={(field, value) => {
                            setFieldValue(field, value);
                          }}
                          editable={{
                            set: hasPermission(TAG_LIST) && editable,
                            remove: editable,
                          }}
                        />
                      }
                    />
                  </GridColumn>

                  {!hideParentInfo &&
                    getByPathWithDefault('', 'entity.__typename', task) === 'Order' && (
                      <GridColumn>
                        <FieldItem
                          label={
                            <Label>
                              <FormattedMessage id="modules.Tasks.order" defaultMessage="ORDER" />
                            </Label>
                          }
                          vertical
                          input={<OrderCard order={task.entity} />}
                        />
                      </GridColumn>
                    )}

                  {!hideParentInfo &&
                    getByPathWithDefault('', 'entity.__typename', task) === 'OrderItem' &&
                    (() => {
                      const { orderItem, productProvider, product, order } = spreadOrderItem(
                        task.entity
                      );

                      const viewable = {
                        price: hasPermission(ORDER_ITEMS_GET_PRICE),
                      };

                      const navigable = {
                        order: hasPermission(ORDER_FORM),
                        product: hasPermission(PRODUCT_FORM),
                      };

                      const config = {
                        hideOrder: false,
                      };
                      return (
                        <GridColumn>
                          <FieldItem
                            label={
                              <Label>
                                <FormattedMessage id="modules.Tasks.item" defaultMessage="ITEM" />
                              </Label>
                            }
                            vertical
                            input={
                              <ItemCard
                                orderItem={orderItem}
                                productProvider={productProvider}
                                product={product}
                                order={order}
                                viewable={viewable}
                                navigable={navigable}
                                config={config}
                                onClick={() => navigate(`/order-item/${encodeId(orderItem.id)}`)}
                              />
                            }
                          />
                        </GridColumn>
                      );
                    })()}

                  {!hideParentInfo &&
                    getByPathWithDefault('', 'entity.__typename', task) === 'Product' && (
                      <GridColumn>
                        <FieldItem
                          label={
                            <Label>
                              <FormattedMessage
                                id="modules.Tasks.product"
                                defaultMessage="PRODUCT"
                              />
                            </Label>
                          }
                          vertical
                          input={<ProductCard product={task.entity} />}
                        />
                      </GridColumn>
                    )}

                  {!hideParentInfo &&
                    getByPathWithDefault('', 'entity.__typename', task) === 'ProductProvider' && (
                      <GridColumn>
                        <FieldItem
                          label={
                            <Label>
                              <FormattedMessage
                                id="modules.Tasks.endProduct"
                                defaultMessage="END PRODUCT"
                              />
                            </Label>
                          }
                          vertical
                          input={<OrderProductProviderCard productProvider={task.entity} />}
                        />
                      </GridColumn>
                    )}

                  {!hideParentInfo &&
                    getByPathWithDefault('', 'entity.__typename', task) === 'Batch' && (
                      <GridColumn>
                        <FieldItem
                          label={
                            <Label>
                              <FormattedMessage id="modules.Tasks.batch" defaultMessage="BATCH" />
                            </Label>
                          }
                          vertical
                          input={<BatchCard batch={task.entity} />}
                        />
                      </GridColumn>
                    )}
                </div>

                <div className={MemoWrapperStyle}>
                  {isInTemplate ? (
                    <FieldItem
                      vertical
                      label={
                        <Label>
                          <FormattedMessage id="modules.Tasks.memo" defaultMessage="MEMO" />
                        </Label>
                      }
                      input={
                        <Display color="GRAY_LIGHT">
                          <FormattedMessage
                            id="modules.Tasks.memoPlaceholder"
                            defaultMessage="Value will be entered here"
                          />
                        </Display>
                      }
                    />
                  ) : (
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
                          label={<FormattedMessage id="modules.Tasks.memo" defaultMessage="MEMO" />}
                          vertical
                          inputWidth="680px"
                          inputHeight="65px"
                          editable={editable}
                        />
                      )}
                    </FormField>
                  )}
                </div>

                <div className={TaskStatusWrapperStyle}>
                  <div className={AssignedToStyle}>
                    <FieldItem
                      vertical
                      label={
                        <Label height="30px">
                          <FormattedMessage
                            id="modules.Tasks.assignedToComplete"
                            defaultMessage="ASSIGNED TO COMPLETE"
                          />
                        </Label>
                      }
                      input={
                        <TaskAssignmentInput
                          users={values.assignedTo}
                          onChange={newAssignedTo => setFieldValue('assignedTo', newAssignedTo)}
                          activeUserId={activeUser && activeUser.id}
                          onActivateUser={
                            isInTemplate
                              ? null
                              : user => {
                                  setFieldValues({
                                    inProgressBy: user,
                                    inProgressAt: new Date(),
                                  });
                                  setFieldTouched('inProgressBy');
                                  setFieldTouched('inProgressAt');
                                }
                          }
                          onDeactivateUser={() => {
                            if (status === COMPLETED) {
                              setFieldValues({
                                completedBy: null,
                                inProgressAt: null,
                              });
                              setFieldTouched('completedBy');
                              setFieldTouched('completedBy');
                            } else if (status === IN_PROGRESS) {
                              setFieldValues({
                                inProgressBy: null,
                                inProgressAt: null,
                              });
                              setFieldTouched('inProgressBy');
                              setFieldTouched('inProgressAt');
                            }
                          }}
                          editable={editable}
                        />
                      }
                    />

                    <FieldItem
                      vertical
                      label={
                        <Label height="30px" align="right">
                          <FormattedMessage id="modules.Tasks.status" defaultMessage="STATUS" />
                        </Label>
                      }
                      input={
                        isInTemplate ? (
                          <Display color="GRAY_LIGHT">
                            <FormattedMessage
                              id="modules.Tasks.statusDisabled"
                              defaultMessage="Status will be displayed here"
                            />
                          </Display>
                        ) : (
                          <>
                            {activeUser ? (
                              <TaskStatusInput
                                activeUser={activeUser}
                                status={status}
                                onClick={() => {
                                  setFieldValues({
                                    completedBy: activeUser,
                                    completedAt: formatToGraphql(startOfToday()),
                                  });
                                  setFieldTouched('completedBy');
                                  setFieldTouched('completedAt');
                                }}
                                editable={editable}
                              />
                            ) : (
                              <Display color="GRAY_DARK">
                                <FormattedMessage
                                  id="modules.Tasks.chooseUser"
                                  defaultMessage="Please choose a user to start the task"
                                />
                              </Display>
                            )}
                          </>
                        )
                      }
                    />
                  </div>

                  {status === COMPLETED && (
                    <FormField
                      name="completedAt"
                      initValue={values.completedAt}
                      values={values}
                      validator={validator}
                      setFieldValue={setFieldValue}
                    >
                      {({ name, ...inputHandlers }) => (
                        <DateInputFactory
                          name={name}
                          {...inputHandlers}
                          originalValue={originalValues[name]}
                          label={
                            <FormattedMessage
                              id="modules.Tasks.completedAt"
                              defaultMessage="DATE COMPLETED"
                            />
                          }
                          editable={editable}
                        />
                      )}
                    </FormField>
                  )}

                  <Divider />

                  <div className={ApprovalToggleWrapperStyle}>
                    <Icon icon="CONFIRM" />
                    <Label align="right" width="min-content">
                      <FormattedMessage id="modules.Tasks.approval" defaultMessage="APPROVAL" />
                    </Label>
                    <ToggleInput
                      toggled={values.approvable}
                      onToggle={() => {
                        if (values.approvable) {
                          setFieldValues({
                            approvedBy: null,
                            approvedAt: null,
                            rejectedBy: null,
                            rejectedAt: null,
                            approvers: [],
                          });
                        }
                        setFieldValue('approvable', !values.approvable);
                        setFieldTouched('approvable');
                      }}
                      editable={editable}
                    />
                  </div>

                  {values.approvable && (
                    <>
                      <ObjectValue defaultValue={values.rejectedBy || values.approvedBy}>
                        {({ value: userChosen, set: setUserChosen }) => (
                          <div className={AssignedToStyle}>
                            <FieldItem
                              vertical
                              label={
                                <Label height="30px">
                                  <FormattedMessage
                                    id="modules.Tasks.assignedToApprove"
                                    defaultMessage="ASSIGNED TO APPROVE"
                                  />
                                </Label>
                              }
                              input={
                                <TaskAssignmentInput
                                  users={values.approvers}
                                  onChange={newApprovers =>
                                    setFieldValue('approvers', newApprovers)
                                  }
                                  activeUserId={userChosen && userChosen.id}
                                  onActivateUser={
                                    isInTemplate
                                      ? null
                                      : user => {
                                          setUserChosen(user);
                                        }
                                  }
                                  onDeactivateUser={() => {
                                    setUserChosen(null);
                                    setFieldValues({
                                      approvedBy: null,
                                      approvedAt: null,
                                      rejectedBy: null,
                                      rejectedAt: null,
                                    });
                                  }}
                                  editable={editable}
                                />
                              }
                            />

                            <FieldItem
                              vertical
                              label={
                                <Label height="30px" align="right">
                                  <FormattedMessage
                                    id="modules.Tasks.approval"
                                    defaultMessage="APPROVAL"
                                  />
                                </Label>
                              }
                              input={
                                isInTemplate ? (
                                  <Display color="GRAY_LIGHT">
                                    <FormattedMessage
                                      id="modules.Tasks.approvalDisabled"
                                      defaultMessage="Approval will be displayed here"
                                    />
                                  </Display>
                                ) : (
                                  <>
                                    {isUnapproved ? (
                                      <>
                                        {userChosen && userChosen.id ? (
                                          <ApproveRejectMenu
                                            width="175px"
                                            onApprove={() => {
                                              setFieldValues({
                                                approvedBy: userChosen,
                                                approvedAt: formatToGraphql(startOfToday()),
                                                rejectedBy: null,
                                                rejectedAt: null,
                                              });
                                              setFieldTouched('approvedBy');
                                              setFieldTouched('approvedAt');
                                            }}
                                            onReject={() => {
                                              setFieldValues({
                                                approvedBy: null,
                                                approvedAt: null,
                                                rejectedBy: userChosen,
                                                rejectedAt: formatToGraphql(startOfToday()),
                                              });
                                              setFieldTouched('rejectedBy');
                                              setFieldTouched('rejectedAt');
                                            }}
                                          />
                                        ) : (
                                          <Display color="GRAY_DARK">
                                            <FormattedMessage
                                              id="modules.Tasks.chooseUserForApproval"
                                              defaultMessage="Please choose a user to start the approval"
                                            />
                                          </Display>
                                        )}
                                      </>
                                    ) : (
                                      <TaskApprovalStatusInput
                                        editable={editable}
                                        approval={
                                          values.approvedBy && values.approvedBy.id
                                            ? {
                                                approvedAt: values.approvedAt,
                                                approvedBy: values.approvedBy,
                                              }
                                            : null
                                        }
                                        rejection={
                                          values.rejectedBy && values.rejectedBy.id
                                            ? {
                                                rejectedBy: values.rejectedBy,
                                                rejectedAt: values.rejectedAt,
                                              }
                                            : null
                                        }
                                      />
                                    )}
                                  </>
                                )
                              }
                            />
                          </div>
                        )}
                      </ObjectValue>
                      {values.approvedBy && values.approvedBy.id && (
                        <FormField
                          name="approvedAt"
                          initValue={values.approvedAt}
                          values={values}
                          validator={validator}
                          setFieldValue={setFieldValue}
                        >
                          {({ name, ...inputHandlers }) => (
                            <DateInputFactory
                              name={name}
                              {...inputHandlers}
                              originalValue={originalValues[name]}
                              label={
                                <FormattedMessage
                                  id="modules.Tasks.approvedDate"
                                  defaultMessage="APPROVED DATE"
                                />
                              }
                              editable={editable}
                            />
                          )}
                        </FormField>
                      )}
                      {values.rejectedBy && values.rejectedBy.id && (
                        <FormField
                          name="rejectedAt"
                          initValue={values.rejectedAt}
                          values={values}
                          validator={validator}
                          setFieldValue={setFieldValue}
                        >
                          {({ name, ...inputHandlers }) => (
                            <DateInputFactory
                              name={name}
                              {...inputHandlers}
                              originalValue={originalValues[name]}
                              label={
                                <FormattedMessage
                                  id="modules.Tasks.rejectedDate"
                                  defaultMessage="REJECTED DATE"
                                />
                              }
                              editable={editable}
                            />
                          )}
                        </FormField>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          }}
        </Subscribe>
      </SectionWrapper>
    </div>
  );
};

TaskInfoSection.defaultProps = defaultProps;

export default injectIntl(TaskInfoSection);
