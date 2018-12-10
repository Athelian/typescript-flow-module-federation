// @flow
import * as React from 'react';
import { SortInput, SearchInput } from 'components/NavBar';
import ToggleTag from 'modules/relationMap/common/ToggleTag';
import { GroupFilterStyle, SortWrapperStyle, GroupFilterWrapperStyle } from './style';

type OptionalProps = {
  className: string,
  renderAdvanceFilter: Function,
  showTags: boolean,
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
  showTags: true,
};
const SortFilter = ({
  className,
  sortInputs,
  filter,
  sort,
  onChange,
  renderAdvanceFilter,
  showTags,
}: Props) => (
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
        {renderAdvanceFilter({ onChange })}
        <SearchInput
          name="filter"
          value={filter.query}
          onClear={() => onChange({ filter: { query: '' } })}
          onChange={newQuery => onChange({ filter: { query: newQuery } })}
        />
      </div>
    </div>
    {showTags && <ToggleTag />}
  </div>
);

SortFilter.defaultProps = defaultProps;
export default SortFilter;
