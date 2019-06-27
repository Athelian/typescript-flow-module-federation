// @flow

import * as React from 'react';
import type { DraggableProvided } from 'react-beautiful-dnd';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import useHover from 'hooks/useHover';
import SelectTasks from 'providers/SelectTasks';
import SlideView from 'components/SlideView';
import TaskRing from 'components/TaskRing';
import Icon from 'components/Icon';
import {
  MilestoneStatusWrapperStyle,
  MilestoneStatusIconStyle,
} from 'components/Cards/MilestoneCard/style';
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
import { MilestoneHeaderWrapperStyle, TrashIconStyle, RingIconStyle } from './style';

type Props = {
  provided: DraggableProvided,
  milestoneId: string,
  isDragging: boolean,
};

export default function MilestoneForm({ provided, milestoneId, isDragging }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const [hoverRef, isHovered] = useHover();
  // uuid will return '-' so that is the way to detect the milestone is new or from API
  const isNew = milestoneId.includes('-');
  return (
    <Subscribe to={[ProjectMilestonesContainer]}>
      {({ originalValues, state, setMilestoneValue, excludeTaskIds }) => {
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
            <div
              className={TrashIconStyle(Boolean(isHovered))}
              role="presentation"
              onClick={console.warn}
            >
              <Icon icon="REMOVE" />
            </div>
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
                  originalValue={initialValues[name]}
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
                  originalValue={initialValues[name]}
                  label={<FormattedMessage {...messages.dueDate} />}
                  editable={hasPermission([MILESTONE_UPDATE, MILESTONE_SET_DUE_DATE])}
                  inputAlign="left"
                  labelWidth="80px"
                  inputWidth="125px"
                />
              )}
            </FormField>

            {/* TODO: Make status clickable w/ dialog */}
            {values.completedAt ? (
              <div className={MilestoneStatusWrapperStyle(true)}>
                <FormattedMessage id="components.cards.completed" defaultMessage="COMPLETED" />
                <div className={MilestoneStatusIconStyle}>
                  <Icon icon="CHECKED" />
                </div>
              </div>
            ) : (
              <div className={MilestoneStatusWrapperStyle(false)}>
                <FormattedMessage id="components.card.unCompleted" defaultMessage="UNCOMPLETED" />
                <div className={MilestoneStatusIconStyle}>
                  <Icon icon="CANCEL" />
                </div>
              </div>
            )}

            <div className={RingIconStyle}>
              <TaskRing tasks={values.tasks || []} />
            </div>

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
                          excludeIds: excludeTaskIds(),
                        }}
                        selectedTasks={values.tasks || []}
                        onSelect={selected => {
                          selectTasksSlideToggle(false);
                          onChangeValue(`${milestoneId}.tasks`, [
                            ...(values.tasks || []),
                            ...selected,
                          ]);
                        }}
                        onCancel={() => selectTasksSlideToggle(false)}
                      />
                    )}
                  </SlideView>
                </>
              )}
            </BooleanValue>
          </div>
        );
      }}
    </Subscribe>
  );
}
