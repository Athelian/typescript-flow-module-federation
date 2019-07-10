// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { ObjectValue } from 'react-values';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import Layout from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import useFilter from 'hooks/useFilter';
import { SlideViewNavBar } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import WarehouseGridView from 'modules/warehouse/list/WarehouseGridView';
import { WarehouseCard } from 'components/Cards';
import { warehouseListQuery } from 'modules/warehouse/list/query';
import messages from 'modules/warehouse/messages';
import { warehousesDefaultQueryVariables } from 'modules/warehouse/constants';

type OptionalProps = {
  cacheKey: string,
};

type Props = OptionalProps & {
  intl: IntlShape,
  selected?: ?{
    id: string,
    name: string,
  },
  onSelect: (item: Object) => void,
  onCancel: Function,
};

const defaultProps = {
  cacheKey: 'SelectWareHouse',
  selected: {
    id: '',
    name: '',
  },
};

const SelectWareHouse = ({ intl, cacheKey, selected, onCancel, onSelect }: Props) => {
  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    warehousesDefaultQueryVariables,
    cacheKey
  );

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
              <Layout
                navBar={
                  <SlideViewNavBar>
                    <FilterToolBar
                      icon="WAREHOUSE"
                      sortFields={sortFields}
                      filtersAndSort={filterAndSort}
                      onChange={onChangeFilter}
                    />
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
              </Layout>
            )}
          </ObjectValue>
        );
      }}
    </Query>
  );
};
SelectWareHouse.defaultProps = defaultProps;

export default injectIntl(SelectWareHouse);
