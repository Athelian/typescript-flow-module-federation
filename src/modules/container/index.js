// @flow
import React from 'react';
import { Router, Redirect } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { NAVIGATION_CONTAINERS_LIST } from 'modules/permission/constants/navigation';
import ContainerListModule from './index.list';
import ContainerFormModule from './index.form';

const ContainerFormModuleWrapper = withNotFound(ContainerFormModule, 'containerId');
const ContainerModuleListWrapper = withForbidden(ContainerListModule, NAVIGATION_CONTAINERS_LIST);

const ContainerModule = () => {
  return (
    <Router>
      {/* $FlowFixMe Flow typed is not updated yet */}
      <Redirect path="/" from="/" to="/container/cards" noThrow />
      <ContainerModuleListWrapper path="/cards" />
      <ContainerFormModuleWrapper path=":containerId" />
    </Router>
  );
};
export default ContainerModule;
