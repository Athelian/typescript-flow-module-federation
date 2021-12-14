// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
  NAVIGATION_ORDERS_LIST,
  NAVIGATION_ORDER_ITEMS_LIST,
  NAVIGATION_SHIPMENTS_LIST,
  NAVIGATION_PROJECTS_LIST,
} from 'modules/permission/constants/navigation';
import { ORDER_UPDATE, ORDER_DOCUMENT_EDIT } from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_DOCUMENT_EDIT,
  ORDER_ITEMS_UPDATE,
} from 'modules/permission/constants/orderItem';
import { SHIPMENT_EDIT, SHIPMENT_DOCUMENT_EDIT } from 'modules/permission/constants/shipment';
import { PROJECT_UPDATE } from 'modules/permission/constants/project';
import {
  MILESTONE_LIST,
  MILESTONE_UPDATE,
  MILESTONE_DOCUMENT_EDIT,
} from 'modules/permission/constants/milestone';
import {
  PRODUCT_PROVIDER_LIST,
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_DOCUMENT_EDIT,
} from 'modules/permission/constants/product';

import TabItem from 'components/NavBar/components/Tabs/components/TabItem';

type Props = {
  filterAndSort: Object,
  onChangeFilter: Function,
  activeType: string,
};

const ParentNavbarTabs = ({ filterAndSort, onChangeFilter, activeType }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const canViewList = {
    orders:
      hasPermission(NAVIGATION_ORDERS_LIST) && hasPermission([ORDER_UPDATE, ORDER_DOCUMENT_EDIT]),
    orderItems:
      hasPermission(NAVIGATION_ORDER_ITEMS_LIST) &&
      hasPermission([ORDER_ITEMS_UPDATE, ORDER_ITEMS_DOCUMENT_EDIT]),
    shipments:
      hasPermission(NAVIGATION_SHIPMENTS_LIST) &&
      hasPermission([SHIPMENT_EDIT, SHIPMENT_DOCUMENT_EDIT]),
    projects:
      hasPermission(NAVIGATION_PROJECTS_LIST) &&
      hasPermission(MILESTONE_LIST) &&
      hasPermission(PROJECT_UPDATE) &&
      (hasPermission(MILESTONE_UPDATE) || hasPermission(MILESTONE_DOCUMENT_EDIT)),
    productProviders:
      hasPermission(PRODUCT_PROVIDER_LIST) &&
      (hasPermission(PRODUCT_PROVIDER_UPDATE) || hasPermission(PRODUCT_PROVIDER_DOCUMENT_EDIT)),
  };

  return (
    <>
      <TabItem
        active={activeType === 'Order'}
        disabled={!canViewList.orders}
        label={<FormattedMessage id="modules.documents.navbar.orders" defaultMessage="ORDERS" />}
        icon="ORDER"
        onClick={() => {
          if (activeType !== 'Order') {
            onChangeFilter({
              ...filterAndSort,
              filter: { ...filterAndSort.filter, entityTypes: ['Order'] },
            });
          }
        }}
      />
      <TabItem
        active={activeType === 'OrderItem'}
        disabled={!canViewList.orderItems}
        label={<FormattedMessage id="modules.documents.navbar.orderItems" defaultMessage="ITEMS" />}
        icon="ORDER_ITEM"
        onClick={() => {
          if (activeType !== 'OrderItem') {
            onChangeFilter({
              ...filterAndSort,
              filter: { ...filterAndSort.filter, entityTypes: ['OrderItem'] },
            });
          }
        }}
      />
      <TabItem
        active={activeType === 'Shipment'}
        disabled={!canViewList.shipments}
        label={
          <FormattedMessage id="modules.documents.navbar.shipments" defaultMessage="SHIPMENTS" />
        }
        icon="SHIPMENT"
        onClick={() => {
          if (activeType !== 'Shipment') {
            onChangeFilter({
              ...filterAndSort,
              filter: { ...filterAndSort.filter, entityTypes: ['Shipment'] },
            });
          }
        }}
      />
      <TabItem
        active={activeType === 'Milestone'}
        disabled={!canViewList.projects}
        label={
          <FormattedMessage id="modules.documents.navbar.milestones" defaultMessage="MILESTONES" />
        }
        icon="MILESTONE"
        onClick={() => {
          if (activeType !== 'Milestone') {
            onChangeFilter({
              ...filterAndSort,
              filter: { ...filterAndSort.filter, entityTypes: ['Milestone'] },
            });
          }
        }}
      />
      <TabItem
        active={activeType === 'ProductProvider'}
        disabled={!canViewList.productProviders}
        label={
          <FormattedMessage
            id="modules.documents.navbar.endProducts"
            defaultMessage="END PRODUCTS"
          />
        }
        icon="PRODUCT_PROVIDER"
        onClick={() => {
          if (activeType !== 'ProductProvider') {
            onChangeFilter({
              ...filterAndSort,
              filter: { ...filterAndSort.filter, entityTypes: ['ProductProvider'] },
            });
          }
        }}
      />
    </>
  );
};

export default ParentNavbarTabs;
