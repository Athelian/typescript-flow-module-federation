// @flow
import React from 'react';
import { Provider } from 'unstated';
import { Content } from 'components/Layout';
import { NavBar, EntityIcon } from 'components/NavBar';
import FilterToolBar from 'components/common/FilterToolBar';
import useFilter from 'hooks/useFilter';
import OrderFocus from './components/OrderFocus';

const RelationMap = () => {
  const sortFields = [];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    {
      filter: {
        query: '',
      },
      sort: {
        field: 'updatedAt',
        direction: 'DESCENDING',
      },
      perPage: 10,
      page: 1,
    },
    'rmFilterV2'
  );
  return (
    <Provider>
      <NavBar>
        <EntityIcon icon="RELATION_MAP" color="RELATION_MAP" />
        <FilterToolBar
          sortFields={sortFields}
          filtersAndSort={filterAndSort}
          onChange={onChangeFilter}
          canSearch
          canSort={false}
        />
      </NavBar>

      <Content>
        <OrderFocus {...queryVariables} />
      </Content>
    </Provider>
  );
};

export default RelationMap;
