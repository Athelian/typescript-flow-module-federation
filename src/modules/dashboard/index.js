// @flow
import * as React from 'react';
import { Redirect } from '@reach/router';

import {
  NAVIGATION_ORDERS_LIST,
  NAVIGATION_SHIPMENTS_LIST,
  NAVIGATION_PRODUCTS_LIST,
} from 'modules/permission/constants/navigation';

import LoadingIcon from 'components/LoadingIcon';
import { useViewerHasPermissions, useViewerPermissions } from 'contexts/Permissions';

const findRedirectUrlBaseOnPermission = (hasPermission: string => boolean) => {
  if (hasPermission(NAVIGATION_SHIPMENTS_LIST)) return 'shipment';
  if (hasPermission(NAVIGATION_ORDERS_LIST)) return 'order';
  if (hasPermission(NAVIGATION_PRODUCTS_LIST)) return 'product';
  return '403';
};

const DashBoard = () => {
  const { loading } = useViewerPermissions();
  const hasPermission = useViewerHasPermissions();
  return loading ? (
    <LoadingIcon />
  ) : (
    <Redirect to={findRedirectUrlBaseOnPermission(hasPermission)} noThrow />
  );
};

export default DashBoard;
