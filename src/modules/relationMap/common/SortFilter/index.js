// @flow
import * as React from 'react';
import { SortInput, SearchInput, GenericNavBar } from 'components/NavBar';
import { SortFilterWrapperStyle, SortWrapperStyle, GroupFilterWrapperStyle } from './style';

type Props = {
  sortInputs: Array<Object>,
  filter: Object,
  sort: {
    field: string,
    direction: string,
  },
  onChange: Function,
};

const SortFilter = ({ sortInputs, filter, sort, onChange }: Props) => (
  <GenericNavBar>
    <div className={SortFilterWrapperStyle}>
      <div className={SortWrapperStyle}>
        <SortInput
          sort={sortInputs.find(item => item.value === sort.field) || sortInputs[0]}
          ascending={sort.direction !== 'DESCENDING'}
          fields={sortInputs}
          onChange={({ field: { value }, ascending }) => {
            onChange({
              sort: {
                field: value,
                direction: ascending ? 'ASCENDING' : 'DESCENDING',
              },
            });
          }}
        />
      </div>
      <div className={GroupFilterWrapperStyle}>
        <SearchInput
          name="filter"
          value={filter.query}
          onClear={() => onChange({ filter: { ...filter, query: '' } })}
          onChange={newQuery => onChange({ filter: { ...filter, query: newQuery } })}
        />
      </div>
    </div>
  </GenericNavBar>
);

export default SortFilter;
