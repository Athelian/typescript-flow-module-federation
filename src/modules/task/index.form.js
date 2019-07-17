// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Mutation } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { Provider, Subscribe } from 'unstated';
import { showToastError } from 'utils/errors';
import { FormContainer, resetFormState } from 'modules/form';
import { decodeId } from 'utils/id';
import { getByPath } from 'utils/fp';
import { parseGroupIds } from 'utils/task';
import { removeTypename } from 'utils/data';
import { Content, SlideViewLayout } from 'components/Layout';
import SlideView from 'components/SlideView';
import Portal from 'components/Portal';
import { ExportButton, ResetButton, SaveButton } from 'components/Buttons';
import { EntityIcon, LogsButton, SlideViewNavBar } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { QueryForm } from 'components/common';
import Timeline from 'modules/timeline/components/Timeline';
import { taskFormQuery } from './form/query';
import TaskForm from './form';
import TaskContainer from './form/container';
import validator from './form/validator';
import { updateTaskMutation, prepareParsedTaskInput } from './form/mutation';
import { taskTimelineQuery, taskExportQuery } from './query';

type OptionalProps = {
  path: string,
  taskId: string,
};

type Props = OptionalProps & { intl: IntlShape };

const defaultProps = {
  taskId: '',
};

class TaskFormModule extends React.Component<Props> {
  static defaultProps = defaultProps;

  onReset = (taskContainer: Object, formReset: Function) => {
    resetFormState(taskContainer);
    formReset();
  };

  onSave = async (
    formData: Object,
    saveTask: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { taskId } = this.props;

    const input = prepareParsedTaskInput(
      removeTypename(formData.originalValues),
      removeTypename(formData.state)
    );

    if (taskId) {
      const { data } = await saveTask({ variables: { input, id: decodeId(taskId) } });
      const {
        taskUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess(getByPath('taskUpdate', data));
      }
    }
  };

  onMutationCompleted = (result: Object) => {
    const { intl } = this.props;
    showToastError({ result, intl, entity: 'task' });
  };

  render() {
    const { taskId } = this.props;

    let mutationKey = {};
    if (taskId) {
      mutationKey = { key: decodeId(taskId) };
    }

    return (
      <Provider>
        <Mutation
          mutation={updateTaskMutation}
          onCompleted={this.onMutationCompleted}
          {...mutationKey}
        >
          {(saveTask, { loading: isLoading, error }) => (
            <Subscribe to={[TaskContainer, FormContainer]}>
              {({ initDetailValues, originalValues, state, isDirty }, form) => {
                return (
                  <>
                    <Portal>
                      <EntityIcon icon="TASK" color="TASK" />
                      <JumpToSection>
                        <SectionTabs
                          link="task_taskSection"
                          label={<FormattedMessage id="modules.Tasks.task" defaultMessage="TASK" />}
                          icon="TASK"
                        />
                      </JumpToSection>

                      <BooleanValue>
                        {({ value: opened, set: slideToggle }) => (
                          <>
                            <LogsButton onClick={() => slideToggle(true)} />
                            <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                              <SlideViewLayout>
                                {taskId && opened && (
                                  <>
                                    <SlideViewNavBar>
                                      <EntityIcon icon="LOGS" color="LOGS" />
                                    </SlideViewNavBar>

                                    <Content>
                                      <Timeline
                                        query={taskTimelineQuery}
                                        queryField="task"
                                        variables={{
                                          id: decodeId(taskId),
                                        }}
                                        entity={{
                                          taskId: decodeId(taskId),
                                        }}
                                      />
                                    </Content>
                                  </>
                                )}
                              </SlideViewLayout>
                            </SlideView>
                          </>
                        )}
                      </BooleanValue>

                      {isDirty() && (
                        <>
                          <ResetButton
                            onClick={() =>
                              this.onReset(
                                {
                                  initDetailValues,
                                  originalValues,
                                },
                                form.onReset
                              )
                            }
                          />
                          <SaveButton
                            disabled={!form.isReady(state, validator)}
                            isLoading={isLoading}
                            onClick={() =>
                              this.onSave(
                                { originalValues, state },
                                saveTask,
                                responseData => {
                                  initDetailValues(responseData);
                                  form.onReset();
                                },
                                form.onErrors
                              )
                            }
                          />
                        </>
                      )}
                      {taskId && !isDirty() && (
                        <ExportButton
                          type="Task"
                          exportQuery={taskExportQuery}
                          variables={{ id: decodeId(taskId) }}
                        />
                      )}
                    </Portal>
                    <Content>
                      {error && <p>Error: Please try again.</p>}
                      <QueryForm
                        query={taskFormQuery}
                        entityId={taskId}
                        entityType="task"
                        render={task => (
                          <TaskForm
                            inParentEntityForm={false}
                            groupIds={parseGroupIds(task)}
                            task={task}
                            onFormReady={() => initDetailValues(task)}
                          />
                        )}
                      />
                    </Content>
                  </>
                );
              }}
            </Subscribe>
          )}
        </Mutation>
      </Provider>
    );
  }
}

export default injectIntl(TaskFormModule);
