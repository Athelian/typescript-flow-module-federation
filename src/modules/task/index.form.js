// @flow
import * as React from 'react';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import { Mutation } from 'react-apollo';
import { Provider, Subscribe } from 'unstated';
import { UIConsumer } from 'modules/ui';
import { FormContainer, resetFormState } from 'modules/form';
import { decodeId } from 'utils/id';
import Layout from 'components/Layout';
import { ResetButton, SaveButton } from 'components/Buttons';
import NavBar, { EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { QueryForm } from 'components/common';
import { taskFormQuery } from './form/query';
import TaskForm from './form';
import TaskContainer from './form/container';
import { updateTaskMutation, prepareTaskUpdateData } from './form/mutation';

type OptionalProps = {
  path: string,
  taskId?: string,
};

type Props = OptionalProps & {};

export default class TaskFormModule extends React.Component<Props> {
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
    const input = prepareTaskUpdateData(formData.originalValues, formData.state);

    if (taskId) {
      const { data } = await saveTask({ variables: { input, id: decodeId(taskId) } });
      const {
        taskUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    }
  };

  onMutationCompleted = (result: Object) => {
    if (!result) {
      toast.error('There was an error. Please try again later');
    }
  };

  render() {
    const { taskId } = this.props;

    let mutationKey = {};
    if (taskId) {
      mutationKey = { key: decodeId(taskId) };
    }

    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Mutation
              mutation={updateTaskMutation}
              onCompleted={this.onMutationCompleted}
              {...mutationKey}
            >
              {(saveTask, { loading, error }) => (
                <Subscribe to={[TaskContainer, FormContainer]}>
                  {({ initDetailValues, originalValues, state, isDirty, onSuccess }, form) => {
                    return (
                      <Layout
                        {...uiState}
                        navBar={
                          <NavBar>
                            <EntityIcon icon="TASK" color="TASK" />
                            <JumpToSection>
                              <SectionTabs
                                link="task_taskSection"
                                label={
                                  <FormattedMessage id="modules.task.task" defaultMessage="TASK" />
                                }
                                icon="TASK"
                              />
                            </JumpToSection>
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
                                  disabled={!isDirty()}
                                  loading={loading}
                                  onClick={() =>
                                    this.onSave(
                                      { originalValues, state },
                                      saveTask,
                                      () => {
                                        onSuccess();
                                        form.onReset();
                                      },
                                      form.onErrors
                                    )
                                  }
                                />
                              </>
                            )}
                          </NavBar>
                        }
                      >
                        {error && <p>Error: Please try again.</p>}
                        <QueryForm
                          query={taskFormQuery}
                          entityId={taskId}
                          entityType="task"
                          render={task => (
                            <TaskForm task={task} onFormReady={() => initDetailValues(task)} />
                          )}
                        />
                      </Layout>
                    );
                  }}
                </Subscribe>
              )}
            </Mutation>
          )}
        </UIConsumer>
      </Provider>
    );
  }
}
