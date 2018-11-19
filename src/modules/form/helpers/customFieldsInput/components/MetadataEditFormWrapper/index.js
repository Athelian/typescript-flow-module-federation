// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import Layout from 'components/Layout';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { SectionHeader, SectionWrapper } from 'components/Form';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import MetadataEditForm from '../MetadataEditForm';
import { MetadataEditFormWrapperStyle } from './style';

type OptionalProps = {
  customFields: Object,
  onFormReady: () => void,
};

type Props = OptionalProps & {
  onCancel: Function,
  onSave: Function,
};

const defaultProps = {
  onFormReady: () => {},
};

class MetadataEditFormWrapper extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  render() {
    const { customFields, onCancel, onSave } = this.props;

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
                    <FormattedNumber value={customFields.fieldValues.length} />
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
                  <FormattedNumber value={customFields.fieldValues.length} />
                  {')'}
                </>
              }
            />
            <MetadataEditForm />
          </SectionWrapper>
        </div>
      </Layout>
    );
  }
}

export default MetadataEditFormWrapper;
