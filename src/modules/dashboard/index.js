// @flow
import * as React from 'react';
import { ORDER_LIST } from 'modules/permission/constants/order';
import usePermission from 'hooks/usePermission';
import { Redirect } from '@reach/router';

const DashBoard = () => {
  const { hasPermission } = usePermission();
  return hasPermission(ORDER_LIST) ? (
    <Redirect to="order" noThrow />
  ) : (
    <Redirect to="product" noThrow />
  );
};

export default DashBoard;
