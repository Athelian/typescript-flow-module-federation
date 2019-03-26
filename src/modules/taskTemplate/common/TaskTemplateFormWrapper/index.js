// @flow
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import TaskTemplateFormContainer from 'modules/taskTemplate/form/container';
import validator from 'modules/taskTemplate/form/validator';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import TaskTemplateForm from 'modules/taskTemplate/form';
import {
  createTaskTemplateMutation,
  updateTaskTemplateMutation,
} from 'modules/taskTemplate/form/mutation';
import query from 'modules/taskTemplate/list/query';
import emitter from 'utils/emitter';
import { FormContainer, resetFormState } from 'modules/form';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton, ResetButton } from 'components/Buttons';

type OptionalProps = {
  template: Object,
  isNew: boolean,
};

type Props = OptionalProps & {
  onCancel: Function,
};

const defaultProps = {
  template: {},
  isNew: false,
};

const formContainer = new FormContainer();

class TaskTemplateFormWrapper extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentWillUnmount() {
    formContainer.onReset();
  }

  onSave = async (
    formData: Object,
    saveTemplate: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { isNew, template, onCancel: closeSlideView } = this.props;
    const { name, memo, type, fields } = formData;
    const input = {
      name,
      type,
      memo,
      fields,
    };
    if (isNew) {
      const { data } = await saveTemplate({
        variables: { input },
        update: (store, { data: { taskCreate } }) => {
          const collections = store.readQuery({
            query,
            variables: {
              page: 1,
              perPage: 10,
              filter: {
                type: 'Order',
              },
              sort: {
                updatedAt: 'DESCENDING',
              },
            },
          });
          collections.tasks.nodes.unshift(taskCreate);
          collections.tasks.totalCount += 1;
          if (collections.tasks.totalCount % collections.tasks.perPage === 1) {
            collections.tasks.totalPage += 1;
          }
          store.writeQuery({ query, data: collections });
          // This is open issue on apollo client repo https://github.com/apollographql/apollo-client/issues/2415
          // workaround is sending a message to force render
          // emitter.emit('RELOAD_TEMPLATE');
        },
      });
      const {
        taskCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        emitter.emit('RELOAD_TASK_TEMPLATE');
        closeSlideView();
        onSuccess();
      }
    } else if (template.id) {
      const { data } = await saveTemplate({
        variables: { input, id: template.id },
        optimisticResponse: {
          taskUpdate: {
            __typename: 'TaskMutated',
            task: {
              __typename: 'Task',
              id: template.id,
              updatedBy: template.updatedBy,
              name,
              type,
              memo,
              fields,
              updatedAt: new Date(),
            },
          },
        },
      });
      const {
        taskUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        closeSlideView();
        onSuccess();
      }
    }
  };

  onReset = (formState: Object) => {
    resetFormState(formState);
  };

  render() {
    const { isNew, template, onCancel } = this.props;
    let mutationKey = {};
    if (!isNew) {
      mutationKey = { key: template.id };
    }
    return (
      <Provider inject={[formContainer]}>
        <Subscribe to={[TaskTemplateFormContainer]}>
          {formState => (
            <Mutation
              mutation={isNew ? createTaskTemplateMutation : updateTaskTemplateMutation}
              {...mutationKey}
            >
              {(saveTemplate, { loading: isLoading, error: apiError }) => (
                <Layout
                  navBar={
                    <SlideViewNavBar>
                      <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />
                      <JumpToSection>
                        <SectionTabs
                          link="taskTemplate_templateSection"
                          label={
                            <FormattedMessage
                              id="modules.TaskTemplates.template"
                              defaultMessage="TEMPLATE"
                            />
                          }
                          icon="TEMPLATE"
                        />
                        <SectionTabs
                          link="taskTemplate_taskSection"
                          label={
                            <FormattedMessage
                              id="modules.TaskTemplates.relationTable"
                              defaultMessage="TASK"
                            />
                          }
                          icon="EDIT_TABLE"
                        />
                      </JumpToSection>
                      {formState.isDirty() && (
                        <>
                          {isNew ? (
                            <CancelButton onClick={() => onCancel()} />
                          ) : (
                            <ResetButton onClick={() => this.onReset(formState)} />
                          )}
                          <SaveButton
                            disabled={!formContainer.isReady(formState.state, validator)}
                            isLoading={isLoading}
                            data-testid="saveButtonOnTemplate"
                            onClick={() =>
                              this.onSave(
                                formState.state,
                                saveTemplate,
                                () => {
                                  formState.onSuccess();
                                  formContainer.onReset();
                                },
                                formContainer.onErrors
                              )
                            }
                          />
                        </>
                      )}
                    </SlideViewNavBar>
                  }
                >
                  {apiError && <p>Error: Please try again.</p>}
                  <TaskTemplateForm
                    initDetailValues={formState.initDetailValues}
                    template={template}
                    isNew={isNew}
                  />
                </Layout>
              )}
            </Mutation>
          )}
        </Subscribe>
      </Provider>
    );
  }
}

export default TaskTemplateFormWrapper;
