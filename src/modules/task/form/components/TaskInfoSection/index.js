// @flow
import React from 'react';

import { type IntlShape, injectIntl, FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { ObjectValue, BooleanValue } from 'react-values';
import { TAG_LIST } from 'modules/permission/constants/tag';
import { UserConsumer } from 'components/Context/Viewer';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import emitter from 'utils/emitter';
import {
  triggerAutoBinding,
  checkEditableFromEntity,
  START_DATE,
  DUE_DATE,
  PROJECT_DUE_DATE,
  MILESTONE_DUE_DATE,
  prepareStatus,
} from 'utils/task';
import {
  formatToGraphql,
  isBefore,
  calculateDate,
  findDuration,
  todayForDateInput,
} from 'utils/date';

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
  Display,
  ToggleInput,
  ApproveRejectMenu,
  TaskApprovalStatusInput,
  RadioInput,
  MetricInputFactory,
  SelectInputFactory,
  UserAssignmentInputFactory,
  FormTooltip,
} from 'components/Form';
import Icon from 'components/Icon';
import GridColumn from 'components/GridColumn';
import { FormField, FormContainer } from 'modules/form';
import TaskContainer from 'modules/task/form/container';
import validator, { circleValidator } from 'modules/task/form/validator';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import UserAvatar from 'components/UserAvatar';
import { convertBindingToSelection, getFieldsByEntity } from './helpers';
import {
  TaskSectionWrapperStyle,
  MainFieldsWrapperStyle,
  TaskStatusWrapperStyle,
  AssignedToStyle,
  ApprovalToggleWrapperStyle,
  AutoDateBackgroundStyle,
  RadioWrapperStyle,
  AutoDateWrapperStyle,
  AutoDateOffsetWrapperStyle,
  AutoDateSyncIconStyle,
  UnapprovedButtonStyle,
  StatusWrapperStyle,
  StatusColorStyle,
  CompletedAvatarStyle,
} from './style';

type Props = {|
  task: Object,
  groupIds: Array<string>,
  intl: IntlShape,
  isInTemplate?: boolean,
  isInProject?: boolean,
  hideParentInfo?: boolean,
  parentEntity?: string,
|};

function defaultBindingOptions(intl: IntlShape, isStartDate: boolean) {
  return [
    !isStartDate
      ? {
          value: START_DATE,
          label: intl.formatMessage({
            id: 'modules.Tasks.startDate',
            defaultMessage: 'START DATE',
          }),
        }
      : {
          value: DUE_DATE,
          label: intl.formatMessage({
            id: 'modules.Tasks.dueDate',
            defaultMessage: 'DUE DATE',
          }),
        },
    {
      value: PROJECT_DUE_DATE,
      label: intl.formatMessage({
        id: 'modules.Tasks.projectDueDate',
        defaultMessage: 'PROJECT DUE DATE',
      }),
    },
    {
      value: MILESTONE_DUE_DATE,
      label: intl.formatMessage({
        id: 'modules.Tasks.milestoneDueDate',
        defaultMessage: 'MILESTONE DUE DATE',
      }),
    },
  ];
}

