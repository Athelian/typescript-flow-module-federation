// @flow

import * as React from 'react';
import type { DraggableProvided } from 'react-beautiful-dnd';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import Icon from 'components/Icon';
import {
  MilestoneStatusWrapperStyle,
  MilestoneStatusIconStyle,
} from 'components/Cards/MilestoneCard/style';
import GridColumn from 'components/GridColumn';
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
import { WrapperStyle } from './style';

type Props = {
  provided: DraggableProvided,
  milestoneId: string,
  isDragging: boolean,
};

export default function MilestoneForm({ provided, milestoneId, isDragging }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  // uuid will return '-' so that is the way to detect the milestone is new or from API
  const isNew = milestoneId.includes('-');
  return (
    <Subscribe to={[ProjectMilestonesContainer]}>
      {({ originalValues, state, setMilestoneValue }) => {
        const { milestones = [] } = { ...originalValues, ...state };
        const values = milestones.find(milestone => milestone.id === milestoneId) || {};
        const initialValues =
          (originalValues.milestones || []).find(milestone => milestone.id === milestoneId) || {};

        const onChangeValue = (field, value) => {
          setMilestoneValue(milestoneId, {
            [field]: value,
          });
        };
        return (
          <div className={WrapperStyle(isDragging)} {...provided.dragHandleProps}>
            <GridColumn>
              <FormField
                name="name"
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
                    label={<FormattedMessage {...messages.name} />}
                    editable={hasPermission([MILESTONE_UPDATE, MILESTONE_SET_NAME])}
                    vertical
                    inputAlign="left"
                  />
                )}
              </FormField>
              <FormField
                name="dueDate"
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
                    vertical
                    inputAlign="left"
                  />
                )}
              </FormField>
              {values.completedAt ? (
                <>
                  <div className={MilestoneStatusWrapperStyle(true)}>
                    <FormattedMessage id="components.cards.completed" defaultMessage="COMPLETED" />
                    <div className={MilestoneStatusIconStyle}>
                      <Icon icon="CHECKED" />
                    </div>
                  </div>
                </>
              ) : (
                <div className={MilestoneStatusWrapperStyle(false)}>
                  <FormattedMessage id="components.card.unCompleted" defaultMessage="UNCOMPLETED" />
                  <div className={MilestoneStatusIconStyle}>
                    <Icon icon="CANCEL" />
                  </div>
                </div>
              )}
              <NewButton
                label={
                  <FormattedMessage id="modules.Milestones.addTask" defaultMessage="ADD TASK" />
                }
              />
            </GridColumn>
          </div>
        );
      }}
    </Subscribe>
  );
}
