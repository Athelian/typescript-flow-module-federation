// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Subscribe } from 'unstated';
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
  UserAssignmentInputFactory,
} from 'components/Form';
import { CloneButton } from 'components/Buttons';
import GridColumn from 'components/GridColumn';
import TaskStatusInput from 'components/Form/TaskStatusInput';
import { IN_PROGRESS, COMPLETED } from 'components/Form/TaskStatusInput/constants';
import { encodeId } from 'utils/id';
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

const TaskSection = ({ isNew, task }: Props) => {
  console.log(task);
  return (
    <div className={FormContentWrapperStyle}>
      <SectionWrapper id="task_taskSection">
        <SectionHeader
          icon="TASK"
          label={<FormattedMessage id="modules.task.task" defaultMessage="TASK" />}
        >
          {!isNew && (
            <>
              <LastModified updatedAt={task.updatedAt} updatedBy={task.updatedBy} />
              <CloneButton onClick={() => navigate(`/task/clone/${encodeId(task.id)}`)} />
            </>
          )}
        </SectionHeader>
        <Subscribe to={[TaskContainer]}>
          {({ originalValues, state, setFieldValue }) => {
            const values = { ...originalValues, ...state };
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
                    input={<div>{task.id}</div>}
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
                        isNew={isNew}
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
                        {...inputHandlers}
                        isNew={isNew}
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
                        isNew={isNew}
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
                        isNew={isNew}
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
                        values.completedAt ? (
                          <DefaultStyle type="date" forceHoverStyle>
                            <DateInput
                              onChange={(field, value) => setFieldValue(field, value)}
                              value={values.completedAt}
                            />
                          </DefaultStyle>
                        ) : (
                          <Label>
                            <FormattedMessage
                              id="modules.task.notCompleted"
                              defaultMessage="Not completed yet"
                            />{' '}
                          </Label>
                        )
                      }
                    />

                    <div className={AssignedToStyle}>
                      <GridColumn>
                        <UserAssignmentInputFactory
                          name="assignedTo"
                          required
                          values={values.assignedTo}
                          onChange={(name: string, assignments: Array<Object>) =>
                            setFieldValue(name, assignments)
                          }
                          label={
                            <FormattedMessage
                              id="modules.task.assignedTo"
                              defaultMessage="ASSIGNED TO"
                            />
                          }
                          editable
                        />
                      </GridColumn>
                      <GridColumn>
                        {values.inProgressAt ? (
                          <TaskStatusInput
                            activeUser={values.inProgressBy}
                            status={values.completedAt ? COMPLETED : IN_PROGRESS}
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
