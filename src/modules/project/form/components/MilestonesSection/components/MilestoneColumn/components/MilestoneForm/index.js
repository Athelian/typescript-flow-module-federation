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
} from 'modules/permission/constants/milestone';
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
                  {/* TODO: Add Permissions */}
                  {milestones.length > 1 && (
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

            <CompleteButton
              onComplete={() => {
                onChangeValue(`${milestoneId}.completedAt`, formatToGraphql(startOfToday()));
                onChangeValue(`${milestoneId}.completedBy`, user);
              }}
              onUncomplete={() => {
                onChangeValue(`${milestoneId}.completedAt`, null);
                onChangeValue(`${milestoneId}.completedBy`, null);
              }}
              completedAt={values.completedAt}
              completedBy={values.completedBy}
            />

            {/* TODO: Add Permissions */}
            <BooleanValue>
              {({ value: selectTasksIsOpen, set: selectTasksSlideToggle }) => (
                <>
                  <NewButton
                    label={
                      <FormattedMessage id="modules.Milestones.addTask" defaultMessage="ADD TASK" />
                    }
                    onClick={() => selectTasksSlideToggle(true)}
                  />
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
