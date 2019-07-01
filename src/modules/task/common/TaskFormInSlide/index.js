// @flow
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Provider, Subscribe } from 'unstated';
import withCache from 'hoc/withCache';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { FormContainer, resetFormState } from 'modules/form';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon, LogsButton } from 'components/NavBar';
import { SaveButton, ResetButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import Timeline from 'modules/timeline/components/Timeline';
import validator from 'modules/task/form/validator';
import TaskContainer from 'modules/task/form/container';
import TaskForm from 'modules/task/form';
import { taskTimelineQuery } from 'modules/task/query';

type OptionalProps = {
  isInTemplate: boolean,
  isInProject: boolean,
  parentEntity?: string,
};

type Props = OptionalProps & {
  task: Object,
  entity: Object,
  groupIds: Array<string>,
  onSave: Function,
};

const defaultProps = {
  isInTemplate: false,
  isInProject: false,
};

const formContainer = new FormContainer();

const TaskFormInSlide = ({
  groupIds,
  onSave,
  task,
  parentEntity,
  entity,
  isInTemplate,
  isInProject,
}: Props) => {
  useEffect(() => {
    return () => formContainer.onReset();
  });

  return (
    <Provider inject={[formContainer]}>
      <Subscribe to={[TaskContainer]}>
        {taskContainer => (
          <Layout
            navBar={
              <SlideViewNavBar>
                <EntityIcon icon="TASK" color="TASK" />
                <JumpToSection>
                  <SectionTabs
                    link="task_taskSection"
                    label={<FormattedMessage id="modules.Tasks.task" defaultMessage="TASK" />}
                    icon="TASK"
                  />
                </JumpToSection>

                {!task.isNew && (
                  <BooleanValue>
                    {({ value: opened, set: slideToggle }) => (
                      <>
                        <LogsButton onClick={() => slideToggle(true)} />
                        <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                          <Layout
                            navBar={
                              <SlideViewNavBar>
                                <EntityIcon icon="LOGS" color="LOGS" />
                              </SlideViewNavBar>
                            }
                          >
                            {task.id && opened ? (
                              <Timeline
                                query={taskTimelineQuery}
                                queryField="task"
                                variables={{
                                  id: task.id,
                                }}
                                entity={{
                                  taskId: task.id,
                                }}
                              />
                            ) : null}
                          </Layout>
                        </SlideView>
                      </>
                    )}
                  </BooleanValue>
                )}

                {taskContainer.isDirty() && (
                  <>
                    <ResetButton
                      onClick={() => {
                        resetFormState(taskContainer);
                        formContainer.onReset();
                      }}
                    />
                    <SaveButton
                      disabled={!formContainer.isReady(taskContainer.state, validator)}
                      onClick={() => onSave(taskContainer.state)}
                    />
                  </>
                )}
              </SlideViewNavBar>
            }
          >
            <TaskForm
              groupIds={groupIds}
              task={task}
              entity={entity}
              hideParentInfo
              parentEntity={parentEntity}
              isInTemplate={isInTemplate}
              isInProject={isInProject}
              onFormReady={() => taskContainer.initDetailValues(task)}
            />
          </Layout>
        )}
      </Subscribe>
    </Provider>
  );
};

TaskFormInSlide.defaultProps = defaultProps;

export default withCache(TaskFormInSlide, ['task', 'entity', 'groupIds']);
