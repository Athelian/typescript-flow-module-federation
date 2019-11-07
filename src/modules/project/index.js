import React from 'react';
import { Router } from '@reach/router';
import withForbidden from 'hoc/withForbidden';
import { PROJECT_LIST } from 'modules/permission/constants/project';
import ProjectListModule from './index.list';
import ProjectFormModule from './index.form';
import ProjectSheetModule from './sheet';

const ProjectSheetModuleWrapper = withForbidden(ProjectSheetModule, PROJECT_LIST);

const ProjectApp = () => (
  <Router>
    <ProjectListModule path="/" />
    <ProjectSheetModuleWrapper path="/table" />
    <ProjectFormModule path="new" />
    <ProjectFormModule path=":projectId" />
  </Router>
);

export default ProjectApp;
