// @flow
import * as React from 'react';
import FilterToolBar from 'components/common/FilterToolBar';
import { SortAndFilter } from 'modules/relationMapV2/store';
import CustomFiler from '../CustomFilter';

export default function AdvanceFilter() {
  const { filterAndSort, onChangeFilter } = SortAndFilter.useContainer();
  const [isShow, setIsShow] = React.useState(false);
  const sortFields = [];
  return (
    <>
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
              filter: {
                query: filterAndSort.filter.query,
              },
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
            filter: {
              query: filterAndSort.filter.query,
              ...newFilter,
            },
          });
        }}
      />
    </>
  );
}
