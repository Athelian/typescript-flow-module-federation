// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import ResetFormButton from 'components/ResetFormButton';
import SaveFormButton from 'components/SaveFormButton';
import { isNullOrUndefined } from 'utils/fp';
import { FormContainer, resetFormState } from 'modules/form';
import { FormContext } from './context';
import MilestoneSection from './components/MilestoneSection';
import DocumentsSection from './components/DocumentsSection';

import validator from './validator';

import { MilestoneBaseContainer, MilestoneFilesContainer } from './containers';
import { FormWrapperStyle } from './style';

type OptionalProps = {
  inTemplate: boolean,
};

type Props = OptionalProps & {
  onSave: Function,
  milestone: Object,
};

const defaultProps = {
  inTemplate: false,
};

const MilestoneFormSlide = ({ milestone, inTemplate, onSave }: Props) => {
  return (
    <FormContext.Provider
      value={{
        inTemplate,
      }}
    >
      <Provider>
        <Subscribe to={[MilestoneBaseContainer, MilestoneFilesContainer]}>
          {({ state, initDetailValues }, filesContainer) => {
            const { files = [], ...rest } = milestone;
            if (isNullOrUndefined(state.id)) {
              initDetailValues(rest);
              filesContainer.initDetailValues(files);
            }
            return null;
          }}
        </Subscribe>

        <SlideViewLayout>
          <Subscribe to={[FormContainer, MilestoneBaseContainer, MilestoneFilesContainer]}>
            {(formContainer, milestoneStateContainer, filesContainer) => {
              return (
                <SlideViewNavBar>
                  <EntityIcon icon="MILESTONE" color="MILESTONE" />
                  <JumpToSection>
                    <SectionTabs
                      link="milestone_section"
                      label={<FormattedMessage id="common.milestone" defaultMessage="MILESTONE" />}
                      icon="MILESTONE"
                    />
                    <SectionTabs
                      link="milestone_documentsSection"
                      label={<FormattedMessage id="common.documents" defaultMessage="DOCUMENTS" />}
                      icon="DOCUMENT"
                    />
                  </JumpToSection>

                  {(milestoneStateContainer.isDirty() || filesContainer.isDirty()) && (
                    <>
                      <ResetFormButton
                        onClick={() => {
                          resetFormState(milestoneStateContainer);
                          resetFormState(filesContainer, 'files');
                          formContainer.onReset();
                        }}
                      />
                      <SaveFormButton
                        id="milestone_form_save_button"
                        disabled={!formContainer.isReady(milestoneStateContainer.state, validator)}
                        onClick={() => {
                          const data = {
                            ...milestoneStateContainer.state,
                            ...filesContainer.state,
                          };
                          onSave(data);
                        }}
                      />
                    </>
                  )}
                </SlideViewNavBar>
              );
            }}
          </Subscribe>

          <Content>
            <div className={FormWrapperStyle}>
              <MilestoneSection />

              {!inTemplate && <DocumentsSection />}
            </div>
          </Content>
        </SlideViewLayout>
      </Provider>
    </FormContext.Provider>
  );
};

MilestoneFormSlide.defaultProps = defaultProps;

export default MilestoneFormSlide;
