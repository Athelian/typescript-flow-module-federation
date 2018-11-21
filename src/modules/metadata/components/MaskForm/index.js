// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { isEquals } from 'utils/fp';
import ContentWrapper from 'components/ContentWrapper';
import { SectionHeader, SectionWrapper } from 'components/Form';
import GridColumn from 'components/GridColumn';
import { FormField } from 'modules/form';
import { textInputFactory, textAreaFactory } from 'modules/form/helpers';
import validator from 'modules/metadata/components/MaskFormWrapper/validator';
import FieldItem from './components/FieldItem';
import { TemplateFormWrapperStyle, FormFieldsStyle, DescriptionLabelWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  mask: Object,
  setFieldValue: Function,
  fieldDefinitions: Array<Object>,
  onFormReady: Function,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  mask: {
    name: '',
    memo: '',
    fieldDefinitionIDs: [],
  },
  setFieldValue: () => {},
  fieldDefinitions: [],
  onFormReady: () => {},
};

class MaskForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;
    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { mask } = this.props;
    return !isEquals(mask, nextProps.mask);
  }

  componentDidUpdate() {
    const { onFormReady } = this.props;
    if (onFormReady) onFormReady();
  }

  render() {
    const { isNew, mask, setFieldValue, fieldDefinitions } = this.props;

    return (
      <div className={TemplateFormWrapperStyle}>
        <SectionWrapper id="templateSection">
          <SectionHeader
            icon="TEMPLATE"
            title={<FormattedMessage id="modules.metadata.template" defaultMessage="TEMPLATE" />}
          />
          <ContentWrapper width="880px" className={FormFieldsStyle}>
            <GridColumn>
              <FormField
                name="name"
                initValue={mask.name}
                validator={validator}
                setFieldValue={setFieldValue}
              >
                {({ name: fieldName, ...inputHandlers }) =>
                  textInputFactory({
                    label: (
                      <FormattedMessage
                        id="modules.metadata.templateName"
                        defaultMessage="TEMPLATE NAME"
                      />
                    ),
                    required: true,
                    isNew,
                    name: fieldName,
                    inputHandlers,
                    originalValue: mask.name,
                  })
                }
              </FormField>

              <FormField name="memo" initValue={mask.memo}>
                {({ name: fieldName, ...inputHandlers }) =>
                  textAreaFactory({
                    label: (
                      <div className={DescriptionLabelWrapperStyle}>
                        <FormattedMessage
                          id="modules.metadata.description"
                          defaultMessage="DESCRIPTION"
                        />
                      </div>
                    ),
                    isNew,
                    height: '100px',
                    align: 'right',
                    name: fieldName,
                    inputHandlers,
                    originalValue: mask.memo,
                  })
                }
              </FormField>
            </GridColumn>
          </ContentWrapper>
        </SectionWrapper>
        <SectionWrapper id="customFieldsSection">
          <SectionHeader
            icon="METADATA"
            title={
              <FormattedMessage
                id="modules.metadata.customFieldsSection"
                defaultMessage="CUSTOM FIELDS"
              />
            }
          />
          <ContentWrapper width="880px" className={FormFieldsStyle}>
            <div>
              {fieldDefinitions.map(fieldDefinition => (
                <FieldItem
                  key={fieldDefinition.id}
                  checked={mask.fieldDefinitionIDs.includes(fieldDefinition.id)}
                  item={fieldDefinition}
                  onClick={() => {
                    if (mask.fieldDefinitionIDs.includes(fieldDefinition.id)) {
                      setFieldValue(
                        'fieldDefinitionIDs',
                        mask.fieldDefinitionIDs.filter(item => item !== fieldDefinition.id)
                      );
                    } else {
                      setFieldValue('fieldDefinitionIDs', [
                        ...mask.fieldDefinitionIDs,
                        fieldDefinition.id,
                      ]);
                    }
                  }}
                />
              ))}
            </div>
          </ContentWrapper>
        </SectionWrapper>
      </div>
    );
  }
}

export default MaskForm;
