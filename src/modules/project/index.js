import React from 'react';
import { Router } from '@reach/router';
import ProjectListModule from './index.list';
import ProjectFormModule from './index.form';

const ProjectApp = () => (
  <Router>
    <ProjectListModule path="/" />
    <ProjectFormModule path="new" />
    <ProjectFormModule path=":projectId" />
  </Router>
);

export default ProjectApp;
