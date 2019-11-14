// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { lowerFirst } from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { recalculateTaskBindingDate, getConfig } from 'utils/task';
import { SectionNavBar } from 'components/NavBar';
import SlideView from 'components/SlideView';
import { BaseButton, NewButton } from 'components/Buttons';
import { Tooltip } from 'components/Tooltip';
import SelectProjectAndMilestone from 'providers/SelectProjectAndMilestone';
import { SectionWrapper, SectionHeader, DashedPlusButton, Label } from 'components/Form';
import { TemplateCard, GrayCard } from 'components/Cards';
import FormattedNumber from 'components/FormattedNumber';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { PROJECT_FORM } from 'modules/permission/constants/project';
import { FormContainer } from 'modules/form';
import messages from 'modules/task/messages';
import { TasksSectionWrapperStyle, TasksSectionStyle, TemplateItemStyle } from './style';
import Tasks from './components/Tasks';
import SelectTaskTemplate from './components/SelectTaskTemplate';

export type CompatibleEntityTypes =
  | 'Batch'
  | 'Order'
  | 'OrderItem'
  | 'Product'
  | 'ProductProvider'
  | 'Shipment';

type Props = {
  type: CompatibleEntityTypes,
  intl: IntlShape,
  entityId: string,
  groupIds: Array<string>,
};

function TaskSection({ type, entityId, intl, groupIds }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const canViewProjectForm = hasPermission(PROJECT_FORM);

  const {
    canViewList,
    canViewForm,
    canAddTasks,
    canDeleteTasks,
    canOrderingTasks,
    canUpdateMilestone,
    canUpdateTaskTemplate,
    tasksContainer,
    editable,
  } = getConfig(type, hasPermission);

  if (!canViewList) return null;

  return (
    <Subscribe to={[tasksContainer, FormContainer]}>
      {(
        {
          state: {
            todo: { tasks, taskTemplate, milestone },
          },
          setFieldValue,
          applyTemplate,
        },
        { setFieldTouched }
      ) => (
        <SectionWrapper id={`${lowerFirst(type)}_taskSection`}>
          <SectionHeader
            icon="TASK"
            title={
              <>
                <FormattedMessage id="modules.Tasks.tasks" defaultMessage="TASKS" />
                &nbsp;(
                <FormattedNumber value={tasks.length} />)
              </>
            }
          />
          <div className={TasksSectionWrapperStyle}>
            <SectionNavBar>
              {canAddTasks && (
                <NewButton
                  label={intl.formatMessage(messages.newTask)}
                  onClick={() => {
                    setFieldValue('todo.tasks', [
                      ...tasks,
                      injectUid({
                        isNew: true,
                        name: `task - ${tasks.length + 1}`,
                        tags: [],
                        assignedTo: [],
                        approvers: [],
                        approvable: false,
                        milestone,
                      }),
                    ]);
                    setFieldTouched('tasks');
                  }}
                />
              )}

              {canUpdateMilestone && (
                <BooleanValue>
                  {({ value: isOpen, set: toggleSlide }) => (
                    <>
                      <Tooltip
                        message={
                          <FormattedMessage
                            id="modules.task.placeAllTasksInAProject"
                            defaultMessage="Place all Tasks in a Project"
                          />
                        }
                      >
                        <div>
                          <BaseButton
                            icon="PROJECT"
                            label={
                              <FormattedMessage
                                id="modules.task.setToProject"
                                defaultMessage="SET TO PROJECT"
                              />
                            }
                            onClick={() => toggleSlide(true)}
                          />
                        </div>
                      </Tooltip>
                      <SlideView isOpen={isOpen} onRequestClose={() => toggleSlide(false)}>
                        {isOpen && (
                          <SelectProjectAndMilestone
                            cacheKey="TaskInfoSectionSelectProjectAndMilestone"
                            saveButtonMessage={
                              <FormattedMessage id="modules.task.apply" defaultMessage="APPLY" />
                            }
                            onSelect={value => {
                              setFieldValue(
                                'todo.tasks',
                                tasks.map(item => {
                                  const latestTask = {
                                    ...item,
                                    milestone: value,
                                  };

                                  return recalculateTaskBindingDate(latestTask);
                                })
                              );
                              setFieldTouched('tasks');
                              toggleSlide(false);
                            }}
                            onCancel={() => toggleSlide(false)}
                          />
                        )}
                      </SlideView>
                    </>
                  )}
                </BooleanValue>
              )}
            </SectionNavBar>

            <div className={TasksSectionStyle}>
              <BooleanValue>
                {({ value: opened, set: slideToggle }) => (
                  <>
                    <div className={TemplateItemStyle}>
                      <Label height="30px">
                        <FormattedMessage id="modules.Tasks.template" defaultMessage="TEMPLATE" />
                      </Label>
                      {taskTemplate ? (
                        <TemplateCard
                          type="TASK"
                          template={{
                            id: taskTemplate.id,
                            title: taskTemplate.name,
                            description: taskTemplate.description,
                            count: taskTemplate.tasks && taskTemplate.tasks.length,
                          }}
                          onClick={() => {
                            if (canUpdateTaskTemplate) {
                              slideToggle(true);
                            }
                          }}
                          readOnly={!canUpdateTaskTemplate}
                        />
                      ) : (
                        <>
                          {canUpdateTaskTemplate ? (
                            <DashedPlusButton
                              width="195px"
                              height="125px"
                              onClick={() => slideToggle(true)}
                            />
                          ) : (
                            <GrayCard width="195px" height="125px" />
                          )}
                        </>
                      )}
                    </div>

                    <SlideView
                      isOpen={opened}
                      onRequestClose={() => slideToggle(false)}
                      shouldConfirm={() => {
                        const button = document.getElementById('select_task_template_apply_button');
                        return button;
                      }}
                    >
                      {opened && (
                        <SelectTaskTemplate
                          cacheKey={`${type}SelectTaskTemplate`}
                          entityType={type}
                          onCancel={() => slideToggle(false)}
                          onSelect={newValue => {
                            slideToggle(false);
                            applyTemplate(newValue);
                          }}
                        />
                      )}
                    </SlideView>
                  </>
                )}
              </BooleanValue>
              <Tasks
                groupIds={groupIds}
                entityId={entityId}
                type={type}
                editable={editable}
                navigable={{ project: canViewProjectForm }}
                sortable={canOrderingTasks}
                viewForm={canViewForm}
                removable={canDeleteTasks}
                tasks={tasks}
                onSwap={(index: number, direction: 'left' | 'right') => {
                  const nextIndex = direction === 'left' ? index - 1 : index + 1;

                  if (nextIndex > -1 && nextIndex < tasks.length) {
                    const clonedTasks = [...tasks];
                    clonedTasks[nextIndex] = { ...tasks[index] };
                    clonedTasks[index] = { ...tasks[nextIndex] };
                    setFieldValue('todo.tasks', clonedTasks);
                    setFieldTouched(`tasks.${index}`);
                    setFieldTouched(`tasks.${nextIndex}`);
                  }
                }}
                onRemove={({ id }) => {
                  setFieldValue(
                    'todo.tasks',
                    tasks.filter(({ id: itemId }) => id !== itemId)
                  );
                  setFieldTouched(`tasks.${id}`);
                }}
                onSave={(index, newValue) => {
                  setFieldValue(`todo.tasks.${index}`, newValue);
                }}
              />
            </div>
          </div>
        </SectionWrapper>
      )}
    </Subscribe>
  );
}

export default injectIntl(TaskSection);
