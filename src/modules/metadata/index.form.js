// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider } from 'unstated';
import withCache from 'hoc/withCache';
import useFilter from 'hooks/useFilter';
import { getByPathWithDefault } from 'utils/fp';
import Portal from 'components/Portal';
import { EntityIcon } from 'components/NavBar';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import FieldDefinitionsFormWrapper from 'modules/metadata/components/FieldDefinitionsFormWrapper';
import MaskList from 'modules/metadata/components/MaskList';
import { MainContentWrapperStyle } from './style';

const initFilter = {
  filter: {
    entityTypes: ['Order'],
  },
  sort: {
    field: 'updatedAt',
    direction: 'DESCENDING',
  },
  perPage: 10,
  page: 1,
};

const MetadataForm = () => {
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    initFilter,
    `filterCustomFieldsTemplate`
  );
  const activeType = getByPathWithDefault('Order', 'filter.entityTypes.0', filterAndSort);

  return (
    <Provider>
      <>
        <Portal>
          <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />
          <TabItem
            active={activeType === 'Order'}
            label={<FormattedMessage id="modules.metadata.orders" defaultMessage="ORDERS" />}
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
            label={<FormattedMessage id="modules.metadata.items" defaultMessage="ITEMS" />}
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
            active={activeType === 'Batch'}
            label={<FormattedMessage id="modules.metadata.batches" defaultMessage="BATCHES" />}
            icon="BATCH"
            onClick={() => {
              if (activeType !== 'Batch') {
                onChangeFilter({
                  ...filterAndSort,
                  filter: { ...filterAndSort.filter, entityTypes: ['Batch'] },
                });
              }
            }}
          />
          <TabItem
            active={activeType === 'Shipment'}
            label={<FormattedMessage id="modules.metadata.shipments" defaultMessage="SHIPMENTS" />}
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
            active={activeType === 'Product'}
            label={<FormattedMessage id="modules.metadata.products" defaultMessage="PRODUCTS" />}
            icon="PRODUCT"
            onClick={() => {
              if (activeType !== 'Product') {
                onChangeFilter({
                  ...filterAndSort,
                  filter: { ...filterAndSort.filter, entityTypes: ['Product'] },
                });
              }
            }}
          />
          <TabItem
            active={activeType === 'ProductProvider'}
            label={
              <FormattedMessage id="modules.metadata.endProducts" defaultMessage="END PRODUCTS" />
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
          <TabItem
            active={activeType === 'Warehouse'}
            label={<FormattedMessage id="modules.metadata.warehouse" defaultMessage="WAREHOUSE" />}
            icon="WAREHOUSE"
            onClick={() => {
              if (activeType !== 'Warehouse') {
                onChangeFilter({
                  ...filterAndSort,
                  filter: { ...filterAndSort.filter, entityTypes: ['Warehouse'] },
                });
              }
            }}
          />
        </Portal>
        <div className={MainContentWrapperStyle}>
          <FieldDefinitionsFormWrapper entityType={activeType} />
          <MaskList queryVariables={queryVariables} entityType={activeType} />
        </div>
      </>
    </Provider>
  );
};

export default withCache(MetadataForm, ['entityType']);
