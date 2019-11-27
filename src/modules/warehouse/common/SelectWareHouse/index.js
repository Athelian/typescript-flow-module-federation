// @flow
import * as React from 'react';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import { WarehouseCard } from 'components/Cards';
import Selector from 'components/Selector';
import {
  EntityIcon,
  Filter,
  Search,
  Sort,
  WarehouseFilterConfig,
  WarehouseSortConfig,
} from 'components/NavBar';
import { warehouseListQuery } from 'modules/warehouse/list/query';
import WarehouseGridView from 'modules/warehouse/list/WarehouseGridView';

type Props = {
  selected?: ?{
    id: string,
    name: string,
  },
  onSelect: (item: Object) => void,
  onCancel: Function,
};

const defaultProps = {
  selected: {
    id: '',
    name: '',
  },
};

const SelectWareHouse = ({ selected, onCancel, onSelect }: Props) => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' }
  );

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    warehouseListQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 20 },
      fetchPolicy: 'network-only',
    },
    'warehouses'
  );

  return (
    <Selector.Single selected={selected}>
      {({ value, dirty, getItemProps }) => (
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="WAREHOUSE" color="WAREHOUSE" />

            <Filter
              config={WarehouseFilterConfig}
              filterBy={filterBy}
              onChange={setFilterBy}
              staticFilters={['archived']}
            />
            <Search query={query} onChange={setQuery} />
            <Sort config={WarehouseSortConfig} sortBy={sortBy} onChange={setSortBy} />

            <CancelButton onClick={onCancel} />
            <SaveButton disabled={!dirty} onClick={() => onSelect(value)} />
          </SlideViewNavBar>

          <Content>
            <WarehouseGridView
              hasMore={hasMore}
              isLoading={loading}
              onLoadMore={loadMore}
              items={nodes}
              renderItem={({ item }) => (
                <WarehouseCard key={item.id} warehouse={item} {...getItemProps(item)} />
              )}
            />
          </Content>
        </SlideViewLayout>
      )}
    </Selector.Single>
  );
};

SelectWareHouse.defaultProps = defaultProps;

export default SelectWareHouse;
