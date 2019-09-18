// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';

import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';

import SlideView from 'components/SlideView';
import TaskRing from 'components/TaskRing';
import Icon from 'components/Icon';

import { FormField } from 'modules/form';
import { TextInputFactory } from 'components/Form';
import ProjectTemplateContainer from 'modules/projectTemplate/form/container';
import {
  MILESTONE_UPDATE,
  MILESTONE_SET_NAME,
  // MILESTONE_SET_DUE_DATE,
  // MILESTONE_SET_ESTIMATED_COMPLETION_DATE,
  // MILESTONE_SET_COMPLETED,
  // MILESTONE_SET_TASKS,
  MILESTONE_DELETE,
} from 'modules/permission/constants/milestone';
import MilestoneFormSlide from 'modules/milestone/form/index.slide';

import validator from './validator';

// import CompleteButton from '../CompleteButton';
import { MilestoneHeaderWrapperStyle, TaskRingWrapperStyle, DateInputWrapperStyle } from './style';

type Props = {|
  isDragging: boolean,
  milestoneIndex: number,
|};

export default function MilestoneColumnHeaderCard({ milestoneIndex, isDragging }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  return (
    <Subscribe to={[ProjectTemplateContainer]}>
      {({
        originalValues: {
          project: { milestones: originalMilestones },
        },

        state: {
          project: { milestones = [] },
        },
        setMilestoneValue,
      }) => {
        console.debug(milestones);

        const milestone = milestones[milestoneIndex];
        const originalValues = originalMilestones[milestoneIndex] || {};

        const validation = validator({
          name: `${milestone.id}.name`,
        });

        const onChangeValue = (field, value) => {
          const [id, fieldName] = field.split('.') || [];
          if (id) {
            setMilestoneValue(id, {
              [fieldName]: value,
            });
          }
        };

        const values = {
          [`${milestone.id}.name`]: milestone.name,
        };

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
                      milestone={milestone}
                      onSave={() => {
                        console.debug('save milestone');
                        toggleMilestoneForm(false);
                      }}
                    />
                  )}
                </SlideView>
                <div
                  // ref={hoverRef}
                  className={MilestoneHeaderWrapperStyle(isDragging)}
                  role="presentation"
                  onClick={() => {
                    // This is using for fixing a edge case when on blur doesn't fire on inline edit for task card
                    if (document.activeElement) document.activeElement.blur();
                    setTimeout(() => toggleMilestoneForm(true), 200);
                  }}
                >
                  {hasPermission([MILESTONE_DELETE]) && milestones.length > 1 && (
                    <button
                      // className={DeleteButtonStyle(isHovered)}
                      type="button"
                      onClick={() => {
                        console.debug('remove milestone');
                      }}
                    >
                      <Icon icon="REMOVE" />
                    </button>
                  )}

                  <div role="presentation" onClick={e => e.stopPropagation()}>
                    <FormField
                      name={`${milestone.id}.name`}
                      initValue={milestone.name}
                      values={values}
                      validator={validation}
                      setFieldValue={onChangeValue}
                    >
                      {({ name: fieldName, ...inputHandlers }) => (
                        <TextInputFactory
                          name={fieldName}
                          originalValue={originalValues.name}
                          {...inputHandlers}
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
                      {/* due date */}
                      {/* {dueDateBinding && (
                        <div className={AutoDateSyncIconStyle}>
                          <Icon icon="BINDED" />
                        </div>
                      )} */}
                    </div>
                  </div>

                  <div role="presentation" onClick={e => e.stopPropagation()}>
                    <div className={DateInputWrapperStyle}>
                      {/* data */}
                      {/* date binding */}
                      {/* {estimatedCompletionDateBinding && (
                        <div className={AutoDateSyncIconStyle}>
                          <Icon icon="BINDED" />
                        </div>
                      )} */}
                    </div>
                  </div>

                  {/* FIXME: complete button */}
                  {/* select task button */}

                  <div className={TaskRingWrapperStyle}>
                    <TaskRing tasks={[]} />
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
