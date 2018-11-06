// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import Layout from 'components/Layout';
import GridColumn from 'components/GridColumn';
import NavBar, { EntityIcon } from 'components/NavBar';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import { UIConsumer } from 'modules/ui';
import MetadataContainer from './container';
import MetadataDefineForm from './components/MetadataDefineForm';

import { MainContentWrapperStyle } from './style';

const MetadataList = () => (
  <Provider>
    <UIConsumer>
      {uiState => (
        <Layout
          {...uiState}
          navBar={
            <NavBar>
              <EntityIcon icon="METADATA" color="METADATA" />
              <TabItem
                active={false}
                label={<FormattedMessage id="modules.metadata.orders" defaultMessage="ORDERS" />}
                icon="ORDER"
                onClick={() => {}}
              />
              <TabItem
                active={false}
                label={<FormattedMessage id="modules.metadata.items" defaultMessage="ITEMS" />}
                icon="ORDER_ITEM"
                onClick={() => {}}
              />
              <TabItem
                active={false}
                label={<FormattedMessage id="modules.metadata.batches" defaultMessage="BATCHES" />}
                icon="BATCH"
                onClick={() => {}}
              />
              <TabItem
                active={false}
                label={
                  <FormattedMessage id="modules.metadata.shipments" defaultMessage="SHIPMENTS" />
                }
                icon="SHIPMENT"
                onClick={() => {}}
              />
              <TabItem
                active={false}
                label={
                  <FormattedMessage id="modules.metadata.products" defaultMessage="PRODUCTS" />
                }
                icon="PRODUCT"
                onClick={() => {}}
              />
              {/* FIXME: which entity type? */}
              <TabItem
                active={false}
                label={
                  <FormattedMessage
                    id="modules.metadata.endProducts"
                    defaultMessage="END PRODOCTS"
                  />
                }
                icon="PRODUCTS"
                onClick={() => {}}
              />
            </NavBar>
          }
        >
          <div className={MainContentWrapperStyle}>
            <GridColumn>
              <Subscribe to={[MetadataContainer]}>{() => <MetadataDefineForm />}</Subscribe>
            </GridColumn>
            <GridColumn gap="10px">metadata template list</GridColumn>
          </div>
        </Layout>
      )}
    </UIConsumer>
  </Provider>
);

export default MetadataList;
