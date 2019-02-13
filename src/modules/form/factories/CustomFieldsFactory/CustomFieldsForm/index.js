// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { contains } from 'utils/fp';
import { BooleanValue } from 'react-values';
import { MaskCard } from 'components/Cards';
import Divider from 'components/Divider';
import FormattedNumber from 'components/FormattedNumber';
import Layout from 'components/Layout';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import JumpToSection from 'components/JumpToSection';
import SlideView from 'components/SlideView';
import GridColumn from 'components/GridColumn';
import { DefaultCustomFieldStyle } from 'components/Form/Inputs/Styles';
import { SectionHeader, SectionWrapper, Label, DashedPlusButton, FieldItem } from 'components/Form';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import CustomFieldsContainer from 'modules/form/factories/CustomFieldsFactory/container';
import CustomFieldsTemplateSelector from 'modules/form/factories/CustomFieldsFactory/CustomFieldsTemplateSelector';
import { CustomFieldsFormWrapperStyle, CustomFieldsSectionWrapperStyle } from './style';

type OptionalProps = {
  onFormReady: () => void,
};

type Props = OptionalProps & {
  entityType: string,
  onCancel: Function,
  onSave: Function,
};

const defaultProps = {
  onFormReady: () => {},
};

class CustomFieldsForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  render() {
    const { entityType, onCancel, onSave } = this.props;

    return (
      <Subscribe to={[CustomFieldsContainer]}>
        {({ originalValues, state, setFieldValue, isDirty }) => {
          const values = { ...originalValues, ...state };
          const { mask, fieldValues } = values;
          return (
            <Layout
              navBar={
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
                  <CancelButton onClick={onCancel} />
                  <SaveButton disabled={!isDirty()} onClick={() => onSave(values)} />
                </SlideViewNavBar>
              }
            >
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
                        <FormattedNumber value={fieldValues.length} />
                        {')'}
                      </>
                    }
                  />
                  <div className={CustomFieldsSectionWrapperStyle}>
                    <FieldItem
                      vertical
                      label={
                        <Label>
                          <FormattedMessage id="modules.form.template" defaultMessage="TEMPLATE" />
                        </Label>
                      }
                      input={
                        <BooleanValue>
                          {({ value: opened, set: slideToggle }) => (
                            <>
                              {!mask ? (
                                <DashedPlusButton
                                  width="195px"
                                  height="140px"
                                  onClick={() => slideToggle(true)}
                                />
                              ) : (
                                <MaskCard mask={mask} onClick={() => slideToggle(true)} />
                              )}

                              <SlideView
                                isOpen={opened}
                                onRequestClose={() => slideToggle(false)}
                                options={{ width: '980px' }}
                              >
                                {opened && (
                                  <CustomFieldsTemplateSelector
                                    entityType={entityType}
                                    selected={mask}
                                    onCancel={() => slideToggle(false)}
                                    onSave={item => {
                                      setFieldValue('mask', item);
                                      slideToggle(false);
                                    }}
                                  />
                                )}
                              </SlideView>
                            </>
                          )}
                        </BooleanValue>
                      }
                    />

                    <Divider />
                    <GridColumn gap="10px">
                      {fieldValues &&
                        fieldValues.map(({ value, fieldDefinition }, index) =>
                          mask == null || contains(fieldDefinition, mask.fieldDefinitions) ? (
                            <DefaultCustomFieldStyle
                              key={fieldDefinition.id}
                              isKeyReadOnly
                              targetName={`fieldValues.${index}`}
                              fieldName={fieldDefinition.name}
                              value={value}
                              setFieldArrayValue={setFieldValue}
                            />
                          ) : null
                        )}
                    </GridColumn>
                  </div>
                </SectionWrapper>
              </div>
            </Layout>
          );
        }}
      </Subscribe>
    );
  }
}

export default CustomFieldsForm;
