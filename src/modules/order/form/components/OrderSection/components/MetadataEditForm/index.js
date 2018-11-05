// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Layout from 'components/Layout';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { SectionHeader, SectionWrapper } from 'components/Form';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import DefaultMetadataStyle from 'components/Form/Inputs/Styles/DefaultStyle/DefaultMetadataStyle';

import { MetadataFormWrapperStyle, MetadataSectionWrapperStyle } from './style';

type OptionalProps = {
  values: Array<Object>,
  onCancel: Function,
  onSave: Function,
};

type Props = OptionalProps & {};

const dummyMetadatas = [
  {
    key: '1',
    value: 1,
  },
  {
    key: '2',
    value: 2,
  },
  {
    key: '3',
    value: 3,
  },
  {
    key: '4',
    value: 4,
  },
];

const defaultProps = {
  values: dummyMetadatas,
  onCancel: () => {},
  onSave: () => {},
};

const MetadataEditForm = ({ values, onCancel, onSave }: Props) => (
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
                  id="modules.order.metadata.sectionHeader"
                  defaultMessage="CUSTOM FIELDS"
                />
                ({values.length})
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
    <div className={MetadataFormWrapperStyle}>
      <SectionWrapper id="metadataSection">
        <SectionHeader
          icon="METADATA"
          title={
            <>
              <FormattedMessage
                id="modules.order.metadata.sectionHeader"
                defaultMessage="CUSTOM FIELDS"
              />
              ({values.length})
            </>
          }
        />
        <div className={MetadataSectionWrapperStyle}>
          {values.map(metadata => (
            <div key={metadata.key}>
              <DefaultMetadataStyle
                targetName={`metadata_${metadata.key}`}
                width="200px"
                metadata={metadata}
                setFieldArrayValue={() => {}}
              />
            </div>
          ))}
        </div>
      </SectionWrapper>
    </div>
  </Layout>
);

MetadataEditForm.defaultProps = defaultProps;

export default MetadataEditForm;
