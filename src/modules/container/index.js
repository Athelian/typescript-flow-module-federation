// @flow
import React from 'react';
import { Router } from '@reach/router';
import { CONTAINER_LIST, CONTAINER_GET } from 'modules/permission/constants/container';
import usePermission from 'hooks/usePermission';
import ContainerListModule from './index.list';
import ContainerFormModule from './index.form';

const ContainerModule = () => {
  const { hasPermission } = usePermission();

  return (
    <Router>
      {hasPermission(CONTAINER_LIST) && <ContainerListModule path="/" />}
      {hasPermission(CONTAINER_GET) && <ContainerFormModule path=":containerId" />}
    </Router>
  );
};
export default ContainerModule;
