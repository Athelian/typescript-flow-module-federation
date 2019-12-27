// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Content, FormLayout, SlideViewNavBar, SlideViewLayout } from 'components/Layout';
import { NavBar, EntityIcon, LogsButton } from 'components/NavBar';
import Timeline from 'modules/timeline/components/Timeline';
import SlideView from 'components/SlideView';
import ResetFormButton from 'components/ResetFormButton';
import SaveFormButton from 'components/SaveFormButton';
import LoadingIcon from 'components/LoadingIcon';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { decodeId } from 'utils/id';
import { SectionWrapper } from 'components/Form';
import DocumentSection from './components/DocumentSection';
import ParentSection from './components/ParentSection';
import { documentTimelineQuery } from './query';

type Props = {
  documentId?: string,
  isDirty: boolean,
  isValidated: boolean,
  resetState: () => void,
  isSlideView?: boolean,
  isLoading?: boolean,
  isProcessing?: boolean,
  handleSave?: Function,
};

const DocumentForm = ({
  documentId,
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

        {!isSlideView && documentId && (
          <BooleanValue>
            {({ value: isOpen, set: toggleLogs }) => (
              <>
                <LogsButton
                  entityType="file"
                  entityId={documentId}
                  onClick={() => toggleLogs(true)}
                />
                <SlideView isOpen={isOpen} onRequestClose={() => toggleLogs(false)}>
                  <SlideViewLayout>
                    <SlideViewNavBar>
                      <EntityIcon icon="LOGS" color="LOGS" />
                    </SlideViewNavBar>

                    <Content>
                      <Timeline
                        query={documentTimelineQuery}
                        queryField="file"
                        variables={{
                          id: decodeId(documentId),
                        }}
                        entity={{
                          fileId: decodeId(documentId),
                        }}
                      />
                    </Content>
                  </SlideViewLayout>
                </SlideView>
              </>
            )}
          </BooleanValue>
        )}

        {isDirty && <ResetFormButton onClick={resetState} />}

        {isDirty && (
          <SaveFormButton
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
