// @flow
import React from 'react';
import { Location } from '@reach/router';
import { Provider } from 'unstated';
import { FormattedMessage } from 'react-intl';
import { Content } from 'components/Layout';
import { NavBar, EntityIcon, Tabs } from 'components/NavBar';
import messages from 'modules/relationMap/messages';
import { ResetContentWrapperStyle } from 'modules/relationMap/style';
import { RM_ORDER_FOCUS_LIST } from 'modules/permission/constants/relationMap';
import usePermission from 'hooks/usePermission';
import Order from './order';

const RelationMap = () => {
  const { hasPermission } = usePermission();
  const tabs: Array<Object> = [
    hasPermission(RM_ORDER_FOCUS_LIST) && {
      id: 'relation-map-menu-1',
      key: 'orders',
      icon: 'ORDER',
      label: <FormattedMessage {...messages.ordersTab} />,
    },
  ].filter(Boolean);

  return (
    <Provider>
      <NavBar>
        <EntityIcon icon="RELATION_MAP" color="RELATION_MAP" />
        <Location>
          {({ location }) => (
            <Tabs tabs={tabs} activeIndex={location.pathname.includes('products') ? 1 : 0} />
          )}
        </Location>
      </NavBar>

      <Content>
        <div className={ResetContentWrapperStyle}>
          {hasPermission(RM_ORDER_FOCUS_LIST) && <Order />}
        </div>
      </Content>
    </Provider>
  );
};

export default RelationMap;
