// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { SectionHeader, SectionWrapper, LastModified } from 'components/Form';
import TemplateFormContainer from 'modules/tableTemplate/form/container';
import validator from 'modules/tableTemplate/form/validator';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import Layout from 'components/Layout';
import { FormContainer } from 'modules/form';
import { SaveButton, CancelButton } from 'components/Buttons';
import { isEquals } from 'utils/fp';
import { TemplateSection } from './components';
import { TemplateFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  template: Object,
  onFormReady: () => void,
  onCancel: () => void,
  onSave: () => void,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  template: {},
  onFormReady: () => {},
  onCancel: () => {},
  onSave: () => {},
};

const formContainer = new FormContainer();

export default class TemplateForm extends React.Component<Props> {
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

  render() {
    const { template, isNew, onCancel, onSave } = this.props;

    return (
      <Provider inject={[formContainer]}>
        <Subscribe to={[TemplateFormContainer]}>
          {({ state, isDirty }) => (
            <Layout
              navBar={
                <SlideViewNavBar>
                  <EntityIcon icon="ORDER" color="ORDER" />
                  <CancelButton onClick={onCancel} />
                  <SaveButton
                    disabled={!isDirty() || !formContainer.isReady(state, validator)}
                    data-testid="saveButtonOnTemplate"
                    onClick={onSave}
                  />
                </SlideViewNavBar>
              }
            >
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
      </Provider>
    );
  }
}
