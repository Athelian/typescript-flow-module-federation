// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Content, FormLayout, SlideViewNavBar } from 'components/Layout';
import { NavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, ResetButton } from 'components/Buttons';
import LoadingIcon from 'components/LoadingIcon';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { SectionWrapper } from 'components/Form';
import DocumentSection from './components/DocumentSection';
import ParentSection from './components/ParentSection';

type Props = {
  isDirty: boolean,
  isValidated: boolean,
  resetState: () => void,
  isSlideView?: boolean,
  isLoading?: boolean,
  isProcessing?: boolean,
  handleSave?: Function,
};

const DocumentForm = ({
  isDirty,
  isValidated,
  resetState,
  isSlideView,
  isLoading,
  isProcessing,
  handleSave,
}: Props) => {
  const CurrentNavBar = isSlideView ? SlideViewNavBar : NavBar;

  return (
    <>
      <CurrentNavBar>
        <EntityIcon icon="DOCUMENT" color="DOCUMENT" />
        <JumpToSection>
          <SectionTabs
            link="document_documentSection"
            label={
              <FormattedMessage id="modules.Documents.documentSection" defaultMessage="Document" />
            }
            icon="DOCUMENT"
          />

          {!isSlideView && (
            <SectionTabs
              link="document_parentSection"
              label={
                <FormattedMessage id="modules.Documents.parentSection" defaultMessage="Parent" />
              }
              icon="PARENT"
            />
          )}
        </JumpToSection>

        {/* TODO: Logs Button */}

        {isDirty && <ResetButton onClick={resetState} />}

        {isDirty && (
          <SaveButton
            id="document_form_save_button"
            disabled={!isValidated}
            isLoading={isProcessing}
            onClick={handleSave}
          />
        )}
      </CurrentNavBar>

      <Content>
        {isLoading ? (
          <LoadingIcon />
        ) : (
          <FormLayout>
            <SectionWrapper id="document_documentSection">
              <DocumentSection />
            </SectionWrapper>

            {!isSlideView && (
              <SectionWrapper id="document_parentSection">
                <ParentSection />
              </SectionWrapper>
            )}
          </FormLayout>
        )}
      </Content>
    </>
  );
};

export default DocumentForm;
