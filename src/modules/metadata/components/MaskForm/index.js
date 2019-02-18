// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { CUSTOM_FIELD_MASKS_UPDATE } from 'modules/permission/constants/customFields';
import { PermissionConsumer } from 'modules/permission';
import { SectionHeader, SectionWrapper } from 'components/Form';
import { FormContainer, FormField } from 'modules/form';
import { TextInputFactory, TextAreaInputFactory } from 'modules/form/factories';
import validator from 'modules/metadata/components/MaskFormWrapper/validator';
import MaskContainer from 'modules/metadata/components/MaskForm/container';
import {
  TemplateFormWrapperStyle,
  TemplateSectionWrapperStyle,
  DescriptionLabelWrapperStyle,
  TemplateFieldsSectionWrapperStyle,
} from './style';
import { CustomFieldTemplateItem } from './components';

type OptionalProps = {
  isNew: boolean,
  onFormReady: Function,
  fieldDefinitions: Array<Object>,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  onFormReady: () => {},
  fieldDefinitions: [],
};

const formContainer = new FormContainer();

class MaskForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;
    if (onFormReady) onFormReady();
  }

  componentWillUnmount() {
    formContainer.onReset();
  }

  render() {
    const { isNew, fieldDefinitions } = this.props;

    return (
      <PermissionConsumer>
        {hasPermission => {
          const allowUpdate = hasPermission(CUSTOM_FIELD_MASKS_UPDATE);

          return (
            <Provider inject={[formContainer]}>
              <Subscribe to={[MaskContainer]}>
                {({ originalValues, state, setFieldValue }) => {
                  const values = { ...originalValues, ...state };
                  return (
                    <div className={TemplateFormWrapperStyle}>
                      <SectionWrapper id="metadata_templateSection">
                        <SectionHeader
                          icon="TEMPLATE"
                          title={
                            <FormattedMessage
                              id="modules.metadata.template"
                              defaultMessage="TEMPLATE"
                            />
                          }
                        />
                        <div className={TemplateSectionWrapperStyle}>
                          <FormField
                            name="name"
                            initValue={values.name}
                            validator={validator}
                            values={values}
                            setFieldValue={setFieldValue}
                          >
                            {({ name, ...inputHandlers }) => (
                              <TextInputFactory
                                label={
                                  <FormattedMessage
                                    id="modules.metadata.templateName"
                                    defaultMessage="TEMPLATE NAME"
                                  />
                                }
                                required
                                isNew={isNew}
                                name={name}
                                originalValue={originalValues[name]}
                                {...inputHandlers}
                                editable={allowUpdate}
                              />
                            )}
                          </FormField>

                          <FormField
                            name="memo"
                            initValue={values.memo}
                            validator={validator}
                            values={values}
                            setFieldValue={setFieldValue}
                          >
                            {({ name, ...inputHandlers }) => (
                              <TextAreaInputFactory
                                label={
                                  <div className={DescriptionLabelWrapperStyle}>
                                    <FormattedMessage
                                      id="modules.metadata.description"
                                      defaultMessage="DESCRIPTION"
                                    />
                                  </div>
                                }
                                isNew={isNew}
                                name={name}
                                originalValue={originalValues[name]}
                                {...inputHandlers}
                                inputHeight="100px"
                                inputWidth="200px"
                                inputAlign="right"
                                editable={allowUpdate}
                                vertical={false}
                              />
                            )}
                          </FormField>
                        </div>
                      </SectionWrapper>

                      <SectionWrapper id="metadata_customFieldsSection">
                        <SectionHeader
                          icon="METADATA"
                          title={
                            <FormattedMessage
                              id="modules.metadata.customFieldsSection"
                              defaultMessage="CUSTOM FIELDS"
                            />
                          }
                        />
                        <div className={TemplateFieldsSectionWrapperStyle}>
                          {fieldDefinitions.map(fieldDefinition => (
                            <CustomFieldTemplateItem
                              key={fieldDefinition.id}
                              checked={values.fieldDefinitionIDs.includes(fieldDefinition.id)}
                              item={fieldDefinition}
                              onClick={() => {
                                if (values.fieldDefinitionIDs.includes(fieldDefinition.id)) {
                                  setFieldValue(
                                    'fieldDefinitionIDs',
                                    values.fieldDefinitionIDs.filter(
                                      item => item !== fieldDefinition.id
                                    )
                                  );
                                } else {
                                  setFieldValue('fieldDefinitionIDs', [
                                    ...values.fieldDefinitionIDs,
                                    fieldDefinition.id,
                                  ]);
                                }
                              }}
                              editable={allowUpdate}
                            />
                          ))}
                        </div>
                      </SectionWrapper>
                    </div>
                  );
                }}
              </Subscribe>
            </Provider>
          );
        }}
      </PermissionConsumer>
    );
  }
}

export default MaskForm;
