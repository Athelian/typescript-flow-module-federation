// @flow
import * as React from 'react';
import { SortInput, SearchInput } from 'components/NavBar';
import ToggleTag from 'modules/relationMap/common/ToggleTag';
import AdvancedFilter from './AdvancedFilter';
import { GroupFilterStyle, SortWrapperStyle, GroupFilterWrapperStyle } from './style';

type OptionalProps = {
  className: string,
};

type Props = OptionalProps & {
  sortInputs: Array<Object>,
  filter: Object,
  sort: {
    field: string,
    direction: string,
  },
  onChange: Function,
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
        <AdvancedFilter
          initialFilter={{
            query: '',
          }}
          onApply={newFilter => onChange(newFilter)}
        />
        <SearchInput
          name="filter"
          value={filter.query}
          onClear={() => onChange({ filter: { query: '' } })}
          onChange={newQuery => onChange({ filter: { query: newQuery } })}
        />
      </div>
    </div>
    <ToggleTag />
  </div>
);

export default SortFilter;
