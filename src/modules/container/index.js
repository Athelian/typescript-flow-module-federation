// @flow
import React from 'react';
import { Router } from '@reach/router';
import ContainerListModule from './index.list';
import ContainerFormModule from './index.form';

const ContainerModule = () => (
  <Router>
    <ContainerListModule path="/" />
    <ContainerFormModule path=":containerId" />
  </Router>
);

export default ContainerModule;
