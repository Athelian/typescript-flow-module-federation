// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Provider } from 'unstated';
import { UIConsumer } from 'modules/ui';
import withCache from 'hoc/withCache';
import Layout from 'components/Layout';
import NavBar, { EntityIcon } from 'components/NavBar';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import FieldDefinitionsFormWrapper from 'modules/metadata/components/FieldDefinitionsFormWrapper';
import MaskList from 'modules/metadata/components/MaskList';
import { MainContentWrapperStyle } from './style';

type OptionalProps = {
  entityType: string,
};

type Props = OptionalProps & {};

const defaultProps = {
  entityType: 'order',
};

const EntityTypeMap = {
  order: 'Order',
  item: 'OrderItem',
  batch: 'Batch',
  shipment: 'Shipment',
  product: 'Product',
  end_product: 'ProductProvider',
  warehouse: 'Warehouse',
};

const MetadataForm = ({ entityType: entity }: Props) => {
  const entityType = EntityTypeMap[entity];
  return (
    <Provider>
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <EntityIcon icon="METADATA" color="METADATA" invert />
                <TabItem
                  active={entityType === 'Order'}
                  label={<FormattedMessage id="modules.metadata.orders" defaultMessage="ORDERS" />}
                  icon="ORDER"
                  onClick={entityType === 'Order' ? () => {} : () => navigate('/metadata/order')}
                />
                <TabItem
                  active={entityType === 'OrderItem'}
                  label={<FormattedMessage id="modules.metadata.items" defaultMessage="ITEMS" />}
                  icon="ORDER_ITEM"
                  onClick={entityType === 'OrderItem' ? () => {} : () => navigate('/metadata/item')}
                />
                <TabItem
                  active={entityType === 'Batch'}
                  label={
                    <FormattedMessage id="modules.metadata.batches" defaultMessage="BATCHES" />
                  }
                  icon="BATCH"
                  onClick={entityType === 'Batch' ? () => {} : () => navigate('/metadata/batch')}
                />
                <TabItem
                  active={entityType === 'Shipment'}
                  label={
                    <FormattedMessage id="modules.metadata.shipments" defaultMessage="SHIPMENTS" />
                  }
                  icon="SHIPMENT"
                  onClick={
                    entityType === 'Shipment' ? () => {} : () => navigate('/metadata/shipment')
                  }
                />
                <TabItem
                  active={entityType === 'Product'}
                  label={
                    <FormattedMessage id="modules.metadata.products" defaultMessage="PRODUCTS" />
                  }
                  icon="PRODUCT"
                  onClick={
                    entityType === 'Product' ? () => {} : () => navigate('/metadata/product')
                  }
                />
                <TabItem
                  active={entityType === 'ProductProvider'}
                  label={
                    <FormattedMessage
                      id="modules.metadata.endProducts"
                      defaultMessage="END PRODUCTS"
                    />
                  }
                  icon="PROVIDER"
                  onClick={
                    entityType === 'ProductProvider'
                      ? () => {}
                      : () => navigate('/metadata/end_product')
                  }
                />
                <TabItem
                  active={entityType === 'Warehouse'}
                  label={
                    <FormattedMessage id="modules.metadata.warehouse" defaultMessage="WAREHOUSE" />
                  }
                  icon="WAREHOUSE"
                  onClick={
                    entityType === 'Warehouse' ? () => {} : () => navigate('/metadata/warehouse')
                  }
                />
              </NavBar>
            }
          >
            <div className={MainContentWrapperStyle}>
              <FieldDefinitionsFormWrapper entityType={entityType} />
              <MaskList entityType={entityType} />
            </div>
          </Layout>
        )}
      </UIConsumer>
    </Provider>
  );
};

MetadataForm.defaultProps = defaultProps;

export default withCache(MetadataForm, ['entityType']);
