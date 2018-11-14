// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Layout from 'components/Layout';
import ContentWrapper from 'components/ContentWrapper';

import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { SectionHeader, SectionWrapper } from 'components/Form';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import GridColumn from 'components/GridColumn';
import { FormField } from 'modules/form';
import { uuid } from 'utils/id';
import { textInputFactory, textAreaFactory } from 'modules/form/helpers';
import MetadataItem from './components/MetadataItem';
import { TemplateFormWrapperStyle, FormFieldsStyle, DescriptionLabelWrapperStyle } from './style';

type OptionalProps = {
  template: {
    name: string,
    description: string,
    metadata: [
      {
        checked: boolean,
        key: string,
        value: string,
      },
    ],
  },
};

type Props = OptionalProps & {
  isNew: boolean,
  onCancel: Function,
  onSave: Function,
};

const defaultProps = {
  template: {
    name: '',
    description: '',
    metadata: [],
  },
};

const CustomFieldsTemplateForm = ({
  template: { name, description, metadata },
  isNew,
  onCancel,
  onSave,
}: Props) => (
  <Layout
    navBar={
      <SlideViewNavBar>
        <EntityIcon icon="METADATA" color="METADATA" />
        <JumpToSection>
          <SectionTabs
            link="templateSection"
            label={<FormattedMessage id="modules.metadata.template" defaultMessage="TEMPLATE" />}
            icon="TEMPLATE"
          />
          <SectionTabs
            link="customFieldsSection"
            label={
              <FormattedMessage
                id="modules.metadata.customFieldsSection"
                defaultMessage="CUSTOM FIELDS"
              />
            }
            icon="METADATA"
          />
        </JumpToSection>
        <CancelButton onClick={onCancel} />
        <SaveButton onClick={onSave} />
      </SlideViewNavBar>
    }
  >
    <div className={TemplateFormWrapperStyle}>
      <SectionWrapper id="templateSection">
        <SectionHeader
          icon="TEMPLATE"
          title={<FormattedMessage id="modules.metadata.template" defaultMessage="TEMPLATE" />}
        />
        <ContentWrapper width="880px" className={FormFieldsStyle}>
          <GridColumn>
            <FormField name="name" initValue={name}>
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
                  originalValue: name,
                })
              }
            </FormField>

            <FormField name="description" initValue={description}>
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
                  originalValue: description,
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
            {metadata.map(item => (
              <MetadataItem key={uuid()} value={item} />
            ))}
          </div>
        </ContentWrapper>
      </SectionWrapper>
    </div>
  </Layout>
);

CustomFieldsTemplateForm.defaultProps = defaultProps;

export default CustomFieldsTemplateForm;
