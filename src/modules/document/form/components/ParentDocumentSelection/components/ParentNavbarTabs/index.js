// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
  ORDER_LIST,
  ORDER_DOCUMENT_CREATE,
  ORDER_SET_DOCUMENTS,
  ORDER_UPDATE,
} from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_LIST,
  ORDER_ITEMS_DOCUMENT_CREATE,
  ORDER_ITEMS_SET_DOCUMENTS,
  ORDER_ITEMS_UPDATE,
} from 'modules/permission/constants/orderItem';
import {
  SHIPMENT_LIST,
  SHIPMENT_DOCUMENT_CREATE,
  SHIPMENT_DOCUMENT_SET,
  SHIPMENT_SET,
  SHIPMENT_UPDATE,
} from 'modules/permission/constants/shipment';
import { PROJECT_LIST, PROJECT_UPDATE } from 'modules/permission/constants/project';
import {
  MILESTONE_LIST,
  MILESTONE_UPDATE,
  MILESTONE_DOCUMENT_CREATE,
  MILESTONE_SET_DOCUMENTS,
} from 'modules/permission/constants/milestone';
import {
  PRODUCT_PROVIDER_LIST,
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_DOCUMENT_CREATE,
  PRODUCT_PROVIDER_SET_DOCUMENTS,
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
      hasPermission(ORDER_LIST) &&
      (hasPermission(ORDER_UPDATE) || hasPermission([ORDER_DOCUMENT_CREATE, ORDER_SET_DOCUMENTS])),
    orderItems:
      hasPermission(ORDER_ITEMS_LIST) &&
      (hasPermission(ORDER_ITEMS_UPDATE) ||
        hasPermission([ORDER_ITEMS_DOCUMENT_CREATE, ORDER_ITEMS_SET_DOCUMENTS])),
    shipments:
      hasPermission(SHIPMENT_LIST) &&
      (hasPermission([SHIPMENT_SET, SHIPMENT_UPDATE]) ||
        hasPermission([SHIPMENT_DOCUMENT_CREATE, SHIPMENT_DOCUMENT_SET])),
    projects:
      hasPermission(PROJECT_LIST) &&
      hasPermission(MILESTONE_LIST) &&
      hasPermission(PROJECT_UPDATE) &&
      (hasPermission(MILESTONE_UPDATE) ||
        hasPermission([MILESTONE_DOCUMENT_CREATE, MILESTONE_SET_DOCUMENTS])),
    productProviders:
      hasPermission(PRODUCT_PROVIDER_LIST) &&
      (hasPermission(PRODUCT_PROVIDER_UPDATE) ||
        hasPermission([PRODUCT_PROVIDER_DOCUMENT_CREATE, PRODUCT_PROVIDER_SET_DOCUMENTS])),
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
