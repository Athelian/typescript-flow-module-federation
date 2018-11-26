// @flow
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import TemplateFormContainer from 'modules/tableTemplate/form/container';
import query from 'modules/tableTemplate/list/query';
import validator from 'modules/tableTemplate/form/validator';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import TemplateForm from 'modules/tableTemplate/form';
import {
  maskEditUpdateMutation,
  maskEditCreateMutation,
} from 'modules/tableTemplate/form/mutation';
import { FormContainer } from 'modules/form';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';

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
        update: (proxy, { data: { maskEditCreate } }) => {
          const store = proxy.readQuery({ query });
          // store.comments.push(maskEditCreate);
          // proxy.writeQuery({ query, data });
          console.warn({ maskEditCreate, store, proxy });
        },
      });
      const {
        maskEditCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        closeSlideView();
        onSuccess();
      }
    } else if (template.id) {
      const { data } = await saveTemplate({
        variables: { input, id: template.id },
        optimisticResponse: {
          maskEditUpdate: {
            __typename: 'MaskEditMutated',
            maskEdit: {
              __typename: 'MaskEdit',
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

  render() {
    const { isNew, template, onCancel } = this.props;
    let mutationKey = {};
    if (!isNew) {
      mutationKey = { key: template.id };
    }
    return (
      <Provider inject={[formContainer]}>
        <Subscribe to={[TemplateFormContainer]}>
          {({ state, isDirty, initDetailValues, onSuccess }) => (
            <Mutation
              mutation={isNew ? maskEditCreateMutation : maskEditUpdateMutation}
              {...mutationKey}
            >
              {(saveTemplate, { loading: isLoading, error: apiError }) => (
                <Layout
                  navBar={
                    <SlideViewNavBar>
                      <EntityIcon icon="ORDER" color="ORDER" />
                      <JumpToSection>
                        <SectionTabs
                          link="templateSection"
                          label={
                            <FormattedMessage
                              id="modules.Templates.template"
                              defaultMessage="TEMPLATE"
                            />
                          }
                          icon="TEMPLATE"
                        />
                        <SectionTabs
                          link="editFieldsSection"
                          label={
                            <FormattedMessage
                              id="modules.Templatees.editFields"
                              defaultMessage="EDIT FIELDS"
                            />
                          }
                          icon="METADATA"
                        />
                      </JumpToSection>
                      <CancelButton onClick={onCancel} />
                      <SaveButton
                        disabled={!isDirty() || !formContainer.isReady(state, validator)}
                        isLoading={isLoading}
                        data-testid="saveButtonOnTemplate"
                        onClick={() =>
                          this.onSave(
                            state,
                            saveTemplate,
                            () => {
                              onSuccess();
                              formContainer.onReset();
                            },
                            formContainer.onErrors
                          )
                        }
                      />
                    </SlideViewNavBar>
                  }
                >
                  {apiError && <p>Error: Please try again.</p>}
                  <TemplateForm
                    initDetailValues={initDetailValues}
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
