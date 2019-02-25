// @flow
import * as React from 'react';
import { ORDER_LIST } from 'modules/permission/constants/order';
import { SHIPMENT_LIST } from 'modules/permission/constants/shipment';
import { PRODUCT_LIST } from 'modules/permission/constants/product';
import usePermission from 'hooks/usePermission';
import { Redirect } from '@reach/router';

const findRedirectUrlBaseOnPermission = (hasPermission: string => boolean) => {
  if (hasPermission(ORDER_LIST)) return 'order';
  if (hasPermission(PRODUCT_LIST)) return 'product';
  if (hasPermission(SHIPMENT_LIST)) return 'shipment';
  return '403';
};

const DashBoard = () => {
  const { hasPermission } = usePermission();
  return <Redirect to={findRedirectUrlBaseOnPermission(hasPermission)} noThrow />;
};

export default DashBoard;
