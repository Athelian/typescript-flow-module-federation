// @flow
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { showToastError } from 'utils/errors';
import emitter from 'utils/emitter';
import TaskTemplateFormContainer from 'modules/taskTemplate/form/container';
import validator from 'modules/taskTemplate/form/validator';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import TaskTemplateForm from 'modules/taskTemplate/form';
import {
  createTaskTemplateMutation,
  updateTaskTemplateMutation,
  prepareParsedTaskTemplate,
} from 'modules/taskTemplate/form/mutation';
import { FormContainer, resetFormState } from 'modules/form';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import { CancelButton } from 'components/Buttons';
import ResetFormButton from 'components/ResetFormButton';
import SaveFormButton from 'components/SaveFormButton';
import { removeTypename } from 'utils/data';
import { getByPathWithDefault, isEquals } from 'utils/fp';

type Props = {|
  intl: IntlShape,
  template: Object,
  isNew?: boolean,
  isClone?: boolean,
  onCancel?: Function,
  onClone?: Function,
|};

const defaultProps = {
  isNew: false,
  isClone: false,
  onCancel: () => {},
  onClone: () => {},
};

const formContainer = new FormContainer();

class TaskTemplateFormWrapper extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentWillUnmount() {
    formContainer.onReset();
  }

  onSave = async (
    originalValues: Object,
    values: Object,
    saveTaskTemplate: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { isNew, isClone, template, onCancel } = this.props;
    const input = prepareParsedTaskTemplate(
      isNew ? null : removeTypename(originalValues),
      removeTypename(values)
    );

    if (isNew || isClone) {
      const { data } = await saveTaskTemplate({
        variables: { input },
      });
      const {
        taskTemplateCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        if (onCancel) onCancel();

        onSuccess();
      }
    } else if (template.id) {
      const { data } = await saveTaskTemplate({
        variables: { input, id: template.id },
      });
      const {
        taskTemplateUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        if (
          !isEquals(getByPathWithDefault(null, 'entityType', originalValues), values.entityType)
        ) {
          setTimeout(() => {
            emitter.emit('REFETCH_TASK_TEMPLATES', values.entityType);
          }, 200);
        }

        if (onCancel) onCancel();

        onSuccess();
      }
    }
  };

  onMutationCompleted = (result: Object) => {
    const { intl } = this.props;

    if (showToastError({ result, intl, entity: 'taskTemplate' })) {
      return;
    }

    if (result.taskTemplateCreate) {
      setTimeout(() => {
        emitter.emit('REFETCH_TASK_TEMPLATES', Date.now());
      }, 200);
    }
  };

  render() {
    const { isNew, isClone, template, onCancel, onClone } = this.props;
    let mutationKey = {};
    if (!isNew && !isClone) {
      mutationKey = { key: template.id };
    }
    return (
      <Provider inject={[formContainer]}>
        <Subscribe to={[TaskTemplateFormContainer]}>
          {taskTemplateContainer => (
            <Mutation
              mutation={isNew || isClone ? createTaskTemplateMutation : updateTaskTemplateMutation}
              onCompleted={this.onMutationCompleted}
              {...mutationKey}
            >
              {(saveTaskTemplate, { loading: isLoading, error: apiError }) => (
                <SlideViewLayout>
                  <SlideViewNavBar>
                    <EntityIcon icon="TEMPLATE" color="TEMPLATE" subIcon="TASK" />
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
                        label={<FormattedMessage id="modules.Tasks.tasks" defaultMessage="TASKS" />}
                        icon="TASK"
                      />
                    </JumpToSection>
                    {(isNew || isClone) && <CancelButton onClick={onCancel} />}

                    {!(isNew || isClone) && taskTemplateContainer.isDirty() && (
                      <ResetFormButton
                        onClick={() => {
                          resetFormState(taskTemplateContainer);
                          formContainer.onReset();
                        }}
                      />
                    )}
                    {(isNew || isClone || taskTemplateContainer.isDirty()) && (
                      <SaveFormButton
                        id="task_template_form_save_button"
                        disabled={!formContainer.isReady(taskTemplateContainer.state, validator)}
                        isLoading={isLoading}
                        data-testid="saveButtonOnTaskTemplate"
                        onClick={() =>
                          this.onSave(
                            taskTemplateContainer.originalValues,
                            taskTemplateContainer.state,
                            saveTaskTemplate,
                            () => {
                              taskTemplateContainer.onSuccess();
                              formContainer.onReset();
                            },
                            formContainer.onErrors
                          )
                        }
                      />
                    )}
                  </SlideViewNavBar>

                  <Content>
                    {apiError && <p>Error: Please try again.</p>}
                    <TaskTemplateForm
                      initDetailValues={taskTemplateContainer.initDetailValues}
                      template={template}
                      isNew={Boolean(isNew)}
                      isClone={isClone}
                      onClone={onClone}
                    />
                  </Content>
                </SlideViewLayout>
              )}
            </Mutation>
          )}
        </Subscribe>
      </Provider>
    );
  }
}

export default injectIntl(TaskTemplateFormWrapper);
