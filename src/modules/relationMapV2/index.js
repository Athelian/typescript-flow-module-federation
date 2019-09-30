// @flow
import React from 'react';
import { Provider } from 'unstated';
import { Content } from 'components/Layout';
import { NavBar, EntityIcon } from 'components/NavBar';
import OrderFocus from './components/OrderFocus';
import AdvanceFilter from './components/AdvanceFilter';
import { Hits, Entities, SortAndFilter, ClientSorts, GlobalShipmentPoint } from './store';

const RelationMap = () => {
  return (
    <Provider>
      <GlobalShipmentPoint.Provider>
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
                <EntityIcon icon="ORDER" color="ORDER" subIcon="MAP" />
                <AdvanceFilter />
              </NavBar>
              <Content>
                <ClientSorts.Provider>
                  <OrderFocus />
                </ClientSorts.Provider>
              </Content>
            </SortAndFilter.Provider>
          </Entities.Provider>
        </Hits.Provider>
      </GlobalShipmentPoint.Provider>
    </Provider>
  );
};

export default RelationMap;
