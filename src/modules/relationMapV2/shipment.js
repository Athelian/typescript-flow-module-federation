// @flow
import React from 'react';
import { Provider } from 'unstated';
import { Content } from 'components/Layout';
import { NavBar, EntityIcon } from 'components/NavBar';
import ShipmentFocus from './components/ShipmentFocus';
import AdvanceFilter from './components/AdvanceFilter';
import ExpandButton from './components/ExpandButton';
import {
  Hits,
  ShipmentFocused,
  Entities,
  SortAndFilter,
  ClientSorts,
  GlobalShipmentPoint,
  ExpandRows,
} from './store';

const RelationMap = () => {
  return (
    <Provider>
      <ShipmentFocused.Provider>
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
                    <EntityIcon icon="SHIPMENT" color="SHIPMENT" subIcon="MAP" />
                    <AdvanceFilter />
                    <ExpandButton />
                  </NavBar>
                  <Content>
                    <ClientSorts.Provider>
                      <ShipmentFocus />
                    </ClientSorts.Provider>
                  </Content>
                </SortAndFilter.Provider>
              </Entities.Provider>
            </Hits.Provider>
          </GlobalShipmentPoint.Provider>
        </ExpandRows.Provider>
      </ShipmentFocused.Provider>
    </Provider>
  );
};

export default RelationMap;
