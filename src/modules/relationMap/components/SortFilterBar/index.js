// @flow
import React from 'react';
import { SortInput, FilterInput, SearchInput } from 'components/NavBar';
import GridColumn from 'components/GridColumn';
// import ToggleTagsButton from '../ToggleShowTagsButton';

type Props = {
  className: string,
  onChangeFilter: Function,
  sortInput: Array<Object>,
  sort: Object,
  filter: string,
};
const SortFilterBar = ({ className, onChangeFilter, filter, sort, sortInput }: Props) => (
  <div className={className}>
    <SortInput
      sort={sortInput.find(item => item.value === sort.field) || sortInput[0]}
      ascending={sort.direction !== 'DESCENDING'}
      fields={sortInput}
      onChange={({ field: { value }, ascending }) => {
        onChangeFilter({
          sort: {
            field: value,
            direction: ascending ? 'ASCENDING' : 'DESCENDING',
          },
        });
      }}
    />
    <FilterInput
      initialFilter={{}}
      onChange={newFilter => onChangeFilter({ ...newFilter })}
      width={400}
    >
      {({ values, setFieldValue }) => (
        <GridColumn>
          <SearchInput
            name="filter"
            value={values.filter}
            onClear={() => setFieldValue('filter', '')}
            onChange={newValue => setFieldValue('filter', newValue)}
          />
        </GridColumn>
      )}
    </FilterInput>
    <SearchInput
      name="filter"
      value={filter}
      onClear={() => onChangeFilter({ filter: '' })}
      onChange={newQuery => onChangeFilter({ filter: newQuery })}
    />
    {/* <ToggleTagsButton isToggle={false} onToggle={() => {}} />Z */}
  </div>
);

export default SortFilterBar;