const TaskInfoSection = ({
  intl,
  groupIds,
  task,
  isInTemplate,

  parentEntity,
}: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const initDuration = {};
  let isBeforeStartDate = true;
  let isBeforeDueDate = true;
  if (task && task.startDateBinding) {
    const { months = 0, weeks = 0, days = 0 } = task.startDateInterval || {};
    if ((months || weeks || days) > 0) {
      isBeforeStartDate = false;
    }
    initDuration[task.startDateBinding] = calculateDate({
      duration: findDuration({ months, weeks }),
      date: task.startDate,
      offset: -(months || weeks || days),
    });
  }

  if (task && task.dueDateBinding) {
    const { months = 0, weeks = 0, days = 0 } = task.dueDateInterval || {};
    if ((months || weeks || days) > 0) {
      isBeforeDueDate = false;
    }
    initDuration[task.dueDateBinding] = calculateDate({
      duration: findDuration({ months, weeks }),
      date: task.dueDate,
      offset: -(months || weeks || days),
    });
  }

  const parentValues = React.useRef(initDuration);
  const [isBeforeStartDateBinding, setIsBeforeStartDateBinding] = React.useState(isBeforeStartDate);
  const [isBeforeDueDateBinding, setIsBeforeDueDateBinding] = React.useState(isBeforeDueDate);

  const onChangeBinding = React.useCallback(
    ({
      isManual,
      field,
      hasCircleBindingError,
      type,
      onChange,
    }: {
      isManual: boolean,
      hasCircleBindingError: boolean,
      type: string,
      field: 'startDate' | 'dueDate',
      onChange: Object => void,
    }) => {
      if (!isManual) {
        switch (type) {
          case 'Shipment': {
            onChange({
              [`${field}Binding`]: field === 'dueDate' ? START_DATE : DUE_DATE,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit(`FIND_${type.toUpperCase()}_VALUE`, {
              field: field === 'dueDate' ? START_DATE : DUE_DATE,
              entityId: getByPath('entity.id', task),
              selectedField: field,
              hasCircleBindingError,
            });
            break;
          }
          case 'Batch': {
            onChange({
              [`${field}Binding`]: field === 'dueDate' ? START_DATE : DUE_DATE,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit(`FIND_${type.toUpperCase()}_VALUE`, {
              field: field === 'dueDate' ? START_DATE : DUE_DATE,
              entityId: getByPath('entity.id', task),
              selectedField: field,
              hasCircleBindingError,
            });
            break;
          }
          case 'Order': {
            onChange({
              [`${field}Binding`]: field === 'dueDate' ? START_DATE : DUE_DATE,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit(`FIND_${type.toUpperCase()}_VALUE`, {
              field: field === 'dueDate' ? START_DATE : DUE_DATE,
              entityId: getByPath('entity.id', task),
              selectedField: field,
              hasCircleBindingError,
            });
            break;
          }
          case 'OrderItem': {
            onChange({
              [`${field}Binding`]: field === 'dueDate' ? START_DATE : DUE_DATE,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit(`FIND_${type.toUpperCase()}_VALUE`, {
              field: field === 'dueDate' ? START_DATE : DUE_DATE,
              entityId: getByPath('entity.id', task),
              selectedField: field,
              hasCircleBindingError,
            });
            break;
          }
          case 'Product': {
            onChange({
              [`${field}Binding`]: field === 'dueDate' ? START_DATE : DUE_DATE,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit(`FIND_${type.toUpperCase()}_VALUE`, {
              field: field === 'dueDate' ? START_DATE : DUE_DATE,
              entityId: getByPath('entity.id', task),
              selectedField: field,
              hasCircleBindingError,
            });
            break;
          }
          case 'ProductProvider': {
            onChange({
              [`${field}Binding`]: field === 'dueDate' ? START_DATE : DUE_DATE,
              [`${field}Interval`]: { days: 0 },
            });
            emitter.emit(`FIND_${type.toUpperCase()}_VALUE`, {
              field: field === 'dueDate' ? START_DATE : DUE_DATE,
              entityId: getByPath('entity.id', task),
              selectedField: field,
              hasCircleBindingError,
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
              hasCircleBindingError,
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
    [task]
  );

  React.useEffect(() => {
    emitter.addListener('LIVE_VALUE', (field: mixed, value: mixed) => {
      if (value && parentValues.current) {
        parentValues.current[String(field)] = value;
      }
    });

    return () => {
      emitter.removeAllListeners('LIVE_VALUE');
    };
  });

  return (
    <SectionWrapper id="task_task_section">
      <SectionHeader
        icon="TASK"
        title={<FormattedMessage id="modules.Tasks.task" defaultMessage="TASK" />}
      >
        {task.updatedAt && <LastModified updatedAt={task.updatedAt} updatedBy={task.updatedBy} />}
      </SectionHeader>
      <Subscribe to={[TaskContainer, FormContainer]}>
        {(
          { originalValues, state: values, setFieldValue, setFieldValues },
          { setFieldTouched }
        ) => {
          const isCompleted = !!values.completedBy;
          const isUnapproved = !(
            (values.approvedBy && values.approvedBy.id) ||
            (values.rejectedBy && values.rejectedBy.id)
          );
          const manualSettings = {
            startDate: !values.startDateBinding,
            dueDate: !values.dueDateBinding,
          };

          const entity = getByPathWithDefault(parentEntity, 'entity.__typename', task);
          const editable = checkEditableFromEntity(entity, hasPermission);
          const hasCircleBindingError = !circleValidator.isValidSync(values);

          const {
            completedAt,
            completedBy,
            inProgressAt,
            inProgressBy,
            skippedAt,
            skippedBy,
          } = values;

          const {
            status,
            color,
            backgroundColor,
            account,
            editable: statusEditable,
          } = prepareStatus({
            task: { completedAt, completedBy, inProgressAt, inProgressBy, skippedAt, skippedBy },
            editable,
          });

          return (
            <div className={TaskSectionWrapperStyle}>
              <div className={MainFieldsWrapperStyle}>
                <GridColumn>
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
                        editable={editable.name}
                      />
                    )}
                  </FormField>

                  <FieldItem
                    tooltip={
                      hasCircleBindingError && (
                        <FormTooltip
                          errorMessage={
                            <FormattedMessage
                              id="modules.Tasks.bindingErrorMessage"
                              defaultMessage="Start Date and Due Date cannot be binded to each other at the same time."
                            />
                          }
                        />
                      )
                    }
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
                                    hasCircleBindingError: false,
                                  })
                                : () => {}
                            }
                            editable={editable.dueDate}
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
                                    hasCircleBindingError: values.startDateBinding === DUE_DATE,
                                  })
                                : () => {}
                            }
                            editable={editable.dueDate}
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
                                  isCompleted
                                    ? 'RED'
                                    : 'BLACK'
                                }
                                {...inputHandlers}
                                onBlur={evt => {
                                  inputHandlers.onBlur(evt);
                                  triggerAutoBinding({
                                    manualSettings,
                                    values,
                                    entity,
                                    hasCircleBindingError,
                                    task,
                                  });
                                }}
                                originalValue={originalValues[name]}
                                editable={editable.dueDate && manualSettings.dueDate}
                                hideTooltip={!manualSettings.dueDate}
                              />
                            )}
                          </FormField>
                        )}

                        {!manualSettings.dueDate ? (
                          <ObjectValue
                            value={{
                              autoDateField: values.dueDateBinding,
                              startDateBinding: values.startDateBinding,
                              autoDateOffset: isBeforeDueDateBinding ? 'before' : 'after',
                              ...convertBindingToSelection(values.dueDateInterval),
                            }}
                            onChange={({
                              autoDateField,
                              startDateBinding,
                              autoDateOffset,
                              autoDateDuration,
                            }) => {
                              setFieldValue('dueDateInterval', {
                                [autoDateDuration.metric]:
                                  autoDateOffset === 'after'
                                    ? Math.abs(autoDateDuration.value)
                                    : -Math.abs(autoDateDuration.value),
                              });
                              emitter.emit(`FIND_${entity.toUpperCase()}_VALUE`, {
                                selectedField: 'dueDate',
                                field: autoDateField,
                                entityId: getByPath('entity.id', task),
                                autoDateDuration: {
                                  ...autoDateDuration,
                                  value:
                                    autoDateOffset === 'after'
                                      ? Math.abs(autoDateDuration.value)
                                      : -Math.abs(autoDateDuration.value),
                                },
                                autoDateOffset,
                                hasCircleBindingError:
                                  autoDateField === START_DATE && startDateBinding === DUE_DATE,
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
                                    setFieldValue={(field, value) => set('autoDateDuration', value)}
                                    values={{ autoDateDuration, autoDateOffset, autoDateField }}
                                  >
                                    {({ name, ...inputHandlers }) => (
                                      <MetricInputFactory
                                        name={name}
                                        metricType="duration"
                                        metricSelectWidth="60px"
                                        metricOptionWidth="65px"
                                        inputWidth="135px"
                                        {...inputHandlers}
                                        editable={editable.dueDateBinding}
                                        hideTooltip
                                      />
                                    )}
                                  </FormField>

                                  <FormField
                                    name="autoDueDateOffset"
                                    initValue={autoDateOffset}
                                    setFieldValue={(field, value) => {
                                      setIsBeforeDueDateBinding(value === 'before');
                                      set('autoDateOffset', value);
                                    }}
                                    saveOnChange
                                    values={{ autoDateDuration, autoDateOffset, autoDateField }}
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
                                        editable={editable.dueDateBinding}
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
                                    }
                                  }}
                                  saveOnChange
                                  values={{ autoDateDuration, autoDateOffset, autoDateField }}
                                >
                                  {({ ...inputHandlers }) => (
                                    <SelectInputFactory
                                      {...inputHandlers}
                                      items={[
                                        ...defaultBindingOptions(intl, false),
                                        ...getFieldsByEntity(entity, intl),
                                      ]}
                                      editable={editable.dueDateBinding}
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
                            {editable.dueDateBinding ? (
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

                  <FieldItem
                    tooltip={
                      hasCircleBindingError && (
                        <FormTooltip
                          errorMessage={
                            <FormattedMessage
                              id="modules.Tasks.bindingErrorMessage"
                              defaultMessage="Start Date and Due Date cannot be binded to each other at the same time."
                            />
                          }
                        />
                      )
                    }
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
                                    hasCircleBindingError: false,
                                  })
                                : () => {}
                            }
                            editable={editable.startDate}
                          />
                        </div>

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
                                    hasCircleBindingError: values.dueDateBinding === START_DATE,
                                  })
                                : () => {}
                            }
                            editable={editable.startDate}
                          />
                        </div>

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
                              if (!manualSettings.dueDate && values.dueDateBinding === START_DATE) {
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
                                onBlur={evt => {
                                  inputHandlers.onBlur(evt);
                                  triggerAutoBinding({
                                    manualSettings,
                                    values,
                                    entity,
                                    hasCircleBindingError,
                                    task,
                                  });
                                }}
                                originalValue={originalValues[name]}
                                editable={editable.startDate && manualSettings.startDate}
                                hideTooltip={!manualSettings.startDate}
                              />
                            )}
                          </FormField>
                        )}

                        {!manualSettings.startDate ? (
                          <ObjectValue
                            value={{
                              autoDateField: values.startDateBinding,
                              dueDateBinding: values.dueDateBinding,
                              ...convertBindingToSelection(values.startDateInterval),
                              autoDateOffset: isBeforeStartDateBinding ? 'before' : 'after',
                            }}
                            onChange={({
                              autoDateField,
                              dueDateBinding,
                              autoDateOffset,
                              autoDateDuration,
                            }) => {
                              setFieldValue('startDateInterval', {
                                [autoDateDuration.metric]:
                                  autoDateOffset === 'after'
                                    ? Math.abs(autoDateDuration.value)
                                    : -Math.abs(autoDateDuration.value),
                              });
                              emitter.emit(`FIND_${entity.toUpperCase()}_VALUE`, {
                                selectedField: 'startDate',
                                field: autoDateField,
                                entityId: getByPath('entity.id', task),
                                autoDateDuration: {
                                  ...autoDateDuration,
                                  value:
                                    autoDateOffset === 'after'
                                      ? Math.abs(autoDateDuration.value)
                                      : -Math.abs(autoDateDuration.value),
                                },
                                autoDateOffset,
                                hasCircleBindingError:
                                  autoDateField === DUE_DATE && dueDateBinding === START_DATE,
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
                                    setFieldValue={(field, value) => set('autoDateDuration', value)}
                                    values={{ autoDateDuration, autoDateOffset, autoDateField }}
                                  >
                                    {({ name, ...inputHandlers }) => (
                                      <MetricInputFactory
                                        name={name}
                                        metricType="duration"
                                        metricSelectWidth="60px"
                                        metricOptionWidth="65px"
                                        inputWidth="135px"
                                        {...inputHandlers}
                                        editable={editable.startDateBinding}
                                        hideTooltip
                                      />
                                    )}
                                  </FormField>

                                  <FormField
                                    name="autoStartDateOffset"
                                    initValue={autoDateOffset}
                                    setFieldValue={(field, value) => {
                                      setIsBeforeStartDateBinding(value === 'before');
                                      set('autoDateOffset', value);
                                    }}
                                    saveOnChange
                                    values={{ autoDateDuration, autoDateOffset, autoDateField }}
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
                                        editable={editable.startDateBinding}
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
                                    }
                                  }}
                                  values={{ autoDateDuration, autoDateOffset, autoDateField }}
                                  saveOnChange
                                >
                                  {({ ...inputHandlers }) => (
                                    <SelectInputFactory
                                      {...inputHandlers}
                                      items={[
                                        ...defaultBindingOptions(intl, true),
                                        ...getFieldsByEntity(entity, intl),
                                      ]}
                                      editable={editable.startDate}
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
                            {editable.startDateBinding ? (
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
                        vertical={false}
                        editable={editable.description}
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
                        onChange={value => {
                          setFieldValue('tags', value);
                        }}
                        onClickRemove={value => {
                          setFieldValue('tags', values.tags.filter(({ id }) => id !== value.id));
                        }}
                        editable={{
                          set: hasPermission(TAG_LIST) && editable.tags,
                          remove: editable.tags,
                        }}
                      />
                    }
                  />
                </GridColumn>

                <UserConsumer>
                  {({ user }) => (
                    <GridColumn>
                      <div className={StatusWrapperStyle}>
                        {isInTemplate ? (
                          <Display color="GRAY_LIGHT">
                            <FormattedMessage
                              id="modules.Tasks.statusDisabled"
                              defaultMessage="Status will be displayed here"
                            />
                          </Display>
                        ) : (
                          <>
                            <FormField name="status" initValue={status} values={values}>
                              {({ name, ...inputHandlers }) => (
                                <span className={StatusColorStyle({ color, backgroundColor })}>
                                  <SelectInputFactory
                                    {...inputHandlers}
                                    items={[
                                      {
                                        value: 'uncompleted',
                                        label: intl.formatMessage({
                                          id: 'modules.milestone.uncompleted',
                                          defaultMessage: 'Uncompleted',
                                        }),
                                      },
                                      {
                                        value: 'inProgress',
                                        label: intl.formatMessage({
                                          id: 'modules.milestone.inProgress',
                                          defaultMessage: 'In Progress',
                                        }),
                                      },
                                      {
                                        value: 'completed',
                                        label: intl.formatMessage({
                                          id: 'modules.milestone.completed',
                                          defaultMessage: 'Completed',
                                        }),
                                      },
                                      {
                                        value: 'skipped',
                                        label: intl.formatMessage({
                                          id: 'modules.milestone.skipped',
                                          defaultMessage: 'Skipped',
                                        }),
                                      },
                                    ]}
                                    onChange={event => {
                                      const { value } = event.target;

                                      if (value === 'completed') {
                                        const newTask = {
                                          ...values,
                                          skippedAt: null,
                                          skippedBy: null,
                                          completedAt: todayForDateInput(),
                                          completedBy: user,
                                        };
                                        setFieldValues(newTask);
                                      } else if (value === 'inProgress') {
                                        const newTask = {
                                          ...values,
                                          completedAt: null,
                                          completedBy: null,
                                          skippedAt: null,
                                          skippedBy: null,
                                          inProgressAt: todayForDateInput(),
                                          inProgressBy: user,
                                        };
                                        setFieldValues(newTask);
                                      } else if (value === 'skipped') {
                                        const newTask = {
                                          ...values,
                                          completedAt: null,
                                          completedBy: null,
                                          inProgressAt: null,
                                          inProgressBy: null,
                                          skippedAt: todayForDateInput(),
                                          skippedBy: user,
                                        };
                                        setFieldValues(newTask);
                                      } else {
                                        setFieldValues({
                                          ...values,
                                          completedAt: null,
                                          completedBy: null,
                                          inProgressAt: null,
                                          inProgressBy: null,
                                          skippedAt: null,
                                          skippedBy: null,
                                        });
                                      }
                                    }}
                                    required
                                    hideTooltip
                                    vertical
                                    label={
                                      <FormattedMessage
                                        id="modules.milestone.status"
                                        defaultMessage="STATUS"
                                      />
                                    }
                                    editable={statusEditable}
                                  />
                                </span>
                              )}
                            </FormField>
                            {account && (
                              <div className={CompletedAvatarStyle}>
                                <UserAvatar
                                  firstName={account.firstName}
                                  lastName={account.lastName}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <UserAssignmentInputFactory
                        cacheKey="TaskUserSelect"
                        name="assignedTo"
                        label={
                          <FormattedMessage
                            id="modules.Tasks.assignedToComplete"
                            defaultMessage="ASSIGNED TO COMPLETE"
                          />
                        }
                        groupIds={groupIds}
                        values={values.assignedTo}
                        onChange={setFieldValue}
                        editable={editable.assignedTo}
                      />

                      {inProgressAt && (
                        <FormField
                          name="inProgressAt"
                          initValue={inProgressAt}
                          values={values}
                          setFieldValue={setFieldValue}
                        >
                          {({ name, ...inputHandlers }) => (
                            <DateInputFactory
                              name={name}
                              {...inputHandlers}
                              originalValue={originalValues[name]}
                              label={
                                <FormattedMessage
                                  id="common.inProgressDate"
                                  defaultMessage="IN PROGRESS DATE"
                                />
                              }
                              vertical
                              required
                              editable={editable.inProgress}
                            />
                          )}
                        </FormField>
                      )}
                      {skippedAt && (
                        <FormField
                          name="skippedAt"
                          initValue={skippedAt}
                          values={values}
                          setFieldValue={setFieldValue}
                        >
                          {({ name, ...inputHandlers }) => (
                            <DateInputFactory
                              name={name}
                              {...inputHandlers}
                              originalValue={originalValues[name]}
                              label={
                                <FormattedMessage
                                  id="common.skippedDate"
                                  defaultMessage="SKIPPED DATE"
                                />
                              }
                              vertical
                              required
                              editable={editable.inProgress}
                            />
                          )}
                        </FormField>
                      )}
                      {completedAt && (
                        <FormField
                          name="completedAt"
                          initValue={completedAt}
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
                                  id="common.completedDate"
                                  defaultMessage="COMPLETED DATE"
                                />
                              }
                              vertical
                              required
                              editable={editable.completed}
                            />
                          )}
                        </FormField>
                      )}
                    </GridColumn>
                  )}
                </UserConsumer>
              </div>

              <div className={TaskStatusWrapperStyle}>
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
                    editable={editable.approvable}
                  />
                </div>

                {values.approvable && (
                  <UserConsumer>
                    {({ user }) => (
                      <>
                        <div className={AssignedToStyle}>
                          <GridColumn gap="5px">
                            <UserAssignmentInputFactory
                              cacheKey="TaskUserSelect"
                              name="approvers"
                              label={
                                <FormattedMessage
                                  id="modules.Tasks.assignedToApprove"
                                  defaultMessage="ASSIGNED TO APPROVE"
                                />
                              }
                              groupIds={groupIds}
                              values={values.approvers}
                              onChange={setFieldValue}
                              editable={editable.approvers}
                            />
                          </GridColumn>

                          <GridColumn gap="5px">
                            <Label height="30px" align="right">
                              <FormattedMessage
                                id="modules.Tasks.approval"
                                defaultMessage="APPROVAL"
                              />
                            </Label>

                            {isInTemplate ? (
                              <Display color="GRAY_LIGHT">
                                <FormattedMessage
                                  id="modules.Tasks.approvalDisabled"
                                  defaultMessage="Approval will be displayed here"
                                />
                              </Display>
                            ) : (
                              <>
                                {isUnapproved ? (
                                  <BooleanValue defaultValue={false}>
                                    {({ value: showMenu, set: toggleShowMenu }) =>
                                      showMenu ? (
                                        <ApproveRejectMenu
                                          width="200px"
                                          onApprove={() => {
                                            setFieldValues({
                                              approvedBy: user,
                                              approvedAt: formatToGraphql(new Date()),
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
                                              rejectedBy: user,
                                              rejectedAt: formatToGraphql(new Date()),
                                            });
                                            setFieldTouched('rejectedBy');
                                            setFieldTouched('rejectedAt');
                                          }}
                                        />
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={evt => {
                                            if (editable.approved && editable.rejected) {
                                              evt.stopPropagation();
                                              toggleShowMenu(true);
                                            }
                                          }}
                                          className={UnapprovedButtonStyle(
                                            editable.approved && editable.rejected
                                          )}
                                        >
                                          <FormattedMessage
                                            id="modules.Tasks.unapproved"
                                            defaultMessage="UNAPPROVED"
                                          />
                                        </button>
                                      )
                                    }
                                  </BooleanValue>
                                ) : (
                                  <TaskApprovalStatusInput
                                    showUser
                                    editable={editable.approved && editable.rejected}
                                    onClickUser={() => {
                                      setFieldValues({
                                        approvedBy: null,
                                        approvedAt: null,
                                        rejectedBy: null,
                                        rejectedAt: null,
                                      });
                                    }}
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
                            )}
                          </GridColumn>
                        </div>

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
                                required
                                {...inputHandlers}
                                originalValue={originalValues[name]}
                                label={
                                  <FormattedMessage
                                    id="modules.Tasks.approvedDate"
                                    defaultMessage="APPROVED DATE"
                                  />
                                }
                                editable={editable.approved}
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
                                required
                                {...inputHandlers}
                                originalValue={originalValues[name]}
                                label={
                                  <FormattedMessage
                                    id="modules.Tasks.rejectedDate"
                                    defaultMessage="REJECTED DATE"
                                  />
                                }
                                editable={editable.rejected}
                              />
                            )}
                          </FormField>
                        )}
                      </>
                    )}
                  </UserConsumer>
                )}
              </div>
            </div>
          );
        }}
      </Subscribe>
    </SectionWrapper>
  );
};

export default injectIntl(TaskInfoSection);
