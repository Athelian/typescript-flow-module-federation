// @flow
import React from 'react';
import { Provider } from 'unstated';
import { Content } from 'components/Layout';
import { NavBar, EntityIcon } from 'components/NavBar';
import OrderFocus from './components/OrderFocus';

const RelationMap = () => {
  return (
    <Provider>
      <NavBar>
        <EntityIcon icon="RELATION_MAP" color="RELATION_MAP" />
      </NavBar>

      <Content>
        <OrderFocus />
      </Content>
    </Provider>
  );
};

export default RelationMap;
