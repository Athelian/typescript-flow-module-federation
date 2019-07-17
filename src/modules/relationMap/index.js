// @flow
import React from 'react';
import { Router, Location, navigate } from '@reach/router';
import { Provider } from 'unstated';
import { FormattedMessage } from 'react-intl';
import { EntityIcon, Tabs } from 'components/NavBar';
import { Content } from 'components/Layout';
import Portal from 'components/Portal';
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
      <Portal>
        <EntityIcon icon="RELATION_MAP" color="RELATION_MAP" />
        <Location>
          {({ location }) => (
            <Tabs
              tabs={tabs}
              activeIndex={location.pathname.includes('products') ? 1 : 0}
              onChange={tabId => {
                if (tabs.length > 1) {
                  if (tabId) {
                    navigate('/relation-map/products');
                  } else {
                    navigate('/relation-map/orders');
                  }
                }
              }}
            />
          )}
        </Location>
      </Portal>

      {/* $FlowFixMe override Router's div style */}
      <Content>
        <div className={ResetContentWrapperStyle}>
          <Router primary={false}>
            {hasPermission(RM_ORDER_FOCUS_LIST) && (
              <Order path="/orders" default={hasPermission(RM_ORDER_FOCUS_LIST)} />
            )}
            {hasPermission(RM_PRODUCT_FOCUS_LIST) && (
              <Product
                path="/products"
                default={
                  !hasPermission(RM_ORDER_FOCUS_LIST) && hasPermission(RM_PRODUCT_FOCUS_LIST)
                }
              />
            )}
          </Router>
        </div>
      </Content>
    </Provider>
  );
};

export default RelationMap;
