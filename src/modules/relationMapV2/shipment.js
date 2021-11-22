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
  FocusedView,
  Entities,
  SortAndFilter,
  ClientSorts,
  GlobalShipmentPoint,
  ExpandRows,
  LoadStatuses,
  GlobalExpanded,
} from './store';

const RelationMap = () => {
  return (
    <Provider>
      <FocusedView.Provider initialState="Shipment">
        <GlobalExpanded.Provider>
          <LoadStatuses.Provider>
            <ExpandRows.Provider>
              <GlobalShipmentPoint.Provider>
                <Hits.Provider>
                  <Entities.Provider>
                    <SortAndFilter.Provider initialState="NRMShipment">
                      <NavBar>
                        <EntityIcon icon="SHIPMENT" color="SHIPMENT" subIcon="MAP" />
                        <AdvanceFilter bulkFilterType="MAP" />
                        <ExpandButton />
                      </NavBar>
                      <Content>
                        <ClientSorts.Provider initialState="NRMShipment">
                          <ShipmentFocus />
                        </ClientSorts.Provider>
                      </Content>
                    </SortAndFilter.Provider>
                  </Entities.Provider>
                </Hits.Provider>
              </GlobalShipmentPoint.Provider>
            </ExpandRows.Provider>
          </LoadStatuses.Provider>
        </GlobalExpanded.Provider>
      </FocusedView.Provider>
    </Provider>
  );
};

export default RelationMap;
