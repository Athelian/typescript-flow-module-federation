// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Mutation } from 'react-apollo';
import { Provider, Subscribe } from 'unstated';
import { UIConsumer } from 'modules/ui';
import { FormContainer, resetFormState } from 'modules/form';
import { encodeId, decodeId } from 'utils/id';
import Layout from 'components/Layout';
import { CancelButton, ResetButton, SaveButton } from 'components/Buttons';

import NavBar, { EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { QueryForm } from 'components/common';
import { taskFormQuery } from './form/query';
import TaskForm from './form';
import TaskContainer from './form/container';
import {
  createTaskMutation,
  updateTaskMutation,
  prepareTaskUpdateData,
  prepareTaskCreateDate,
} from './form/mutation';

type OptionalProps = {
  path: string,
  taskId?: string,
};

type Props = OptionalProps & {};

export default class TaskFormModule extends React.Component<Props> {
  isNew = () => {
    const { path } = this.props;
    return path.startsWith('new');
  };

  isClone = () => {
    const { path } = this.props;
    return path.startsWith('clone');
  };

  isNewOrClone = () => this.isNew() || this.isClone();

  onCancel = () => navigate('/tags');

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

    const isNewOrClone = this.isNewOrClone();
    const input = isNewOrClone
      ? prepareTaskCreateDate(formData.state)
      : prepareTaskUpdateData(formData.originalValues, formData.state);

    if (isNewOrClone) {
      const { data } = await saveTask({ variables: { input } });
      const {
        taskCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    } else if (taskId) {
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
    if (this.isNewOrClone()) {
      const { taskCreate } = result;
      navigate(`/task/${encodeId(taskCreate.id)}`);
    }
  };

  render() {
    const { taskId } = this.props;
    const isNewOrClone = this.isNewOrClone();

    let mutationKey = {};
    if (taskId && !this.isClone()) {
      mutationKey = { key: decodeId(taskId) };
    }

    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Mutation
              mutation={isNewOrClone ? createTaskMutation : updateTaskMutation}
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

                            {isNewOrClone && <CancelButton onClick={this.onCancel} />}
                            {!isNewOrClone && isDirty() && (
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
                            )}
                            {(isNewOrClone || isDirty()) && (
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
                            )}
                          </NavBar>
                        }
                      >
                        {error && <p>Error: Please try again.</p>}
                        {taskId ? (
                          <QueryForm
                            query={taskFormQuery}
                            entityId={taskId}
                            entityType="task"
                            render={task => (
                              <TaskForm task={task} onFormReady={() => initDetailValues(task)} />
                            )}
                          />
                        ) : (
                          <TaskForm isNew />
                        )}
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
