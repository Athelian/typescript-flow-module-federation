// @flow
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { Provider, Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import { SectionHeader, SectionWrapper, LastModified } from 'components/Form';
import TemplateFormContainer from 'modules/tableTemplate/form/container';
import validator from 'modules/tableTemplate/form/validator';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import Layout from 'components/Layout';
import { FormContainer } from 'modules/form';
import { SaveButton, CancelButton } from 'components/Buttons';
import { isEquals } from 'utils/fp';
import { decodeId } from 'utils/id';
import { TemplateSection } from './components';
import { TemplateFormWrapperStyle } from './style';
import { maskEditUpdateMutation, maskEditCreateMutation } from './mutation';

type OptionalProps = {
  isNew: boolean,
  template: Object,
  onFormReady: () => void,
  onCancel: () => void,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  template: {},
  onFormReady: () => {},
  onCancel: () => {},
};

const formContainer = new FormContainer();

export default class TableTemplateForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { template } = this.props;

    return !isEquals(template, nextProps.template);
  }

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
      const { data } = await saveTemplate({ variables: { input } });
      const {
        maskEditCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
        closeSlideView();
      }
    } else if (template.id) {
      console.warn({ template });
      const { data } = await saveTemplate({ variables: { input, id: decodeId(template.id) } });
      const {
        maskEditUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    }
  };

  render() {
    const { template, isNew, onCancel } = this.props;
    let mutationKey = {};
    if (!isNew) {
      mutationKey = { key: decodeId(template.id) };
    }

    return (
      <Provider inject={[formContainer]}>
        <Mutation
          mutation={isNew ? maskEditCreateMutation : maskEditUpdateMutation}
          {...mutationKey}
        >
          {(saveTemplate, { loading: isLoading, error: apiError }) => (
            <Subscribe to={[TemplateFormContainer]}>
              {({ state, isDirty, onSuccess }) => (
                <Layout
                  navBar={
                    <SlideViewNavBar>
                      <EntityIcon icon="ORDER" color="ORDER" />
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
                  <div className={TemplateFormWrapperStyle}>
                    <SectionWrapper id="templateSection">
                      <SectionHeader
                        icon="TEMPLATE"
                        title={
                          <FormattedMessage
                            id="modules.TableTemplates.template"
                            defaultMessage="TEMPLATE"
                          />
                        }
                      >
                        {!isNew && (
                          <>
                            <LastModified
                              updatedAt={template.updatedAt}
                              updatedBy={template.updatedBy}
                            />
                          </>
                        )}
                      </SectionHeader>
                      <TemplateSection isNew={isNew} />
                    </SectionWrapper>
                  </div>
                </Layout>
              )}
            </Subscribe>
          )}
        </Mutation>
      </Provider>
    );
  }
}
