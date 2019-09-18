// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
// import { useQuery } from '@apollo/react-hooks';
import { Provider, Subscribe } from 'unstated';

import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { ResetButton, SaveButton } from 'components/Buttons';
// import LoadingIcon from 'components/LoadingIcon';
import { FormContainer, resetFormState } from 'modules/form';
import TemplateInfoSection from './components/TemplateInfoSection';
import ProjectInfoSection from './components/ProjectInfoSection';
import MilestonesSection from './components/MilestonesSection';

import ProjectTemplateContainer from './container';
import { validator } from './validator';
// import { projectTemplateFormQuery } from './query';

import { CommonFormWrapperStyle } from './style';

import { data } from './data';

type Props = {
  id: string,
};

const ProjectTemplateFormInSlide = ({ id }: Props) => {
  console.debug(id);

  // const { loading, error, data } = useQuery(projectTemplateFormQuery, {
  //   variables: { id },
  // });
  // if (loading) {
  //   return <LoadingIcon />;
  // }

  // const template = data.projectTemplate;
  const template = data;

  const formContainer = new FormContainer();
  return (
    <Provider inject={[formContainer]}>
      {/* init */}
      <Subscribe to={[ProjectTemplateContainer]}>
        {({ state, initDetailValues }) => {
          if (!state.id) {
            console.debug(state);
            initDetailValues(template);
          }
          return null;
        }}
      </Subscribe>

      <SlideViewLayout>
        <Subscribe to={[ProjectTemplateContainer]}>
          {container => {
            return (
              <SlideViewNavBar>
                <EntityIcon icon="TEMPLATE" color="TEMPLATE" />
                <JumpToSection>
                  <SectionTabs
                    link="template_info_section"
                    label={<FormattedMessage id="common.template" defaultMessage="Template" />}
                    icon="TEMPLATE"
                  />

                  <SectionTabs
                    link="project_info_section"
                    label={<FormattedMessage id="common.project" defaultMessage="Project" />}
                    icon="PROJECT"
                  />

                  <SectionTabs
                    link="milestones_section"
                    label={<FormattedMessage id="common.milestone" defaultMessage="Milestone" />}
                    icon="MILESTONE"
                  />
                </JumpToSection>

                {container.isDirty() && (
                  <>
                    <ResetButton
                      onClick={() => {
                        resetFormState(container);
                        formContainer.onReset();
                      }}
                    />
                    <SaveButton
                      disabled={!formContainer.isReady(container.state, validator)}
                      onClick={() => {
                        console.debug(container.state);
                        // mutations
                        // optimistic UI, https://www.apollographql.com/docs/react/features/optimistic-ui/
                      }}
                    />
                  </>
                )}
              </SlideViewNavBar>
            );
          }}
        </Subscribe>

        {/* {error && error.message} */}
        <Content>
          <div className={CommonFormWrapperStyle}>
            <TemplateInfoSection />
            <ProjectInfoSection />
            <MilestonesSection />
          </div>
        </Content>
      </SlideViewLayout>
    </Provider>
  );
};

export default ProjectTemplateFormInSlide;
