// @flow
import * as React from 'react';
import { SortInput, SearchInput, GenericNavBar } from 'components/NavBar';
import ToggleTag from './ToggleTag';
import { SortFilterWrapperStyle, SortWrapperStyle, GroupFilterWrapperStyle } from './style';

type OptionalProps = {
  renderAdvanceFilter: Function,
  showTags: boolean,
  onToggle: Function,
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

const defaultProps = {
  renderAdvanceFilter: () => null,
  onToggle: () => {},
  showTags: true,
};

const SortFilter = ({
  sortInputs,
  filter,
  sort,
  onChange,
  onToggle,
  renderAdvanceFilter,
  showTags,
}: Props) => (
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
        {renderAdvanceFilter({ onChange })}
        <SearchInput
          name="filter"
          value={filter.query}
          onClear={() => onChange({ filter: { ...filter, query: '' } })}
          onChange={newQuery => onChange({ filter: { ...filter, query: newQuery } })}
        />
      </div>
      {showTags && <ToggleTag onToggle={onToggle} />}
    </div>
  </GenericNavBar>
);

SortFilter.defaultProps = defaultProps;

export default SortFilter;
