// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';

type Props = {
  filterAndSort: Object,
  onChangeFilter: Function,
  activeType: string,
};

const ParentNavbarTabs = ({ filterAndSort, onChangeFilter, activeType }: Props) => {
  return (
    <>
      <TabItem
        active={activeType === 'Order'}
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
