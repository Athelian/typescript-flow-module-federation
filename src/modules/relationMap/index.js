// @flow
import React from 'react';
import { Router, Location, navigate } from '@reach/router';
import { Provider } from 'unstated';
import { FormattedMessage } from 'react-intl';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon, Tabs } from 'components/NavBar';
import Layout from 'components/Layout';
import messages from 'modules/relationMap/messages';
import { ResetContentWrapperStyle } from 'modules/relationMap/style';
import {
  RM_PRODUCT_FOCUS_LIST,
  RM_ORDER_FOCUS_LIST,
} from 'modules/permission/constants/relationMap';
import usePermission from 'hooks/usePermission';
import Order from './order';
import Product from './product';

const RelationMap = () => {
  const { hasPermission } = usePermission();
  const tabs: Array<Object> = [
    hasPermission(RM_ORDER_FOCUS_LIST) && {
      id: 'relation-map-menu-1',
      key: 'orders',
      icon: 'ORDER',
      label: <FormattedMessage {...messages.ordersTab} />,
    },
    hasPermission(RM_PRODUCT_FOCUS_LIST) && {
      id: 'relation-map-menu-2',
      key: 'products',
      icon: 'PRODUCT',
      label: <FormattedMessage {...messages.productsTab} />,
    },
  ].filter(Boolean);

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
                          navigate('/relation-map/products');
                        } else {
                          navigate('/relation-map/orders');
                        }
                      }}
                    />
                  )}
                </Location>
              </NavBar>
            }
          >
            {/* $FlowFixMe override Router's div style */}
            <Router primary={false} className={ResetContentWrapperStyle}>
              {hasPermission(RM_ORDER_FOCUS_LIST) && <Order path="/orders" default />}
              {hasPermission(RM_PRODUCT_FOCUS_LIST) && <Product path="/products" />}
            </Router>
          </Layout>
        )}
      </UIConsumer>
    </Provider>
  );
};

export default RelationMap;
