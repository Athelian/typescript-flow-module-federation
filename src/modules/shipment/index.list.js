// @flow
/* eslint-disable no-unused-vars, no-redeclare */
import * as React from 'react';
import { Link } from '@reach/router';
import { SHIPMENT_CREATE, SHIPMENT_EXPORT } from 'modules/permission/constants/shipment';
import { Content } from 'components/Layout';
import {
  BulkHeaderFilter,
  EntityIcon,
  Filter,
  NavBar,
  ShipmentFilterConfig,
  ShipmentSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { NewButton, ExportButton } from 'components/Buttons';
import { useViewerHasPermissions } from 'contexts/Permissions';
import useFilterSort from 'hooks/useFilterSort';
import { encryptValue, decryptValue } from 'utils/cache';
import { isEquals } from 'utils/fp';
import ShipmentList from './list';
import { shipmentsExportQuery, getShipmentViewStateQuery } from './query';
import { updateShipmentViewStateMutation } from './mutation';

const ShipmentListModule = () => {
  const [loading, setLoading] = React.useState(true);

  const client = useApolloClient();

  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' },
    'shipment_cards'
  );

  useQuery(getShipmentViewStateQuery, {
    variables: { type: 'ShipmentCard' },
    onCompleted: ({ viewState }) => {
      setLoading(false);
      if (viewState.filterSort) {
        const decrypted = decryptValue(viewState.filterSort);

        setFilterBy({
          ...(decrypted?.filterBy ?? {}),
          query: decrypted?.query ?? '',
        });

        setSortBy(decrypted?.sortBy ?? {});
      }
    },
  });

  React.useEffect(() => {
    if (!loading) {
      client.mutate({
        mutation: updateShipmentViewStateMutation,
        variables: {
          input: {
            name: 'zenport card view',
            type: 'ShipmentCard',
            filterSort: encryptValue({ query, filterBy, sortBy }),
          },
        },
      });
    }
  }, [loading, query, filterBy, sortBy, client]);

  const hasPermissions = useViewerHasPermissions();

  if (loading) {
    return null;
  }

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="SHIPMENT" color="SHIPMENT" subIcon="CARDS" />
        <Filter config={ShipmentFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <BulkHeaderFilter
          filterBy={filterBy}
          setFilterBy={filter => {
            if (!isEquals(filter, filterBy)) {
              setFilterBy({
                ...filter,
              });
            }
          }}
          type="SHIPMENT"
        />
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
