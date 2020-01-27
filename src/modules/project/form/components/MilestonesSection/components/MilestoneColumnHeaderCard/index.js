// @flow
import * as React from 'react';
import type { DraggableProvided } from 'react-beautiful-dnd';
import { Subscribe } from 'unstated';
import { BooleanValue, NumberValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import emitter from 'utils/emitter';
import { formatToGraphql, startOfToday, differenceInCalendarDays } from 'utils/date';
import { isEquals } from 'utils/fp';
import { calculateBindingDate } from 'utils/project';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import useHover from 'hooks/useHover';
import useUser from 'hooks/useUser';
import DeleteDialog from 'components/Dialog/DeleteDialog';
import DocumentsDeleteDialog from 'components/Dialog/DocumentsDeleteDialog';
import CompleteDialog from 'components/Dialog/CompleteDialog';
import SelectTasks from 'providers/SelectTasks';
import SlideView from 'components/SlideView';
import TaskRing from 'components/TaskRing';
import Icon from 'components/Icon';
import { NewButton } from 'components/Buttons';
import { FormField } from 'modules/form';
import { TextInputFactory, DateInputFactory } from 'components/Form';
import { ProjectInfoContainer, ProjectMilestonesContainer } from 'modules/project/form/containers';
import {
  MILESTONE_UPDATE,
  MILESTONE_SET_NAME,
  MILESTONE_SET_DUE_DATE,
  MILESTONE_SET_ESTIMATED_COMPLETION_DATE,
  MILESTONE_SET_COMPLETED,
  MILESTONE_SET_TASKS,
  MILESTONE_DELETE,
} from 'modules/permission/constants/milestone';
import MilestoneFormSlide from 'modules/milestone/form/index.slide';
import {
  TASK_UPDATE,
  TASK_SET_COMPLETED,
  TASK_SET_IN_PROGRESS,
  TASK_SET_SKIPPED,
} from 'modules/permission/constants/task';
import { EstimatedCompletionDateContext } from 'modules/project/form/helpers';
import validator from './validator';
import messages from './messages';
import CompleteButton from '../CompleteButton';
import DeleteButton from './components/DeleteButton';
import {
  MilestoneHeaderWrapperStyle,
  TaskRingWrapperStyle,
  AutoDateSyncIconStyle,
  DateInputWrapperStyle,
  DiffDateStyle,
} from './style';

type Props = {|
  provided: DraggableProvided,
  milestoneId: string,
  isDragging: boolean,
|};

export default function MilestoneColumnHeaderCard({ provided, milestoneId, isDragging }: Props) {
  const estimatedCompletionDates = React.useContext(EstimatedCompletionDateContext);

  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const { user } = useUser();
  const [hoverRef, isHovered] = useHover();
  // uuid will return '-' so that is the way to detect the milestone is new or from API
  const isNew = milestoneId.includes('-');
  return (
    <Subscribe to={[ProjectInfoContainer, ProjectMilestonesContainer]}>
      {(
        { state: projectInfoState },
        {
          originalValues: { milestones: originalMilestones },
          originalTasks,
          state: { milestones = [] },
          setMilestoneValue,
          setDeepFieldValue,
          excludeTaskIds,
          excludeIds,
          removeMilestone,
          setNeedDeletedFiles,
          unsetNeedDeletedFiles,
          taskCountByMilestone,
          completedMilestone,
        }
      ) => {
        const milestoneIndex = milestones.findIndex(milestone => milestone.id === milestoneId);
        const currentMilestone = milestones[milestoneIndex];
        const originalValues = originalMilestones[milestoneIndex] || {};

        const validation = validator({
          name: `${milestoneId}.name`,
        });

        const onChangeValue = (field, value) => {
          const [id, fieldName] = field.split('.') || [];
          if (id) {
            setMilestoneValue(id, {
              [fieldName]: value,
            });
          }
        };
        const {
          name,
          dueDateBinding,
          dueDateInterval,
          dueDate: rawDueDate,
          completedAt,
          completedBy,
          estimatedCompletionDateBinding,
          tasks = [],
          files = [],
        } = currentMilestone;

        const dueDate = dueDateBinding
          ? calculateBindingDate(projectInfoState.dueDate, dueDateInterval)
          : rawDueDate;

        const completedAtAndDueDateDiff =
          completedAt && dueDate
            ? differenceInCalendarDays(new Date(completedAt), new Date(dueDate))
            : 0;

        const estimatedCompletionDate = estimatedCompletionDates[milestoneIndex];
        const estimatedCompletionDateDiff =
          estimatedCompletionDate && dueDate
            ? differenceInCalendarDays(new Date(estimatedCompletionDate), new Date(dueDate))
            : 0;

        const values = {
          [`${milestoneId}.name`]: name,
          [`${milestoneId}.dueDate`]: dueDate,
          [`${milestoneId}.completedAt`]: completedAt,
          [`${milestoneId}.estimatedCompletionDate`]: estimatedCompletionDate,
          ...currentMilestone,
        };

        return (
          <BooleanValue>
            {({ value: milestoneFormIsOpened, set: toggleMilestoneForm }) => (
              <>
                <SlideView
                  isOpen={milestoneFormIsOpened}
                  onRequestClose={() => toggleMilestoneForm(false)}
                  shouldConfirm={() => {
                    const button = document.getElementById('milestone_form_save_button');
                    return button;
                  }}
                >
                  {milestoneFormIsOpened && (
                    <MilestoneFormSlide
                      milestone={{
                        ...currentMilestone,
                        project: {
                          milestones,
                          dueDate: projectInfoState.dueDate,
                        },
                      }}
                      onSave={newMilestone => {
                        const { project, ...rest } = newMilestone;
                        setDeepFieldValue(`milestones.${milestoneIndex}`, rest);
                        setTimeout(() => {
                          emitter.emit('AUTO_DATE', `${rest.id}.dueDate`, rest.dueDate);
                        }, 200);
                        toggleMilestoneForm(false);
                      }}
                    />
                  )}
                </SlideView>
                <div
                  ref={hoverRef}
                  className={MilestoneHeaderWrapperStyle(isDragging)}
                  {...provided.dragHandleProps}
                  role="presentation"
                  onClick={() => {
                    // This is using for fixing a edge case when on blur doesn't fire on inline edit for task card
                    if (document.activeElement) document.activeElement.blur();
                    setTimeout(() => toggleMilestoneForm(true), 200);
                  }}
                >
                  {hasPermission([MILESTONE_DELETE]) && milestones.length > 1 && (
                    <NumberValue defaultValue={0}>
                      {({ value: step, set: setStep }) => {
                        let removeOnTasks = false;
                        const onRemove = (id, withTasks) => {
                          removeMilestone(id, withTasks);
                        };

                        if (step === 0 && tasks.length > 0) {
                          return (
                            <DeleteButton
                              isHovered={isHovered}
                              onClick={() => {
                                setStep(1);
                              }}
                            />
                          );
                        }

                        if (step === 0 && files.length > 0) {
                          return (
                            <DeleteButton
                              isHovered={isHovered}
                              onClick={() => {
                                setStep(2);
                              }}
                            />
                          );
                        }

                        if (step === 1 && tasks.length > 0) {
                          return (
                            <>
                              <DeleteDialog
                                isOpen={step === 1}
                                onRequestClose={() => setStep(0)}
                                onCancel={() => setStep(0)}
                                onRemove={() => {
                                  removeOnTasks = false;
                                  if (files.length > 0) {
                                    setStep(2);
                                  } else {
                                    onRemove(milestoneId, removeOnTasks);
                                    setStep(0);
                                  }
                                }}
                                onRemoveAll={() => {
                                  removeOnTasks = true;
                                  if (files.length > 0) {
                                    setStep(2);
                                  } else {
                                    onRemove(milestoneId, removeOnTasks);
                                    setStep(0);
                                  }
                                }}
                                onConfirm={() => {
                                  if (files.length > 0) {
                                    setStep(2);
                                  } else {
                                    setStep(0);
                                  }
                                }}
                                message={
                                  <FormattedMessage
                                    id="modules.Projects.removeMilestoneWarningMessage"
                                    defaultMessage="There are some Tasks in this Milestone. Would you like to remove them from the Project (and not delete them) or completely delete them along with this Milestone?"
                                  />
                                }
                              />

                              <DeleteButton
                                isHovered={isHovered}
                                onClick={() => {
                                  setStep(2);
                                }}
                              />
                            </>
                          );
                        }

                        if (step === 2 && files.length > 0) {
                          return (
                            <>
                              <DocumentsDeleteDialog
                                isOpen={step === 2}
                                files={files}
                                onCancel={() => setStep(0)}
                                onKeep={needKeepFiles => {
                                  unsetNeedDeletedFiles(needKeepFiles);
                                  onRemove(milestoneId, removeOnTasks);
                                  setStep(0);
                                }}
                                onDelete={needDeletedFiles => {
                                  setNeedDeletedFiles(needDeletedFiles);
                                  onRemove(milestoneId, removeOnTasks);
                                  setStep(0);
                                }}
                              />

                              <DeleteButton
                                isHovered={isHovered}
                                onClick={() => {
                                  setStep(2);
                                }}
                              />
                            </>
                          );
                        }

                        return (
                          <DeleteButton
                            isHovered={isHovered}
                            onClick={() => {
                              setStep(2);
                            }}
                          />
                        );
                      }}
                    </NumberValue>
                  )}
                  <div role="presentation" onClick={e => e.stopPropagation()}>
                    <FormField
                      name={`${milestoneId}.name`}
                      initValue={name}
                      values={values}
                      validator={validation}
                      setFieldValue={onChangeValue}
                    >
                      {({ name: fieldName, ...inputHandlers }) => (
                        <TextInputFactory
                          name={fieldName}
                          originalValue={originalValues.name}
                          {...inputHandlers}
                          isNew={isNew}
                          required
                          editable={hasPermission([MILESTONE_UPDATE, MILESTONE_SET_NAME])}
                          vertical
                          inputWidth="225px"
                          inputHeight="20px"
                        />
                      )}
                    </FormField>
                  </div>
                  <div role="presentation" onClick={e => e.stopPropagation()}>
                    <div className={DateInputWrapperStyle}>
                      <FormField
                        name={`${milestoneId}.dueDate`}
                        initValue={dueDate}
                        values={values}
                      >
                        {({ name: fieldName, onBlur, ...inputHandlers }) => (
                          <DateInputFactory
                            name={fieldName}
                            originalValue={originalValues.dueDate}
                            {...inputHandlers}
                            onBlur={e => {
                              onBlur(e);
                              const value = inputHandlers.value || null;
                              if (!isEquals(value, dueDate)) {
                                onChangeValue(fieldName, value);
                                setTimeout(() => {
                                  emitter.emit('AUTO_DATE', fieldName, value);
                                }, 200);
                              }
                            }}
                            isNew={isNew}
                            label={<FormattedMessage {...messages.dueDate} />}
                            editable={
                              hasPermission([MILESTONE_UPDATE, MILESTONE_SET_DUE_DATE]) &&
                              !dueDateBinding
                            }
                            labelWidth="95px"
                            labelHeight="20px"
                            inputWidth="130px"
                            inputHeight="20px"
                            hideTooltip
                          />
                        )}
                      </FormField>
                      {dueDateBinding && (
                        <div className={AutoDateSyncIconStyle}>
                          <Icon icon="BINDED" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div role="presentation" onClick={e => e.stopPropagation()}>
                    {completedAt ? (
                      <div className={DateInputWrapperStyle}>
                        <FormField
                          name={`${milestoneId}.completedAt`}
                          initValue={completedAt}
                          values={values}
                        >
                          {({ name: fieldName, onBlur, ...inputHandlers }) => (
                            <DateInputFactory
                              name={fieldName}
                              originalValue={originalValues.completedAt}
                              {...inputHandlers}
                              onBlur={e => {
                                onBlur(e);
                                const value = inputHandlers.value || null;
                                if (!isEquals(value, completedAt)) {
                                  onChangeValue(fieldName, value);
                                }
                              }}
                              label={<FormattedMessage {...messages.completed} />}
                              editable={hasPermission([MILESTONE_UPDATE, MILESTONE_SET_COMPLETED])}
                              labelWidth="95px"
                              labelHeight="20px"
                              inputWidth="130px"
                              inputHeight="20px"
                              hideTooltip
                              required
                              diff={completedAtAndDueDateDiff}
                            />
                          )}
                        </FormField>
                        <div className={DiffDateStyle(completedAtAndDueDateDiff)}>
                          {completedAtAndDueDateDiff > 0 && '+'}
                          {completedAtAndDueDateDiff !== 0 && completedAtAndDueDateDiff}
                        </div>
                      </div>
                    ) : (
                      <div className={DateInputWrapperStyle}>
                        <FormField
                          name={`${milestoneId}.estimatedCompletionDate`}
                          initValue={estimatedCompletionDate}
                          values={values}
                        >
                          {({ name: fieldName, onBlur, ...inputHandlers }) => (
                            <DateInputFactory
                              name={fieldName}
                              originalValue={originalValues.estimatedCompletionDate}
                              {...inputHandlers}
                              onBlur={e => {
                                onBlur(e);
                                const value = inputHandlers.value || null;
                                if (!isEquals(value, estimatedCompletionDate)) {
                                  onChangeValue(fieldName, value);
                                }
                              }}
                              isNew={isNew}
                              label={<FormattedMessage {...messages.estCompl} />}
                              editable={
                                hasPermission([
                                  MILESTONE_UPDATE,
                                  MILESTONE_SET_ESTIMATED_COMPLETION_DATE,
                                ]) && !estimatedCompletionDateBinding
                              }
                              labelWidth="95px"
                              labelHeight="20px"
                              inputWidth="130px"
                              inputHeight="20px"
                              hideTooltip
                            />
                          )}
                        </FormField>
                        {estimatedCompletionDateBinding && (
                          <div className={AutoDateSyncIconStyle}>
                            <Icon icon="BINDED" />
                          </div>
                        )}
                        <div className={DiffDateStyle(estimatedCompletionDateDiff)}>
                          {estimatedCompletionDateDiff > 0 && '+'}
                          {estimatedCompletionDateDiff !== 0 && estimatedCompletionDateDiff}
                        </div>
                      </div>
                    )}
                  </div>

                  <BooleanValue>
                    {({ value: isDialogOpen, set: dialogToggle }) => (
                      <>
                        <CompleteButton
                          editable={hasPermission([MILESTONE_UPDATE, MILESTONE_SET_COMPLETED])}
                          onComplete={() => {
                            const { remain, inProgress } = taskCountByMilestone(milestoneId);
                            if (remain + inProgress > 0) {
                              dialogToggle(true);
                            } else {
                              completedMilestone({
                                id: milestoneId,
                                completedBy: user,
                                completedAt: formatToGraphql(startOfToday()),
                                action: 'leaveUnChange',
                              });
                            }
                          }}
                          onUnComplete={() => {
                            completedMilestone({
                              id: milestoneId,
                              completedBy: null,
                              completedAt: null,
                              action: 'leaveUnChange',
                            });
                          }}
                          completedAt={completedAt}
                          completedBy={completedBy}
                        />
                        <CompleteDialog
                          editable={{
                            skip:
                              hasPermission(TASK_UPDATE) ||
                              (hasPermission(TASK_SET_IN_PROGRESS) &&
                                hasPermission(TASK_SET_SKIPPED)),
                            complete:
                              hasPermission(TASK_UPDATE) ||
                              (hasPermission(TASK_SET_COMPLETED) &&
                                hasPermission(TASK_SET_IN_PROGRESS)),
                          }}
                          isOpen={isDialogOpen}
                          onRequestClose={() => dialogToggle(false)}
                          onSkip={() => {
                            dialogToggle(false);
                            completedMilestone({
                              id: milestoneId,
                              completedBy: user,
                              completedAt: formatToGraphql(startOfToday()),
                              action: 'setToSkip',
                            });
                          }}
                          onComplete={() => {
                            dialogToggle(false);
                            completedMilestone({
                              id: milestoneId,
                              completedBy: user,
                              completedAt: formatToGraphql(startOfToday()),
                              action: 'setToComplete',
                            });
                          }}
                          onCancel={() => dialogToggle(false)}
                          onUnChange={() => {
                            dialogToggle(false);
                            completedMilestone({
                              id: milestoneId,
                              completedBy: user,
                              completedAt: formatToGraphql(startOfToday()),
                              action: 'leaveUnChange',
                            });
                          }}
                          message={(() => {
                            const { count, remain, inProgress } = taskCountByMilestone(milestoneId);
                            return (
                              <FormattedMessage
                                id="modules.Projects.completeMilestoneWarningMessage"
                                defaultMessage="There are {numOfTasksUncompletedOrInProgress}/{numOfTotalTasks} that are still Uncompleted or In Progress. Would you like to change their statuses?"
                                values={{
                                  numOfTasksUncompletedOrInProgress: remain + inProgress,
                                  numOfTotalTasks: count,
                                }}
                              />
                            );
                          })()}
                        />
                      </>
                    )}
                  </BooleanValue>
                  <BooleanValue>
                    {({ value: selectTasksIsOpen, set: selectTasksSlideToggle }) => (
                      <>
                        {hasPermission([MILESTONE_UPDATE, MILESTONE_SET_TASKS]) && (
                          <NewButton
                            label={
                              <FormattedMessage
                                id="modules.Milestones.addTask"
                                defaultMessage="SELECT TASK"
                              />
                            }
                            onClick={e => {
                              e.stopPropagation();
                              selectTasksSlideToggle(true);
                            }}
                          />
                        )}
                        <SlideView
                          isOpen={selectTasksIsOpen}
                          onRequestClose={() => selectTasksSlideToggle(false)}
                        >
                          {selectTasksIsOpen && (
                            <SelectTasks
                              filter={{
                                excludeIds: excludeIds(),
                                hasMilestoneExceptIds: excludeTaskIds(),
                              }}
                              selectedTasks={tasks}
                              onSelect={selected => {
                                selectTasksSlideToggle(false);
                                const counter = tasks.length;
                                originalTasks.push(...selected);
                                onChangeValue(`${milestoneId}.tasks`, [
                                  ...tasks,
                                  ...selected.map((task, index) => ({
                                    ...task,
                                    milestoneSort: counter + index,
                                  })),
                                ]);
                              }}
                              onCancel={() => selectTasksSlideToggle(false)}
                            />
                          )}
                        </SlideView>
                      </>
                    )}
                  </BooleanValue>

                  <div className={TaskRingWrapperStyle}>
                    <TaskRing tasks={tasks} />
                  </div>
                </div>
              </>
            )}
          </BooleanValue>
        );
      }}
    </Subscribe>
  );
}
