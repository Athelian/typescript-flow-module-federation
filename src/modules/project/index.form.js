// @flow
import React from 'react';
// import { FormattedMessage } from 'react-intl';
import { Provider } from 'unstated';
import Layout from 'components/Layout';
import { QueryForm } from 'components/common';
import NavBar, { EntityIcon } from 'components/NavBar';
import { UIConsumer } from 'modules/ui';
import ProjectForm from './form';
import { projectFormQuery } from './form/query';

type Props = {
  projectId?: string,
};

const ProjectFormModule = ({ projectId }: Props) => (
  <Provider>
    <UIConsumer>
      {uiState => (
        <Layout
          {...uiState}
          navBar={
            <NavBar>
              <EntityIcon icon="PROJECT" color="PROJECT" />
            </NavBar>
          }
        >
          <QueryForm
            query={projectFormQuery}
            entityId={projectId}
            entityType="project"
            render={() => <ProjectForm />}
          />
        </Layout>
      )}
    </UIConsumer>
  </Provider>
);

export default ProjectFormModule;
