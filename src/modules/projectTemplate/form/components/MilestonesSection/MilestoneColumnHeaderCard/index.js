// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import useHover from 'hooks/useHover';
import SlideView from 'components/SlideView';
import TaskRing from 'components/TaskRing';
import Icon from 'components/Icon';
import { BaseButton } from 'components/Buttons';
import { FormField } from 'modules/form';
import { FieldItem, Label, Display, TextInputFactory } from 'components/Form';
import ProjectTemplateContainer from 'modules/projectTemplate/form/container';
import MilestoneFormSlide from 'modules/milestone/form/index.slide';
import {
  PROJECT_TEMPLATE_CREATE,
  PROJECT_TEMPLATE_UPDATE,
  PROJECT_TEMPLATE_SET_MILESTONES,
} from 'modules/permission/constants/task';

import validator from './validator';

import {
  MilestoneHeaderWrapperStyle,
  TaskRingWrapperStyle,
  AutoDateSyncIconStyle,
  CompleteButtonStyle,
  DeleteButtonStyle,
} from './style';

type Props = {|
  isDragging: boolean,
  milestoneIndex: number,
  provided: Object,
|};

export default function MilestoneColumnHeaderCard({ milestoneIndex, isDragging, provided }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const [hoverRef, isHovered] = useHover();
  const canCreateOrUpdate = hasPermission([PROJECT_TEMPLATE_CREATE, PROJECT_TEMPLATE_UPDATE]);

  return (
    <Subscribe to={[ProjectTemplateContainer]}>
      {({
        originalValues: { milestones: originalMilestones },
        state: { milestones = [] },
        setFieldValue,
      }) => {
        const milestone = milestones?.[milestoneIndex] ?? {};
        const originalValues = originalMilestones?.[milestoneIndex] ?? {};

        const validation = validator({
          name: `${milestone.id}.name`,
        });

        const values = {
          [`${milestone.id}.name`]: milestone.name,
        };

        return (
          <BooleanValue>
            {({ value: isOpen, set: toggleSlide }) => (
              <>
                <SlideView
                  isOpen={isOpen}
                  onRequestClose={() => toggleSlide(false)}
                  shouldConfirm={() => {
                    const button = document.getElementById('milestone_form_save_button');
                    return button;
                  }}
                >
                  {isOpen && (
                    <MilestoneFormSlide
                      milestone={milestone}
                      onSave={newMilestone => {
                        setFieldValue(`milestones.${milestoneIndex}`, newMilestone);
                        toggleSlide(false);
                      }}
                      inTemplate
                    />
                  )}
                </SlideView>
                <div
                  // FIXME: confirm again
                  ref={hoverRef}
                  className={MilestoneHeaderWrapperStyle(isDragging)}
                  {...provided.dragHandleProps}
                  role="presentation"
                  onClick={() => {
                    // This is using for fixing a edge case when on blur doesn't fire on inline edit for task card
                    if (document.activeElement) document.activeElement.blur();
                    setTimeout(toggleSlide, 200, true);
                  }}
                >
                  {(canCreateOrUpdate || hasPermission(PROJECT_TEMPLATE_SET_MILESTONES)) &&
                    milestones.length > 1 && (
                      <button
                        className={DeleteButtonStyle(isHovered)}
                        type="button"
                        onClick={() => {
                          setFieldValue(
                            'milestones',
                            milestones.filter(item => item.id !== milestone.id)
                          );
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
                      setFieldValue={(field, value) => {
                        setFieldValue(`milestones.${milestoneIndex}.name`, value);
                      }}
                    >
                      {({ name: fieldName, ...inputHandlers }) => (
                        <TextInputFactory
                          name={fieldName}
                          originalValue={originalValues.name}
                          {...inputHandlers}
                          required
                          editable={
                            canCreateOrUpdate || hasPermission(PROJECT_TEMPLATE_SET_MILESTONES)
                          }
                          vertical
                          inputWidth="225px"
                          inputHeight="20px"
                          hideTooltip
                        />
                      )}
                    </FormField>
                  </div>

                  <FieldItem
                    label={
                      <Label>
                        <FormattedMessage
                          id="modules.projectTemplate.dueDate"
                          defaultMessage="Due Date"
                        />
                      </Label>
                    }
                    input={
                      <Display color="GRAY">
                        <FormattedMessage id="common.datePlaceholder" defaultMessage="yyyy/mm/dd" />
                        {milestone.dueDateBinding && (
                          <div className={AutoDateSyncIconStyle}>
                            <Icon icon="BINDED" />
                          </div>
                        )}
                      </Display>
                    }
                  />

                  <FieldItem
                    label={
                      <Label>
                        <FormattedMessage
                          id="modules.projectTemplate.est.compl"
                          defaultMessage="est. compl."
                        />
                      </Label>
                    }
                    input={
                      <Display color="GRAY">
                        <FormattedMessage id="common.datePlaceholder" defaultMessage="yyyy/mm/dd" />
                        {milestone.estimatedCompletionDateBinding && (
                          <div className={AutoDateSyncIconStyle}>
                            <Icon icon="BINDED" />
                          </div>
                        )}
                      </Display>
                    }
                  />

                  <div className={CompleteButtonStyle}>
                    <FormattedMessage
                      id="components.form.unCompleted"
                      defaultMessage="UNCOMPLETED"
                    />
                  </div>

                  <BaseButton
                    icon="ADD"
                    disabled
                    label={
                      <FormattedMessage
                        id="modules.projectTemplate.selectTask"
                        defaultMessage="SELECT TASK"
                      />
                    }
                    backgroundColor="TEAL"
                  />

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
