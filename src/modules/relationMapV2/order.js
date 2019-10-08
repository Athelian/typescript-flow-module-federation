// @flow
import React from 'react';
import { Provider } from 'unstated';
import { Content } from 'components/Layout';
import { NavBar, EntityIcon } from 'components/NavBar';
import OrderFocus from './components/OrderFocus';
import AdvanceFilter from './components/AdvanceFilter';
import ExpandButton from './components/ExpandButton';
import {
  Hits,
  FocusedView,
  Entities,
  SortAndFilter,
  ClientSorts,
  GlobalShipmentPoint,
  ExpandRows,
} from './store';

const RelationMap = () => {
  return (
    <Provider>
      <FocusedView.Provider initialState="Order">
        <ExpandRows.Provider>
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
                    <ExpandButton />
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
        </ExpandRows.Provider>
      </FocusedView.Provider>
    </Provider>
  );
};

export default RelationMap;
