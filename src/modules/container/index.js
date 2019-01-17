// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import ContainerList from './index.list';

const ContainerModule = () => (
  <Router>
    <ContainerList path="/" />
  </Router>
);

export default ContainerModule;
