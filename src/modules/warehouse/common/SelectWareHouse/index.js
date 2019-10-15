// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { ObjectValue } from 'react-values';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import useFilterSort from 'hooks/useFilterSort';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import { WarehouseCard } from 'components/Cards';
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

  const queryVariables = { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 };

  return (
    <Query query={warehouseListQuery} variables={queryVariables} fetchPolicy="network-only">
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }
        const nextPage = getByPathWithDefault(1, 'warehouses.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'warehouses.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <ObjectValue defaultValue={selected}>
            {({ value, set }) => (
              <SlideViewLayout>
                <SlideViewNavBar>
                  <EntityIcon icon="WAREHOUSE" color="WAREHOUSE" />

                  <Filter
                    config={WarehouseFilterConfig}
                    filterBy={filterBy}
                    onChange={setFilterBy}
                  />
                  <Search query={query} onChange={setQuery} />
                  <Sort config={WarehouseSortConfig} sortBy={sortBy} onChange={setSortBy} />

                  <CancelButton onClick={onCancel} />
                  <SaveButton
                    disabled={isEquals(value, selected)}
                    onClick={() => onSelect(value)}
                  />
                </SlideViewNavBar>

                <Content>
                  <WarehouseGridView
                    hasMore={hasMore}
                    isLoading={loading}
                    onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, 'warehouses')}
                    items={getByPathWithDefault([], 'warehouses.nodes', data)}
                    renderItem={({ item }) => (
                      <WarehouseCard
                        warehouse={item}
                        onSelect={() => {
                          if (value && item.id === value.id) {
                            set(null);
                          } else {
                            set(item);
                          }
                        }}
                        selectable
                        selected={value && item.id === value.id}
                        key={item.id}
                      />
                    )}
                  />
                </Content>
              </SlideViewLayout>
            )}
          </ObjectValue>
        );
      }}
    </Query>
  );
};

SelectWareHouse.defaultProps = defaultProps;

export default SelectWareHouse;
