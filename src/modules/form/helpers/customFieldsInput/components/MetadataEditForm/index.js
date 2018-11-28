// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
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
import { SectionHeader, SectionWrapper, Label, DashedPlusButton } from 'components/Form';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import CustomFieldsContainer from 'modules/form/helpers/customFieldsInput/container';
import SelectMask from 'modules/form/helpers/customFieldsInput/components/SelectMask';

import { MetadataEditFormWrapperStyle, MetadataSectionWrapperStyle } from './style';

type OptionalProps = {
  onFormReady: () => void,
};

type Props = OptionalProps & {
  entityType: string,
  fieldDefinitions: Array<Object>,
  onCancel: Function,
  onSave: Function,
};

const defaultProps = {
  onFormReady: () => {},
};

class MetadataEditForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  render() {
    const { entityType, fieldDefinitions, onCancel, onSave } = this.props;

    return (
      <Subscribe to={[CustomFieldsContainer]}>
        {({ originalValues, state, setFieldArrayValue }) => {
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
                        <>
                          <FormattedMessage
                            id="modules.metadata.sectionHeader"
                            defaultMessage="CUSTOM FIELDS"
                          />
                          {' ('}
                          <FormattedNumber value={fieldValues.length} />
                          {')'}
                        </>
                      }
                      icon="METADATA"
                    />
                  </JumpToSection>
                  <CancelButton onClick={onCancel} />
                  <SaveButton onClick={onSave} />
                </SlideViewNavBar>
              }
            >
              <div className={MetadataEditFormWrapperStyle}>
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
                </SectionWrapper>
                <div className={MetadataSectionWrapperStyle}>
                  <div>
                    <Label>
                      <FormattedMessage id="modules.form.template" defaultMessage="TEMPLATE" />
                    </Label>
                    <BooleanValue>
                      {({ value: opened, set: slideToggle }) => (
                        <>
                          {!mask ? (
                            <DashedPlusButton
                              width="195px"
                              height="217px"
                              onClick={() => slideToggle(true)}
                            />
                          ) : (
                            <MaskCard
                              selectable
                              mask={mask}
                              onSelect={() => slideToggle(true)}
                              readOnly
                            />
                          )}

                          <SlideView
                            isOpen={opened}
                            onRequestClose={() => slideToggle(false)}
                            options={{ width: '980px' }}
                          >
                            {opened && (
                              <SelectMask
                                entityType={entityType}
                                selected={mask}
                                onCancel={() => slideToggle(false)}
                                onSave={item => {
                                  if (item) {
                                    setFieldArrayValue('mask', item);
                                    setFieldArrayValue(
                                      'fieldValues',
                                      item.fieldDefinitions.map(fieldDefinition => ({
                                        value: {},
                                        fieldDefinition,
                                        entityType,
                                      }))
                                    );
                                  } else {
                                    setFieldArrayValue('mask', null);
                                    setFieldArrayValue(
                                      'fieldValues',
                                      fieldDefinitions.map(fieldDefinition => ({
                                        value: {},
                                        fieldDefinition,
                                        entityType,
                                      }))
                                    );
                                  }

                                  slideToggle(false);
                                }}
                              />
                            )}
                          </SlideView>
                        </>
                      )}
                    </BooleanValue>
                  </div>

                  <Divider />
                  <GridColumn gap="10px">
                    {fieldValues &&
                      fieldValues.map(({ value, fieldDefinition }, index) => (
                        <DefaultCustomFieldStyle
                          key={fieldDefinition.id}
                          isKeyReadOnly
                          targetName={`fieldValues.${index}`}
                          fieldName={fieldDefinition.name}
                          value={value}
                          setFieldArrayValue={setFieldArrayValue}
                        />
                      ))}
                  </GridColumn>
                </div>
              </div>
            </Layout>
          );
        }}
      </Subscribe>
    );
  }
}

export default MetadataEditForm;
