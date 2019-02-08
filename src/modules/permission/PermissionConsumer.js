// @flow
import React from 'react';
import PermissionContext from './PermissionContext';

const hasPermission = permissions => path => permissions.includes(path);

const PermissionConsumer = ({ children }: { children: Function }) => (
  <PermissionContext.Consumer>
    {({ permissions }) => {
      return children(hasPermission(permissions));
    }}
  </PermissionContext.Consumer>
);

export default PermissionConsumer;
