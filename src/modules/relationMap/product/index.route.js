// @flow
import React from 'react';
import { Location, navigate } from '@reach/router';
import { Provider } from 'unstated';
import { FormattedMessage } from 'react-intl';
import { Content } from 'components/Layout';
import { NavBar, EntityIcon, Tabs } from 'components/NavBar';
import messages from 'modules/relationMap/messages';
import { ResetContentWrapperStyle } from 'modules/relationMap/style';
import { RM_PRODUCT_FOCUS_LIST } from 'modules/permission/constants/relationMap';
import usePermission from 'hooks/usePermission';
import Product from './index';

const RelationMap = () => {
  const { hasPermission } = usePermission();
  const tabs: Array<Object> = [
    hasPermission(RM_PRODUCT_FOCUS_LIST) && {
      id: 'relation-map-menu-1',
      key: 'products',
      icon: 'PRODUCT',
      label: <FormattedMessage {...messages.productsTab} />,
    },
  ].filter(Boolean);

  return (
    <Provider>
      <NavBar>
        <EntityIcon icon="RELATION_MAP" color="RELATION_MAP" />
        <Location>
          {({ location }) => (
            <Tabs
              tabs={tabs}
              activeIndex={location.pathname.includes('products') ? 1 : 0}
              onChange={tabId => {
                if (tabs.length > 1) {
                  if (tabId) {
                    navigate('/order/relation-map/products');
                  } else {
                    navigate('/order/relation-map');
                  }
                }
              }}
            />
          )}
        </Location>
      </NavBar>

      <Content>
        <div className={ResetContentWrapperStyle}>
          {hasPermission(RM_PRODUCT_FOCUS_LIST) && (
            <Product path="/orders" default={hasPermission(RM_PRODUCT_FOCUS_LIST)} />
          )}
        </div>
      </Content>
    </Provider>
  );
};

export default RelationMap;
