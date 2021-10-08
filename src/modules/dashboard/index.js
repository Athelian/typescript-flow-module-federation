// @flow
import * as React from 'react';
import { Redirect } from '@reach/router';

import {
  NAVIGATION_ORDERS_MAP,
  NAVIGATION_ORDERS_TABLE,
  NAVIGATION_ORDERS_CARD,
  NAVIGATION_SHIPMENTS_MAP,
  NAVIGATION_SHIPMENTS_TABLE,
  NAVIGATION_SHIPMENTS_TABLE_ΒETA,
  NAVIGATION_SHIPMENTS_CARD,
  NAVIGATION_PRODUCTS_CARD,
} from 'modules/permission/constants/navigation';

import LoadingIcon from 'components/LoadingIcon';
import { useViewerHasPermissions, useViewerPermissions } from 'contexts/Permissions';

const findRedirectUrlBaseOnPermission = (hasPermission: string => boolean) => {
  if (hasPermission([NAVIGATION_ORDERS_MAP, NAVIGATION_ORDERS_TABLE, NAVIGATION_ORDERS_CARD]))
    return 'shipment';
  if (
    hasPermission([
      NAVIGATION_SHIPMENTS_MAP,
      NAVIGATION_SHIPMENTS_TABLE,
      NAVIGATION_SHIPMENTS_TABLE_ΒETA,
      NAVIGATION_SHIPMENTS_CARD,
    ])
  )
    return 'order';
  if (hasPermission(NAVIGATION_PRODUCTS_CARD)) return 'product';
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
