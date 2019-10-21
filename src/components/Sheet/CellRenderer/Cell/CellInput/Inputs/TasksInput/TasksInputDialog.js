// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider } from 'unstated';
import Dialog from 'components/Dialog';
import { BooleanValue } from 'react-values';
import { recalculateTaskBindingDate } from 'utils/task';
import { SectionNavBar } from 'components/NavBar';
import SlideView from 'components/SlideView';
import { BaseButton, NewButton } from 'components/Buttons';
import { Tooltip } from 'components/Tooltip';
import SelectProjectAndMilestone from 'providers/SelectProjectAndMilestone';
import { DashedPlusButton, Label } from 'components/Form';
import { TemplateCard, GrayCard } from 'components/Cards';
import { FormContainer } from 'modules/form';
import type { TaskPayload, TaskTemplatePayload } from 'generated/graphql';
import Tasks from 'modules/task/common/TaskSection/components/Tasks';
import SelectTaskTemplate from 'modules/task/common/TaskSection/components/SelectTaskTemplate';
import { TasksSectionWrapperStyle, TasksSectionStyle, TemplateItemStyle } from './style';

const formContainer = new FormContainer();

type Props = {
  tasks: Array<TaskPayload>,
  taskTemplate: TaskTemplatePayload,
  onChange: ({
    tasks: Array<TaskPayload>,
    taskTemplate: TaskTemplatePayload,
  }) => void,
  focus: boolean,
  onBlur: () => void,
  entityType: string,
};

const TasksInputDialog = ({ tasks, taskTemplate, onChange, onBlur, focus, entityType }: Props) => {
  // TODO: Maxime said to do dummy permission until he changes it
  const canViewList = true;
  const canViewForm = true;
  const canAddTasks = true;
  const canDeleteTasks = true;
  const canOrderingTasks = true;
  const canUpdateMilestone = true;
  const canUpdateTaskTemplate = true;
  const canViewProjectForm = true;
  const editable = true;

  if (!canViewList) return null;

  return (
    <Provider inject={[formContainer]}>
      <Dialog
        isOpen={focus}
        onRequestClose={() => {
          onBlur();
        }}
      >
        <div className={TasksSectionWrapperStyle}>
          <SectionNavBar>
            {canAddTasks && (
              <NewButton
                label={<FormattedMessage id="modules.Tasks.newTask" />}
                onClick={() => {
                  onChange({
                    taskTemplate,
                    tasks: [
                      ...tasks,
                      {
                        name: `task - ${tasks.length + 1}`,
                        tags: [],
                        assignedTo: [],
                        approvers: [],
                        approvable: false,
                      },
                    ],
                  });
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
                            onChange({
                              taskTemplate,
                              tasks: tasks.map(item => {
                                const latestTask = {
                                  ...item,
                                  milestone: value,
                                };

                                return recalculateTaskBindingDate(latestTask);
                              }),
                            });
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
            {
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
                          entityType={entityType}
                          onCancel={() => slideToggle(false)}
                          onSelect={template => {
                            const nonTemplateTasks = tasks.filter(task => !task.taskTemplate);
                            const templateTasks = template.tasks.map(({ id, ...rest }) => ({
                              ...rest,
                            }));
                            const newTaskList = [...nonTemplateTasks, ...templateTasks];

                            onChange({ taskTemplate: template, tasks: newTaskList });
                            slideToggle(false);
                          }}
                        />
                      )}
                    </SlideView>
                  </>
                )}
              </BooleanValue>
            }

            <Tasks
              // TODO: Replace with real group ids
              groupIds={['123', '456']}
              // TODO: Replace with real parent id
              entityId="123"
              type={entityType}
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
                  onChange({ taskTemplate, tasks: clonedTasks });
                }
              }}
              onRemove={({ id }) => {
                onChange({
                  taskTemplate,
                  tasks: tasks.filter(({ id: itemId }) => id !== itemId),
                });
              }}
              onSave={(index, newValue) => {
                const clonedTasks = [...tasks];
                clonedTasks[index] = newValue;
                onChange({ taskTemplate, tasks: clonedTasks });
              }}
            />
          </div>
        </div>
      </Dialog>
    </Provider>
  );
};

export default TasksInputDialog;
