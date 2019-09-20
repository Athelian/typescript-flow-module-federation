// @flow
import React from 'react';
import { Router } from '@reach/router';
import ProjectTemplateListPage from './list';

const ProjectTemplateModule = () => (
  <Router>
    <ProjectTemplateListPage path="/" />
  </Router>
);

export default ProjectTemplateModule;
