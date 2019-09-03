// @flow

import * as React from 'react';
import type { DraggableProvided } from 'react-beautiful-dnd';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import emitter from 'utils/emitter';
import { formatToGraphql, startOfToday, differenceInCalendarDays } from 'utils/date';
import { getByPathWithDefault } from 'utils/fp';
import { calculateBindingDate } from 'utils/project';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import useHover from 'hooks/useHover';
import useUser from 'hooks/useUser';
import DeleteDialog from 'components/Dialog/DeleteDialog';
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
import {
  MilestoneHeaderWrapperStyle,
  DeleteButtonStyle,
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
          originalValues,
          originalTasks,
          state,
          setMilestoneValue,
          setDeepFieldValue,
          excludeTaskIds,
          excludeIds,
          removeMilestone,
          taskCountByMilestone,
          completedMilestone,
        }
      ) => {
        const { milestones = [] } = { ...originalValues, ...state };
        const values = milestones.find(milestone => milestone.id === milestoneId) || {};
        const milestoneIndex = milestones.findIndex(milestone => milestone.id === milestoneId);
        const initialValues =
          (originalValues.milestones || []).find(milestone => milestone.id === milestoneId) || {};

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

        const dueDate = values.dueDateBinding
          ? calculateBindingDate(projectInfoState.dueDate, values.dueDateInterval)
          : values.dueDate;

        const completedAtAndDueDateDiff =
          values.completedAt && dueDate
            ? differenceInCalendarDays(new Date(values.completedAt), new Date(dueDate))
            : 0;

        const estComplDate = estimatedCompletionDates[milestoneIndex];
        const estComplDateDiff =
          estComplDate && dueDate
            ? differenceInCalendarDays(new Date(estComplDate), new Date(dueDate))
            : 0;

        return (
          <BooleanValue>
            {({ value: milestoneFormIsOpened, set: toggleMilestoneForm }) => (
              <>
                <SlideView
                  isOpen={milestoneFormIsOpened}
                  onRequestClose={() => toggleMilestoneForm(false)}
                >
                  {milestoneFormIsOpened && (
                    <MilestoneFormSlide
                      milestone={{
                        ...values,
                        project: {
                          milestones,
                          dueDate: projectInfoState.dueDate,
                        },
                      }}
                      onSave={newMilestone => {
                        const { project, ...rest } = newMilestone;
                        setDeepFieldValue(`milestones.${milestoneIndex}`, rest);
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
                    toggleMilestoneForm(true);
                  }}
                >
                  <BooleanValue>
                    {({ value: deleteDialogIsOpen, set: dialogToggle }) => (
                      <>
                        {hasPermission([MILESTONE_DELETE]) && milestones.length > 1 && (
                          <button
                            className={DeleteButtonStyle(isHovered)}
                            type="button"
                            onClick={event => {
                              event.stopPropagation();
                              if (getByPathWithDefault([], 'tasks', values).length > 0) {
                                dialogToggle(true);
                              } else {
                                removeMilestone(milestoneId);
                              }
                            }}
                          >
                            <Icon icon="REMOVE" />
                          </button>
                        )}
                        <DeleteDialog
                          isOpen={deleteDialogIsOpen}
                          onRequestClose={() => dialogToggle(false)}
                          onRemove={() => {
                            removeMilestone(milestoneId);
                            dialogToggle(false);
                          }}
                          onRemoveAll={() => {
                            removeMilestone(milestoneId, true);
                            dialogToggle(false);
                          }}
                          onCancel={() => dialogToggle(false)}
                          onConfirm={() => {
                            dialogToggle(false);
                          }}
                          message={
                            <FormattedMessage
                              id="modules.Projects.removeMilestoneWarningMessage"
                              defaultMessage="There are some Tasks in this Milestone. Would you like to remove them from the Project (and not delete them) or completely delete them along with this Milestone?"
                            />
                          }
                        />
                      </>
                    )}
                  </BooleanValue>

                  <div role="presentation" onClick={e => e.stopPropagation()}>
                    <FormField
                      name={`${milestoneId}.name`}
                      initValue={values.name}
                      values={values}
                      validator={validation}
                      setFieldValue={onChangeValue}
                    >
                      {({ name, ...inputHandlers }) => (
                        <TextInputFactory
                          name={name}
                          {...inputHandlers}
                          isNew={isNew}
                          required
                          originalValue={initialValues.name}
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
                        validator={validation}
                        setFieldValue={onChangeValue}
                      >
                        {({ name, ...inputHandlers }) => (
                          <DateInputFactory
                            name={name}
                            {...inputHandlers}
                            onBlur={evt => {
                              inputHandlers.onBlur(evt);
                              setTimeout(() => {
                                emitter.emit('AUTO_DATE', name, inputHandlers.value);
                              }, 200);
                            }}
                            isNew={isNew}
                            originalValue={initialValues.dueDate}
                            label={<FormattedMessage {...messages.dueDate} />}
                            editable={
                              hasPermission([MILESTONE_UPDATE, MILESTONE_SET_DUE_DATE]) &&
                              !values.dueDateBinding
                            }
                            labelWidth="95px"
                            labelHeight="20px"
                            inputWidth="130px"
                            inputHeight="20px"
                            hideTooltip
                          />
                        )}
                      </FormField>
                      {values.dueDateBinding && (
                        <div className={AutoDateSyncIconStyle}>
                          <Icon icon="SYNC" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div role="presentation" onClick={e => e.stopPropagation()}>
                    {values.completedAt ? (
                      <div className={DateInputWrapperStyle}>
                        <FormField
                          name={`${milestoneId}.completedAt`}
                          initValue={values.completedAt}
                          values={values}
                          validator={validation}
                          setFieldValue={onChangeValue}
                        >
                          {({ name, ...inputHandlers }) => (
                            <DateInputFactory
                              name={name}
                              {...inputHandlers}
                              originalValue={initialValues.completedAt}
                              label={<FormattedMessage {...messages.completed} />}
                              editable={hasPermission([MILESTONE_UPDATE, MILESTONE_SET_COMPLETED])}
                              labelWidth="95px"
                              labelHeight="20px"
                              inputWidth="130px"
                              inputHeight="20px"
                              hideTooltip
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
                          initValue={estComplDate}
                          values={values}
                          validator={validation}
                          setFieldValue={onChangeValue}
                        >
                          {({ name, ...inputHandlers }) => (
                            <DateInputFactory
                              name={name}
                              {...inputHandlers}
                              isNew={isNew}
                              originalValue={initialValues.estimatedCompletionDate}
                              label={<FormattedMessage {...messages.estCompl} />}
                              editable={
                                hasPermission([
                                  MILESTONE_UPDATE,
                                  MILESTONE_SET_ESTIMATED_COMPLETION_DATE,
                                ]) && !values.estimatedCompletionDateBinding
                              }
                              labelWidth="95px"
                              labelHeight="20px"
                              inputWidth="130px"
                              inputHeight="20px"
                              hideTooltip
                            />
                          )}
                        </FormField>
                        {values.estimatedCompletionDateBinding && (
                          <div className={AutoDateSyncIconStyle}>
                            <Icon icon="SYNC" />
                          </div>
                        )}
                        <div className={DiffDateStyle(estComplDateDiff)}>
                          {estComplDateDiff > 0 && '+'}
                          {estComplDateDiff !== 0 && estComplDateDiff}
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
                          completedAt={values.completedAt}
                          completedBy={values.completedBy}
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
                              selectedTasks={values.tasks || []}
                              onSelect={selected => {
                                selectTasksSlideToggle(false);
                                const counter = getByPathWithDefault([], 'tasks', values).length;
                                originalTasks.push(...selected);
                                onChangeValue(`${milestoneId}.tasks`, [
                                  ...getByPathWithDefault([], 'tasks', values),
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
                    <TaskRing tasks={values.tasks || []} />
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
