// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { SHIPMENT_CREATE, SHIPMENT_EXPORT } from 'modules/permission/constants/shipment';
import { Content } from 'components/Layout';
import {
  EntityIcon,
  Filter,
  NavBar,
  ShipmentFilterConfig,
  ShipmentSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import { NewButton, ExportButton } from 'components/Buttons';
import { useViewerHasPermissions } from 'contexts/Permissions';
import useFilterSort from 'hooks/useFilterSort';
import ShipmentList from './list';
import { shipmentsExportQuery } from './query';

const ShipmentListModule = () => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' },
    'shipment_cards'
  );

  const hasPermissions = useViewerHasPermissions();

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="SHIPMENT" color="SHIPMENT" subIcon="CARDS" />

        <Filter config={ShipmentFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <Sort config={ShipmentSortConfig} sortBy={sortBy} onChange={setSortBy} />

        {hasPermissions(SHIPMENT_CREATE) && (
          // $FlowFixMe Flow typed is not updated yet
          <Link to="/shipment/new">
            <NewButton />
          </Link>
        )}

        {hasPermissions(SHIPMENT_EXPORT) && (
          <ExportButton
            type="Shipments"
            exportQuery={shipmentsExportQuery}
            variables={{
              filterBy: { query, ...filterBy },
              sortBy,
            }}
          />
        )}
      </NavBar>
      <ShipmentList filterBy={{ query, ...filterBy }} sortBy={sortBy} page={1} perPage={10} />
    </Content>
  );
};

export default ShipmentListModule;
