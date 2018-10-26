// @flow
import React from 'react';
import { SortInput, SearchInput, AdvanceFilterInput } from 'components/NavBar';
import FilterForm from '../SortFilterBar/FilterForm';
import { GroupFilterStyle, SortWrapperStyle, GroupFilterWrapperStyle } from './style';

type OptionalProps = {
  className: string,
  sortInputs: Array<Object>,
};

type Props = OptionalProps & {
  filter: Object,
  sort: {
    field: string,
    direction: string,
  },
  onChange: Function,
};

const defaultProps = {
  sortInputs: [
    { title: 'Updated At', value: 'updatedAt' },
    { title: 'Created At', value: 'createdAt' },
  ],
};

const SortFilter = ({ className, sortInputs, filter, sort, onChange }: Props) => (
  <div className={className}>
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
      <div className={GroupFilterStyle}>
        <AdvanceFilterInput
          initialFilter={{
            query: '',
          }}
          onApply={newFilter => onChange(newFilter)}
        >
          {({ onChangeFilter }) => <FilterForm onChange={onChangeFilter} />}
        </AdvanceFilterInput>
        <SearchInput
          name="filter"
          value={filter.query}
          onClear={() => onChange({ filter: { query: '' } })}
          onChange={newQuery => onChange({ filter: { query: newQuery } })}
        />
      </div>
    </div>
  </div>
);
SortFilter.defaultProps = defaultProps;

export default SortFilter;
