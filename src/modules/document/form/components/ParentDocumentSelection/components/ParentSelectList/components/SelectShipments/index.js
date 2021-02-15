// @flow
import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import loadMore from 'utils/loadMore';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import ShipmentGridView from 'modules/shipment/list/ShipmentGridView';
import {
  EntityIcon,
  Filter,
  ShipmentFilterConfig,
  ShipmentSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { getByPathWithDefault } from 'utils/fp';
import useFilterSort from 'hooks/useFilterSort';
import { ShipmentCard } from 'components/Cards';
import { shipmentListQuery } from './query';

type OptionalProps = {
  cacheKey: string,
};

type Props = OptionalProps & {
  onCancel: Function,
  onSelect: Function,
};

function SelectShipments({ cacheKey, onCancel, onSelect }: Props) {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' },
    cacheKey
  );

  const variables = {
    filterBy: { query, ...filterBy },
    sortBy,
    page: 1,
    perPage: 10,
  };

  const { loading, data, fetchMore, error } = useQuery(shipmentListQuery, {
    fetchPolicy: 'network-only',
    variables,
  });

  const [selectedShipment, setSelectedShipment] = React.useState(null);

  const onSelectShipment = React.useCallback(
    (shipment: Object) => {
      if (selectedShipment?.id === shipment?.id) {
        setSelectedShipment(null);
      } else {
        setSelectedShipment(shipment);
      }
    },
    [selectedShipment]
  );

  if (error) {
    return error.message;
  }

  const nextPage = getByPathWithDefault(1, 'shipments.page', data) + 1;
  const totalPage = getByPathWithDefault(1, 'shipments.totalPage', data);
  const hasMore = nextPage <= totalPage;

  return (
    <SlideViewLayout>
      <SlideViewNavBar isSubNavBar>
        <EntityIcon icon="SHIPMENT" color="SHIPMENT" subIcon="CARDS" />

        <Filter config={ShipmentFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <Sort config={ShipmentSortConfig} sortBy={sortBy} onChange={setSortBy} />
        <CancelButton onClick={onCancel} />
        <SaveButton
          data-testid="btnSaveSelectTasks"
          disabled={!selectedShipment}
          onClick={() => {
            onSelect(selectedShipment);
          }}
        />
      </SlideViewNavBar>

      <Content hasSubNavBar>
        <ShipmentGridView
          items={getByPathWithDefault([], 'shipments.nodes', data)}
          onLoadMore={() => loadMore({ fetchMore, data }, variables, 'shipments')}
          hasMore={hasMore}
          isLoading={loading}
          renderItem={item => {
            return (
              <ShipmentCard
                key={item.id}
                shipment={item}
                selectable
                selected={selectedShipment?.id === item.id}
                onSelect={onSelectShipment}
              />
            );
          }}
        />
      </Content>
    </SlideViewLayout>
  );
}

const defaultProps = {
  cacheKey: 'SelectShipments',
};

SelectShipments.defaultProps = defaultProps;

export default SelectShipments;
