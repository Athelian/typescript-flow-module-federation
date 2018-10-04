// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { ObjectValue } from 'react-values';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import WarehouseGridView from 'modules/warehouse/list/WarehouseGridView';
import { WarehouseCard } from 'components/Cards';
import query from 'modules/warehouse/list/query';

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

const SelectWareHouse = ({ selected, onCancel, onSelect }: Props) => (
  <Query
    query={query}
    variables={{
      page: 1,
      perPage: 10,
    }}
    fetchPolicy="network-only"
  >
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
            <Layout
              navBar={
                <SlideViewNavBar>
                  <EntityIcon icon="WAREHOUSE" color="WAREHOUSE" />
                  <CancelButton onClick={onCancel} />
                  <SaveButton
                    disabled={isEquals(value, selected)}
                    onClick={() => onSelect(value)}
                  />
                </SlideViewNavBar>
              }
            >
              <WarehouseGridView
                hasMore={hasMore}
                isLoading={loading}
                onLoadMore={() => loadMore({ fetchMore, data }, {}, 'warehouses')}
                items={getByPathWithDefault([], 'warehouses.nodes', data)}
                renderItem={item => (
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
            </Layout>
          )}
        </ObjectValue>
      );
    }}
  </Query>
);

SelectWareHouse.defaultProps = defaultProps;

export default SelectWareHouse;
