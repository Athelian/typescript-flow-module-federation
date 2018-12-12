// @flow
import React from 'react';
import { Router, Location, navigate } from '@reach/router';
import { Provider } from 'unstated';
import { FormattedMessage } from 'react-intl';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon, Tabs } from 'components/NavBar';
import Layout from 'components/Layout';
import Order from './index.orders';
import Products from './index.products';
import messages from './messages';

const RelationMap = () => {
  const tabs = [
    {
      id: 'order-menu-1',
      key: 'orders',
      icon: 'ORDER',
      label: <FormattedMessage {...messages.ordersTab} />,
    },
    {
      id: 'order-menu-2',
      key: 'products',
      icon: 'PRODUCT',
      label: <FormattedMessage {...messages.productsTab} />,
    },
  ];

  return (
    <Provider>
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <EntityIcon icon="RELATION_MAP" color="RELATION_MAP" />
                <Location>
                  {({ location }) => (
                    <Tabs
                      tabs={tabs}
                      activeIndex={location.pathname.includes('products') ? 1 : 0}
                      onChange={tabId => {
                        if (tabId) {
                          navigate('products');
                        } else {
                          navigate('orders');
                        }
                      }}
                    />
                  )}
                </Location>
              </NavBar>
            }
          >
            {/* $FlowFixMe override Router's div style */}
            <Router primary={false} style={{ width: '100%', height: '100%' }}>
              <Order path="/orders" default />
              <Products path="/products" />
            </Router>
          </Layout>
        )}
      </UIConsumer>
    </Provider>
  );
};

export default RelationMap;
