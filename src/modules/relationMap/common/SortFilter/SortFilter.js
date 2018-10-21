// @flow
import React from 'react';
import { SortInput, SearchInput } from 'components/NavBar';
import { GroupFilterStyle, SortWrapperStyle, GroupFilterWrapperStyle } from './style';

type OptionalProps = {
  className: string,
  sortInputs: Array<Object>,
};

type Props = OptionalProps & {
  filter: string,
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
        <SearchInput
          name="filter"
          value={filter}
          onClear={() => onChange({ filter: '' })}
          onChange={newQuery => onChange({ filter: newQuery })}
        />
      </div>
    </div>
  </div>
);
SortFilter.defaultProps = defaultProps;

export default SortFilter;
