// @flow
import * as React from 'react';
import { Redirect } from '@reach/router';
import { ORDER_LIST } from 'modules/permission/constants/order';
import { SHIPMENT_LIST } from 'modules/permission/constants/shipment';
import { PRODUCT_LIST } from 'modules/permission/constants/product';
import LoadingIcon from 'components/LoadingIcon';
import { useViewerHasPermissions, useViewerPermissions } from 'contexts/Permissions';

const findRedirectUrlBaseOnPermission = (hasPermission: string => boolean) => {
  if (hasPermission(SHIPMENT_LIST)) return 'shipment';
  if (hasPermission(ORDER_LIST)) return 'order';
  if (hasPermission(PRODUCT_LIST)) return 'product';
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
