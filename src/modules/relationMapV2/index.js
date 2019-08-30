// @flow
import React from 'react';
import { Provider } from 'unstated';
import { Content } from 'components/Layout';
import { NavBar, EntityIcon } from 'components/NavBar';
import OrderFocus from './components/OrderFocus';
import AdvanceFilter from './components/AdvanceFilter';
import { Hits, Entities, SortAndFilter } from './store';

const RelationMap = () => {
  return (
    <Provider>
      <Hits.Provider>
        <Entities.Provider>
          <SortAndFilter.Provider
            initialState={{
              filter: {
                query: '',
              },
              sort: {
                field: 'updatedAt',
                direction: 'DESCENDING',
              },
              perPage: 10,
              page: 1,
            }}
          >
            <NavBar>
              <EntityIcon icon="RELATION_MAP" color="RELATION_MAP" />
              <AdvanceFilter />
            </NavBar>
            <Content>
              <OrderFocus />
            </Content>
          </SortAndFilter.Provider>
        </Entities.Provider>
      </Hits.Provider>
    </Provider>
  );
};

export default RelationMap;
