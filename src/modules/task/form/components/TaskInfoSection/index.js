// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { isBefore } from 'date-fns';
import { ObjectValue } from 'react-values';
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
  ToggleInput,
  ApproveRejectMenu,
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
  TaskFormWrapperStyle,
  TaskSectionWrapperStyle,
  MainFieldsWrapperStyle,
  MemoWrapperStyle,
  TaskStatusWrapperStyle,
  AssignedToStyle,
  ApprovalToggleWrapperStyle,
} from './style';

type OptionalProps = {
  isInTemplate: boolean,
  hideParentInfo: boolean,
};

type Props = OptionalProps & {
  task: Object,
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

const TaskInfoSection = ({ task, isInTemplate, hideParentInfo }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const editable = hasPermission(TASK_UPDATE);

  // TODO: Remove this hardcoding
  const FAKE_USER = { id: 'fake', firstName: 'kevin', lastName: 'nguyen' };
  const FAKE_APPROVED = false;
  const FAKE_REJECTED = false;

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
          {({ originalValues, state, setFieldValue }, { setFieldTouched }) => {
            const values = { ...originalValues, ...state };
            const { status, activeUser } = getStatusState(values);

            return (
              <div className={TaskSectionWrapperStyle}>
                {!hideParentInfo && getByPath('entity.__typename', task) === 'Shipment' && (
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

                    {isInTemplate ? (
                      <FieldItem
                        label={
                          <Label>
                            <FormattedMessage
                              id="modules.Tasks.dueDate"
                              defaultMessage="DUE DATE"
                            />
                          </Label>
                        }
                        input={
                          <Display color="GRAY_LIGHT">
                            <FormattedMessage
                              id="modules.Tasks.datePlaceholder"
                              defaultMessage="yyyy/mm/dd"
                            />
                          </Display>
                        }
                      />
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
                              isBefore(new Date(values.dueDate), new Date()) && status !== COMPLETED
                                ? 'RED'
                                : null
                            }
                            {...inputHandlers}
                            originalValue={originalValues[name]}
                            label={
                              <FormattedMessage
                                id="modules.Tasks.dueDate"
                                defaultMessage="DUE DATE"
                              />
                            }
                            editable={editable}
                          />
                        )}
                      </FormField>
                    )}

                    {isInTemplate ? (
                      <FieldItem
                        label={
                          <Label>
                            <FormattedMessage
                              id="modules.Tasks.startDate"
                              defaultMessage="START DATE"
                            />
                          </Label>
                        }
                        input={
                          <Display color="GRAY_LIGHT">
                            <FormattedMessage
                              id="modules.Tasks.datePlaceholder"
                              defaultMessage="yyyy/mm/dd"
                            />
                          </Display>
                        }
                      />
                    ) : (
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
                    )}

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

                  <GridColumn>
                    {!hideParentInfo && getByPath('entity.__typename', task) === 'Order' && (
                      <FieldItem
                        label={
                          <Label>
                            <FormattedMessage id="modules.Tasks.order" defaultMessage="ORDER" />
                          </Label>
                        }
                        vertical
                        input={<OrderCard order={task.entity} />}
                      />
                    )}

                    {!hideParentInfo && getByPath('entity.__typename', task) === 'Batch' && (
                      <FieldItem
                        label={
                          <Label>
                            <FormattedMessage id="modules.Tasks.batch" defaultMessage="BATCH" />
                          </Label>
                        }
                        vertical
                        input={<BatchCard batch={task.entity} />}
                      />
                    )}
                  </GridColumn>
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
                                  setFieldValue('inProgressBy', user);
                                  setFieldValue('inProgressAt', new Date());
                                  setFieldTouched('inProgressBy');
                                  setFieldTouched('inProgressAt');
                                }
                          }
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
                    {/* TODO: Connect api logic */}
                    <ToggleInput />
                  </div>

                  <ObjectValue>
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
                          /* TODO: Connect api logic */
                          input={
                            <TaskAssignmentInput
                              users={[FAKE_USER]}
                              onChange={() => {}}
                              activeUserId="fake"
                              onActivateUser={
                                isInTemplate
                                  ? null
                                  : user => {
                                      setUserChosen(user);
                                    }
                              }
                              onDeactivateUser={() => {
                                setUserChosen(null);
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
                                {userChosen ? (
                                  <>
                                    {!FAKE_APPROVED && !FAKE_REJECTED ? (
                                      <ApproveRejectMenu />
                                    ) : (
                                      <div>wip</div>
                                    )}
                                  </>
                                ) : (
                                  <Display color="GRAY_DARK">
                                    <FormattedMessage
                                      id="modules.Tasks.chooseUserForApproval"
                                      defaultMessage="Please choose a user to start the approval"
                                    />
                                  </Display>
                                )}
                              </>
                            )
                          }
                        />
                      </div>
                    )}
                  </ObjectValue>
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

export default TaskInfoSection;
