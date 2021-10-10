import React from 'react';
import { Redirect, Router } from '@reach/router';
import withForbidden from 'hoc/withForbidden';
import { NAVIGATION_PROJECT_LIST } from 'modules/permission/constants/navigation';
import ProjectListModule from './index.list';
import ProjectFormModule from './index.form';
import ProjectSheetModule from './sheet';

const ProjectSheetModuleWrapper = withForbidden(ProjectSheetModule, NAVIGATION_PROJECT_LIST);

const ProjectApp = () => (
  <Router>
    {/* $FlowFixMe Flow typed is not updated yet */}
    <Redirect path="/" from="/" to="/project/cards" noThrow />
    <ProjectListModule path="/cards" />
    <ProjectSheetModuleWrapper path="/table" />
    <ProjectFormModule path="new" />
    <ProjectFormModule path=":projectId" />
  </Router>
);

export default ProjectApp;
