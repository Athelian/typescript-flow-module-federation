// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { isBefore } from 'date-fns';
import { getByPath } from 'utils/fp';
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
  DateInput,
  DefaultStyle,
  TaskAssignmentInput,
  Display,
} from 'components/Form';
import GridColumn from 'components/GridColumn';
import TaskStatusInput from 'components/Form/TaskStatusInput';
import { COMPLETED, IN_PROGRESS } from 'components/Form/TaskStatusInput/constants';
import { FormField } from 'modules/form';
import TaskContainer from 'modules/task/form/container';
import validator from 'modules/task/form/validator';
import {
  FormContentWrapperStyle,
  CommonSectionWrapperStyle,
  // DescriptionLabelWrapperStyle,
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
  return (
    <div className={FormContentWrapperStyle}>
      <SectionWrapper id="task_taskSection">
        <SectionHeader
          icon="TASK"
          title={<FormattedMessage id="modules.task.task" defaultMessage="TASK" />}
        >
          <LastModified updatedAt={task.updatedAt} updatedBy={task.updatedBy} />
        </SectionHeader>
        <Subscribe to={[TaskContainer]}>
          {({ originalValues, state, setFieldValue }) => {
            const values = { ...originalValues, ...state };
            const { status, activeUser } = getStatusState(values);
            return (
              <div className={CommonSectionWrapperStyle}>
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

                  <FieldItem
                    label={
                      <Label>
                        <FormattedMessage id="modules.task.taskNo" defaultMessage="TASK No." />
                      </Label>
                    }
                    input={<Display>{parseInt(task.sort, 10) + 1}</Display>}
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
                        label={<FormattedMessage id="modules.Tags.name" defaultMessage="NAME" />}
                        required
                        {...inputHandlers}
                        originalValue={originalValues[name]}
                        editable
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
                            ? 'red'
                            : null
                        }
                        {...inputHandlers}
                        originalValue={originalValues[name]}
                        label={
                          <FormattedMessage id="modules.task.dueDate" defaultMessage="DUE DATE" />
                        }
                        editable
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
                            id="modules.task.startDate"
                            defaultMessage="START DATE"
                          />
                        }
                        editable
                      />
                    )}
                  </FormField>

                  {/* <FormField
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
                        isNew={isNew}
                        originalValue={originalValues[name]}
                        label={
                          <div className={DescriptionLabelWrapperStyle}>
                            <FormattedMessage
                              id="modules.Tags.description"
                              defaultMessage="DESCRIPTION"
                            />
                          </div>
                        }
                        inputHeight="100px"
                        inputWidth="200px"
                        inputAlign="right"
                        vertical={false}
                        editable
                      />
                    )}
                  </FormField> */}

                  <FieldItem
                    vertical
                    label={
                      <Label>
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
                          set: true,
                          remove: true,
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
                        label={<FormattedMessage id="modules.task.memo" defaultMessage="MEMO" />}
                        vertical
                        inputWidth="680px"
                        inputHeight="65px"
                        editable
                      />
                    )}
                  </FormField>

                  <div>
                    <FieldItem
                      label={
                        <Label>
                          <FormattedMessage
                            id="modules.task.completedAt"
                            defaultMessage="COMPLETE DATE"
                          />
                        </Label>
                      }
                      input={
                        status === COMPLETED ? (
                          <DefaultStyle type="date" forceHoverStyle>
                            <DateInput
                              onChange={e => setFieldValue('completedAt', e.target.value)}
                              value={values.completedAt}
                            />
                          </DefaultStyle>
                        ) : (
                          <Label>
                            <FormattedMessage
                              id="modules.task.notCompleted"
                              defaultMessage="Not completed yet"
                            />
                          </Label>
                        )
                      }
                    />
                    <div className={AssignedToStyle}>
                      <GridColumn>
                        <FieldItem
                          vertical
                          label={
                            <Label>
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
                              }}
                              onDeactivateUser={() => {
                                if (status === COMPLETED) {
                                  setFieldValue('completedBy', null);
                                  setFieldValue('completedAt', null);
                                } else if (status === IN_PROGRESS) {
                                  setFieldValue('inProgressBy', null);
                                  setFieldValue('inProgressAt', null);
                                }
                              }}
                              editable
                            />
                          }
                        />
                      </GridColumn>
                      <GridColumn>
                        {activeUser ? (
                          <TaskStatusInput
                            activeUser={activeUser}
                            status={status}
                            onClick={() => {
                              setFieldValue('completedBy', activeUser);
                            }}
                            editable
                          />
                        ) : (
                          <Label>
                            <FormattedMessage
                              id="modules.task.chooseUser"
                              defaultMessage="Please choose a user to start the task"
                            />
                          </Label>
                        )}
                      </GridColumn>
                    </div>
                  </div>
                </GridColumn>
              </div>
            );
          }}
        </Subscribe>
      </SectionWrapper>
    </div>
  );
};
export default TaskSection;
