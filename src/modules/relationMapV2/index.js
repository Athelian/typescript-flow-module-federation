// @flow
import React from 'react';
import { Provider } from 'unstated';
import { Content } from 'components/Layout';
import { NavBar, EntityIcon } from 'components/NavBar';
import FilterToolBar from 'components/common/FilterToolBar';
import useFilter from 'hooks/useFilter';
import OrderFocus from './components/OrderFocus';
import CustomFiler from './components/CustomFilter';
import { Hits, Entities } from './store';

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
  const [isShow, setIsShow] = React.useState(false);
  return (
    <Provider>
      <Hits.Provider>
        <Entities.Provider>
          <NavBar>
            <EntityIcon icon="RELATION_MAP" color="RELATION_MAP" />
            <FilterToolBar
              sortFields={sortFields}
              filtersAndSort={filterAndSort}
              onChange={onChangeFilter}
              canSearch
              canSort={false}
            />
            <label>
              Advance filter:
              <input
                name="check"
                type="checkbox"
                checked={isShow}
                onChange={() => {
                  setIsShow(!isShow);
                  onChangeFilter({
                    ...filterAndSort,
                    filter: { query: filterAndSort.filter.query },
                  });
                }}
              />
            </label>
            <CustomFiler
              filter={filterAndSort.filter}
              isEnable={isShow}
              onChange={newFilter => {
                onChangeFilter({
                  ...filterAndSort,
                  filter: { query: filterAndSort.filter.query, ...newFilter },
                });
              }}
            />
          </NavBar>
          <Content>
            <OrderFocus {...queryVariables} />
          </Content>
        </Entities.Provider>
      </Hits.Provider>
    </Provider>
  );
};

export default RelationMap;
