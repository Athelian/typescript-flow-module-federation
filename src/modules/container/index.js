// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import { Provider } from 'unstated';
import ContainerList from './index.list';

const ContainerModule = () => (
  <Provider>
    <Router>
      <ContainerList path="/" />
    </Router>
  </Provider>
);

export default ContainerModule;
