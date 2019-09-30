// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { ResetButton, SaveButton } from 'components/Buttons';
import { isNullOrUndefined } from 'utils/fp';
import { FormContainer, resetFormState } from 'modules/form';
import { FormContext } from './context';
import MilestoneSection from './components/MilestoneSection';
import DocumentsSection from './components/DocumentsSection';

import validator from './validator';

import { MilestoneBaseContainer, MilestoneFilesContainer } from './containers';

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
                  </JumpToSection>

                  {(milestoneStateContainer.isDirty() || filesContainer.isDirty()) && (
                    <>
                      <ResetButton
                        onClick={() => {
                          resetFormState(milestoneStateContainer);
                          resetFormState(filesContainer);
                          formContainer.onReset();
                        }}
                      />
                      <SaveButton
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
            <MilestoneSection />

            <DocumentsSection />
          </Content>
        </SlideViewLayout>
      </Provider>
    </FormContext.Provider>
  );
};

MilestoneFormSlide.defaultProps = defaultProps;

export default MilestoneFormSlide;
