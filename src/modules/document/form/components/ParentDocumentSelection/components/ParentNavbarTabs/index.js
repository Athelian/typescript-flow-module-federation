// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
// import { DOCUMENT_UPDATE } from 'modules/permission/constants/file';
import { ORDER_LIST } from 'modules/permission/constants/order';
import { ORDER_ITEMS_LIST } from 'modules/permission/constants/orderItem';
import { PROJECT_LIST } from 'modules/permission/constants/project';
import { PRODUCT_PROVIDER_LIST } from 'modules/permission/constants/product';
import {
  SHIPMENT_LIST,
  // SHIPMENT_DOCUMENT_SET_ENTITY,
  // SHIPMENT_UPDATE,
} from 'modules/permission/constants/shipment';

import TabItem from 'components/NavBar/components/Tabs/components/TabItem';

type Props = {
  filterAndSort: Object,
  onChangeFilter: Function,
  activeType: string,
};

const ParentNavbarTabs = ({ filterAndSort, onChangeFilter, activeType }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  // console.log('isOwner', isOwner);
  // console.log('SHIPMENT_UPDATE', hasPermission(SHIPMENT_UPDATE));
  // console.log('SHIPMENT_DOCUMENT_SET_ENTITY', hasPermission(SHIPMENT_DOCUMENT_SET_ENTITY));
  // console.log('DOCUMENT_UPDATE', hasPermission(DOCUMENT_UPDATE));

  const canViewList = {
    orders: hasPermission(ORDER_LIST),
    orderItems: hasPermission(ORDER_ITEMS_LIST),
    shipments: hasPermission(SHIPMENT_LIST),
    projects: hasPermission(PROJECT_LIST),
    productProviders: hasPermission(PRODUCT_PROVIDER_LIST),
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
