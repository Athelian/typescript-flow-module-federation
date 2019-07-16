// @flow
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import emitter from 'utils/emitter';
import TemplateFormContainer from 'modules/tableTemplate/form/container';
import validator from 'modules/tableTemplate/form/validator';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import TemplateForm from 'modules/tableTemplate/form';
import {
  maskEditUpdateMutation,
  maskEditCreateMutation,
} from 'modules/tableTemplate/form/mutation';
import { FormContainer, resetFormState } from 'modules/form';
import { Layout } from 'components/Layout';
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

class TemplateFormWrapper extends React.Component<Props> {
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
      });
      const {
        maskEditCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        closeSlideView();
        setTimeout(() => {
          emitter.emit('REFETCH_TABLE_TEMPLATES');
        }, 200);
      }
    } else if (template.id) {
      const { data } = await saveTemplate({
        variables: { input, id: template.id },
      });
      const {
        maskEditUpdate: { violations },
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
        <Subscribe to={[TemplateFormContainer]}>
          {formState => (
            <Mutation
              mutation={isNew ? maskEditCreateMutation : maskEditUpdateMutation}
              {...mutationKey}
            >
              {(saveTemplate, { loading: isLoading, error: apiError }) => (
                <Layout
                  navBar={
                    <SlideViewNavBar>
                      <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />
                      <JumpToSection>
                        <SectionTabs
                          link="tableTemplate_templateSection"
                          label={
                            <FormattedMessage
                              id="modules.Templates.template"
                              defaultMessage="TEMPLATE"
                            />
                          }
                          icon="TEMPLATE"
                        />
                        <SectionTabs
                          link="tableTemplate_editFieldsSection"
                          label={
                            <FormattedMessage
                              id="modules.Templates.relationTable"
                              defaultMessage="RELATION TABLE"
                            />
                          }
                          icon="EDIT_TABLE"
                        />
                      </JumpToSection>
                      {isNew && <CancelButton onClick={() => onCancel()} />}

                      {!isNew && formState.isDirty() && (
                        <ResetButton onClick={() => this.onReset(formState)} />
                      )}

                      {(isNew || formState.isDirty()) && (
                        <SaveButton
                          disabled={!formContainer.isReady(formState.state, validator)}
                          isLoading={isLoading}
                          data-testid="saveButtonOnTableTemplate"
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
                      )}
                    </SlideViewNavBar>
                  }
                >
                  {apiError && <p>Error: Please try again.</p>}
                  <TemplateForm
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

export default TemplateFormWrapper;
