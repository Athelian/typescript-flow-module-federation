// @flow
import * as React from 'react';
import { Redirect } from '@reach/router';
import {
  RM_ORDER_FOCUS_LIST,
  RM_PRODUCT_FOCUS_LIST,
} from 'modules/permission/constants/relationMap';
import { ORDER_LIST } from 'modules/permission/constants/order';
import { SHIPMENT_LIST } from 'modules/permission/constants/shipment';
import { PRODUCT_LIST } from 'modules/permission/constants/product';
import LoadingIcon from 'components/LoadingIcon';
import { useHasPermissions, usePermissions } from 'components/Context/Permissions';
import useUser from 'hooks/useUser';

const findRedirectUrlBaseOnPermission = (hasPermission: string => boolean) => {
  if (hasPermission(RM_ORDER_FOCUS_LIST)) return 'relation-map/order';
  if (hasPermission(RM_PRODUCT_FOCUS_LIST)) return 'relation-map/products';
  if (hasPermission(ORDER_LIST)) return 'order';
  if (hasPermission(PRODUCT_LIST)) return 'product';
  if (hasPermission(SHIPMENT_LIST)) return 'shipment';
  return '403';
};

const DashBoard = () => {
  const { organization } = useUser();
  const { loading } = usePermissions(organization?.id);
  const hasPermission = useHasPermissions(organization?.id);

  return loading ? (
    <LoadingIcon />
  ) : (
    <Redirect to={findRedirectUrlBaseOnPermission(hasPermission)} noThrow />
  );
};

export default DashBoard;
