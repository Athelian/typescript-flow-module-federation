// @flow

import * as React from 'react';
import type { DraggableProvided } from 'react-beautiful-dnd';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { formatToGraphql, startOfToday } from 'utils/date';
import { getByPathWithDefault } from 'utils/fp';
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
import { ProjectMilestonesContainer } from 'modules/project/form/containers';
import {
  MILESTONE_UPDATE,
  MILESTONE_SET_NAME,
  MILESTONE_SET_DUE_DATE,
  MILESTONE_SET_COMPLETED,
  MILESTONE_SET_TASKS,
  MILESTONE_DELETE,
} from 'modules/permission/constants/milestone';
import {
  TASK_UPDATE,
  TASK_SET_COMPLETED,
  TASK_SET_IN_PROGRESS,
  TASK_SET_SKIPPED,
} from 'modules/permission/constants/task';
import validator from './validator';
import messages from './messages';
import { MilestoneHeaderWrapperStyle, DeleteButtonStyle, TaskRingWrapperStyle } from './style';
import CompleteButton from '../CompleteButton';

type Props = {|
  provided: DraggableProvided,
  milestoneId: string,
  isDragging: boolean,
|};

export default function MilestoneForm({ provided, milestoneId, isDragging }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const { user } = useUser();
  const [hoverRef, isHovered] = useHover();
  // uuid will return '-' so that is the way to detect the milestone is new or from API
  const isNew = milestoneId.includes('-');
  return (
    <Subscribe to={[ProjectMilestonesContainer]}>
      {({
        originalValues,
        state,
        setMilestoneValue,
        excludeTaskIds,
        excludeIds,
        removeMilestone,
        taskCountByMilestone,
        completedMilestone,
      }) => {
        const { milestones = [] } = { ...originalValues, ...state };
        const values = milestones.find(milestone => milestone.id === milestoneId) || {};
        const initialValues =
          (originalValues.milestones || []).find(milestone => milestone.id === milestoneId) || {};

        const onChangeValue = (field, value) => {
          const [id, fieldName] = field.split('.') || [];
          if (id) {
            setMilestoneValue(id, {
              [fieldName]: value,
            });
          }
        };
        return (
          <div
            ref={hoverRef}
            className={MilestoneHeaderWrapperStyle(isDragging)}
            {...provided.dragHandleProps}
          >
            <BooleanValue>
              {({ value: deleteDialogIsOpen, set: dialogToggle }) => (
                <>
                  {hasPermission([MILESTONE_DELETE]) && milestones.length > 1 && (
                    <button
                      className={DeleteButtonStyle(isHovered)}
                      type="button"
                      onClick={() =>
                        getByPathWithDefault([], 'tasks', values).length > 0
                          ? dialogToggle(true)
                          : removeMilestone(milestoneId)
                      }
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

            <FormField
              name={`${milestoneId}.name`}
              initValue={values.name}
              values={values}
              validator={validator}
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
                  inputAlign="left"
                  inputWidth="205px"
                />
              )}
            </FormField>

            <FormField
              name={`${milestoneId}.dueDate`}
              initValue={values.dueDate}
              values={values}
              validator={validator}
              setFieldValue={onChangeValue}
            >
              {({ name, ...inputHandlers }) => (
                <DateInputFactory
                  name={name}
                  {...inputHandlers}
                  isNew={isNew}
                  originalValue={initialValues.dueDate}
                  label={<FormattedMessage {...messages.dueDate} />}
                  editable={hasPermission([MILESTONE_UPDATE, MILESTONE_SET_DUE_DATE])}
                  inputAlign="left"
                  labelWidth="80px"
                  inputWidth="125px"
                />
              )}
            </FormField>

            <BooleanValue>
              {({ value: isDialogOpen, set: dialogToggle }) => (
                <>
                  <CompleteButton
                    editable={hasPermission(MILESTONE_SET_COMPLETED)}
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
                        (hasPermission(TASK_SET_IN_PROGRESS) && hasPermission(TASK_SET_SKIPPED)),
                      complete:
                        hasPermission(TASK_UPDATE) ||
                        (hasPermission(TASK_SET_COMPLETED) && hasPermission(TASK_SET_IN_PROGRESS)),
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
                  {hasPermission([MILESTONE_SET_TASKS]) && (
                    <NewButton
                      label={
                        <FormattedMessage
                          id="modules.Milestones.addTask"
                          defaultMessage="ADD TASK"
                        />
                      }
                      onClick={() => selectTasksSlideToggle(true)}
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
        );
      }}
    </Subscribe>
  );
}
