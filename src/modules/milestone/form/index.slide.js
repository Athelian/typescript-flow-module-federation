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
import MilestoneFrom from './index';
import validator from './validator';

import MilestoneStateContainer from './container';

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
  const formContainer = new FormContainer();
  return (
    <FormContext.Provider
      value={{
        inTemplate,
      }}
    >
      <Provider inject={[formContainer]}>
        <SlideViewLayout>
          <Subscribe to={[MilestoneStateContainer]}>
            {milestoneStateContainer => {
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

                  {milestoneStateContainer.isDirty() && (
                    <>
                      <ResetButton
                        onClick={() => {
                          resetFormState(milestoneStateContainer);
                          formContainer.onReset();
                        }}
                      />
                      <SaveButton
                        disabled={!formContainer.isReady(milestoneStateContainer.state, validator)}
                        onClick={() => onSave(milestoneStateContainer.state)}
                      />
                    </>
                  )}
                </SlideViewNavBar>
              );
            }}
          </Subscribe>

          <Content>
            <Subscribe to={[MilestoneStateContainer]}>
              {({ state, initDetailValues }) => {
                if (isNullOrUndefined(state.id)) {
                  initDetailValues(milestone);
                }
                return null;
              }}
            </Subscribe>
            <MilestoneFrom />
          </Content>
        </SlideViewLayout>
      </Provider>
    </FormContext.Provider>
  );
};

MilestoneFormSlide.defaultProps = defaultProps;

export default MilestoneFormSlide;
