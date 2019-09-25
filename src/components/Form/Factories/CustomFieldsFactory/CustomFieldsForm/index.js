// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { contains, getByPathWithDefault } from 'utils/fp';
import { countMaskFieldDefinitions } from 'utils/customFields';
import { TemplateCard, GrayCard } from 'components/Cards';
import Divider from 'components/Divider';
import FormattedNumber from 'components/FormattedNumber';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import JumpToSection from 'components/JumpToSection';
import SlideView from 'components/SlideView';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import GridColumn from 'components/GridColumn';
import { DefaultCustomFieldStyle } from 'components/Form/Inputs/Styles';
import { SectionHeader, SectionWrapper, Label, DashedPlusButton, FieldItem } from 'components/Form';
import { EntityIcon } from 'components/NavBar';
import { SaveButton, ResetButton } from 'components/Buttons';
import { FormContainer, resetFormState } from 'modules/form';
import CustomFieldsContainer from 'components/Form/Factories/CustomFieldsFactory/container';
import CustomFieldsTemplateSelector from 'components/Form/Factories/CustomFieldsFactory/CustomFieldsTemplateSelector';
import { CustomFieldsFormWrapperStyle, CustomFieldsSectionWrapperStyle } from './style';

type OptionalProps = {
  onFormReady: () => void,
  onSave: Function,
  editable: {
    values: boolean,
    mask: boolean,
  },
};

type Props = OptionalProps & {
  entityType: string,
};

const defaultProps = {
  onFormReady: () => {},
  onSave: () => {},
  editable: {
    values: false,
    mask: false,
  },
};

const countCustomFields = (mask: Object, fieldValues: Array<Object>): number => {
  return mask ? countMaskFieldDefinitions(mask) : fieldValues.length;
};

class CustomFieldsForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  render() {
    const { entityType, onSave, editable } = this.props;

    return (
      <Subscribe to={[CustomFieldsContainer, FormContainer]}>
        {(customFieldsContainer, formContainer) => {
          const values = {
            ...customFieldsContainer.originalValues,
            ...customFieldsContainer.state,
          };
          const { fieldValues } = values;
          const mask = getByPathWithDefault(false, 'mask.id', values) ? values.mask : null;

          return (
            <SlideViewLayout>
              <SlideViewNavBar>
                <EntityIcon icon="METADATA" color="METADATA" />
                <JumpToSection>
                  <SectionTabs
                    link="metadataSection"
                    label={
                      <FormattedMessage
                        id="modules.metadata.sectionHeader"
                        defaultMessage="CUSTOM FIELDS"
                      />
                    }
                    icon="METADATA"
                  />
                </JumpToSection>
                {customFieldsContainer.isDirty() && (
                  <>
                    <ResetButton
                      onClick={() => {
                        resetFormState(customFieldsContainer);
                        formContainer.onReset();
                      }}
                    />
                    <SaveButton onClick={() => onSave(values)} />
                  </>
                )}
              </SlideViewNavBar>

              <Content>
                <div className={CustomFieldsFormWrapperStyle}>
                  <SectionWrapper id="metadataSection">
                    <SectionHeader
                      icon="METADATA"
                      title={
                        <>
                          <FormattedMessage
                            id="module.metadata.sectionHeader"
                            defaultMessage="CUSTOM FIELDS"
                          />
                          {' ('}
                          <FormattedNumber value={countCustomFields(mask, fieldValues)} />
                          {')'}
                        </>
                      }
                    />
                    <div className={CustomFieldsSectionWrapperStyle}>
                      <FieldItem
                        vertical
                        label={
                          <Label>
                            <FormattedMessage
                              id="modules.form.template"
                              defaultMessage="TEMPLATE"
                            />
                          </Label>
                        }
                        input={
                          editable.mask ? (
                            <BooleanValue>
                              {({ value: opened, set: slideToggle }) => (
                                <>
                                  {mask ? (
                                    <TemplateCard
                                      template={{
                                        id: mask.id,
                                        title: mask.name,
                                        description: mask.memo,
                                        count: countMaskFieldDefinitions(mask),
                                      }}
                                      type="METADATA"
                                      onClick={editable ? () => slideToggle(true) : () => {}}
                                    />
                                  ) : (
                                    <DashedPlusButton
                                      width="195px"
                                      height="140px"
                                      onClick={() => slideToggle(true)}
                                    />
                                  )}
                                  <SlideView
                                    isOpen={opened}
                                    onRequestClose={() => slideToggle(false)}
                                    shouldConfirm={() => {
                                      const button = document.getElementById(
                                        'select_template_button'
                                      );
                                      // $FlowFixMe: Cannot get button.disabled because property disabled is missing in HTMLElement [1].
                                      return button && !button.disabled;
                                    }}
                                  >
                                    {opened && (
                                      <CustomFieldsTemplateSelector
                                        saveButtonId="select_template_button"
                                        entityType={entityType}
                                        selected={mask}
                                        onCancel={() => slideToggle(false)}
                                        onSave={item => {
                                          customFieldsContainer.setFieldValue('mask', item);
                                          slideToggle(false);
                                        }}
                                      />
                                    )}
                                  </SlideView>
                                </>
                              )}
                            </BooleanValue>
                          ) : (
                            <>
                              {mask ? (
                                <TemplateCard
                                  template={{
                                    id: mask.id,
                                    title: mask.name,
                                    description: mask.memo,
                                    count: countMaskFieldDefinitions(mask),
                                  }}
                                  type="METADATA"
                                  readOnly
                                />
                              ) : (
                                <GrayCard width="195px" height="140px" />
                              )}
                            </>
                          )
                        }
                      />

                      <Divider />
                      <GridColumn gap="10px">
                        {fieldValues &&
                          fieldValues.map(({ value, fieldDefinition }, index) =>
                            mask == null || contains(fieldDefinition, mask.fieldDefinitions) ? (
                              <DefaultCustomFieldStyle
                                key={fieldDefinition.id}
                                targetName={`fieldValues.${index}`}
                                fieldName={fieldDefinition.name}
                                value={value}
                                setFieldValue={customFieldsContainer.setFieldValue}
                                editable={editable.values}
                              />
                            ) : null
                          )}
                      </GridColumn>
                    </div>
                  </SectionWrapper>
                </div>
              </Content>
            </SlideViewLayout>
          );
        }}
      </Subscribe>
    );
  }
}

export default CustomFieldsForm;
