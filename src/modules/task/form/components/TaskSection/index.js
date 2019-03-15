// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { isBefore } from 'date-fns';
import { getByPath } from 'utils/fp';
import { formatToGraphql, startOfToday } from 'utils/date';
import { ShipmentCard, OrderCard, BatchCard } from 'components/Cards';
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
} from 'components/Form';
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
  TaskSectionWrapperStyle,
  MainFieldsWrapperStyle,
  MemoWrapperStyle,
  TaskStatusWrapperStyle,
  AssignedToStyle,
} from './style';

type Props = {
  isNew?: boolean,
  task: Object,
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

const TaskSection = ({ task }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const editable = hasPermission(TASK_UPDATE);
  return (
    <SectionWrapper id="task_taskSection">
      <SectionHeader
        icon="TASK"
        title={<FormattedMessage id="modules.task.task" defaultMessage="TASK" />}
      >
        <LastModified updatedAt={task.updatedAt} updatedBy={task.updatedBy} />
      </SectionHeader>
      <Subscribe to={[TaskContainer, FormContainer]}>
        {({ originalValues, state, setFieldValue }, { setFieldTouched }) => {
          const values = { ...originalValues, ...state };
          const { status, activeUser } = getStatusState(values);

          return (
            <div className={TaskSectionWrapperStyle}>
              {getByPath('entity.__typename', task) === 'Shipment' && (
                <FieldItem
                  label={
                    <Label>
                      <FormattedMessage id="modules.task.shipment" defaultMessage="SHIPMENT" />
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
                        <FormattedMessage id="modules.task.taskNo" defaultMessage="TASK No." />
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
                          isBefore(new Date(values.dueDate), new Date()) && status !== COMPLETED
                            ? 'RED'
                            : null
                        }
                        {...inputHandlers}
                        originalValue={originalValues[name]}
                        label={
                          <FormattedMessage id="modules.Tasks.dueDate" defaultMessage="DUE DATE" />
                        }
                        editable={editable}
                      />
                    )}
                  </FormField>

                  <FormField
                    name="startDate"
                    initValue={values.startDate}
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
                            id="modules.Tasks.startDate"
                            defaultMessage="START DATE"
                          />
                        }
                        editable={editable}
                      />
                    )}
                  </FormField>

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
                        <FormattedMessage id="modules.task.tags" defaultMessage="TAGS" />
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

                <GridColumn>
                  {getByPath('entity.__typename', task) === 'Order' && (
                    <FieldItem
                      label={
                        <Label>
                          <FormattedMessage id="modules.task.order" defaultMessage="ORDER" />
                        </Label>
                      }
                      vertical
                      input={<OrderCard order={task.entity} />}
                    />
                  )}

                  {getByPath('entity.__typename', task) === 'Batch' && (
                    <FieldItem
                      label={
                        <Label>
                          <FormattedMessage id="modules.task.batch" defaultMessage="BATCH" />
                        </Label>
                      }
                      vertical
                      input={<BatchCard batch={task.entity} />}
                    />
                  )}
                </GridColumn>
              </div>

              <div className={MemoWrapperStyle}>
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
                      label={<FormattedMessage id="modules.task.memo" defaultMessage="MEMO" />}
                      vertical
                      inputWidth="680px"
                      inputHeight="65px"
                      editable={editable}
                    />
                  )}
                </FormField>
              </div>

              <div className={TaskStatusWrapperStyle}>
                <div className={AssignedToStyle}>
                  <FieldItem
                    vertical
                    label={
                      <Label height="30px">
                        <FormattedMessage
                          id="modules.task.assignedTo"
                          defaultMessage="ASSIGNED TO"
                        />
                      </Label>
                    }
                    input={
                      <TaskAssignmentInput
                        users={values.assignedTo}
                        onChange={newAssignedTo => setFieldValue('assignedTo', newAssignedTo)}
                        activeUserId={activeUser && activeUser.id}
                        onActivateUser={user => {
                          setFieldValue('inProgressBy', user);
                          setFieldValue('inProgressAt', new Date());
                          setFieldTouched('inProgressBy');
                          setFieldTouched('inProgressAt');
                        }}
                        onDeactivateUser={() => {
                          if (status === COMPLETED) {
                            setFieldValue('completedBy', null);
                            setFieldValue('completedAt', null);
                            setFieldTouched('completedBy');
                            setFieldTouched('completedBy');
                          } else if (status === IN_PROGRESS) {
                            setFieldValue('inProgressBy', null);
                            setFieldValue('inProgressAt', null);
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
                      activeUser ? (
                        <TaskStatusInput
                          activeUser={activeUser}
                          status={status}
                          onClick={() => {
                            setFieldValue('completedBy', activeUser);
                            setFieldValue('completedAt', formatToGraphql(startOfToday()));
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
              </div>
            </div>
          );
        }}
      </Subscribe>
    </SectionWrapper>
  );
};
export default TaskSection;
