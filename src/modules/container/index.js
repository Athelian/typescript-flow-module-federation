// @flow
import React from 'react';
import { Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { CONTAINER_LIST, CONTAINER_FORM } from 'modules/permission/constants/container';
import ContainerListModule from './index.list';
import ContainerFormModule from './index.form';

const ContainerFormModuleWrapper = withNotFound(ContainerFormModule, 'containerId');
const ContainerFormModuleDetailWrapper = withForbidden(ContainerFormModuleWrapper, CONTAINER_FORM);
const ContainerModuleListWrapper = withForbidden(ContainerListModule, CONTAINER_LIST);

const ContainerModule = () => {
  return (
    <Router>
      <ContainerModuleListWrapper path="/" />
      <ContainerFormModuleDetailWrapper path=":containerId" />
    </Router>
  );
};
export default ContainerModule;
