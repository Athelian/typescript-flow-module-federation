// @flow
import * as React from 'react';
import { EntityIcon, SortInput, SearchInput, StatusToggleTabs } from 'components/NavBar';

type Props = {
  icon: string,
  sortFields: Array<{
    title: React.Node,
    value: string,
  }>,
  filtersAndSort: {
    perPage: number,
    page: number,
    filter: Object,
    sort: { field: string, direction: string },
  },
  onChange: Object => void,
};

function currentSort(
  fields,
  sort
): {
  title: string | React.Node,
  value: string,
} {
  const found = fields.find(item => item.value === sort.field);
  if (found) return found;
  return fields[0];
}

export default function FilterToolBar({ icon, sortFields, filtersAndSort, onChange }: Props) {
  return (
    <>
      <EntityIcon icon={icon} color={icon} />
      {Object.prototype.hasOwnProperty.call(filtersAndSort.filter, 'archived') && (
        <StatusToggleTabs
          onChange={index =>
            onChange({ ...filtersAndSort, filter: { ...filtersAndSort.filter, archived: !!index } })
          }
        />
      )}
      <SortInput
        sort={currentSort(sortFields, filtersAndSort.sort)}
        ascending={filtersAndSort.sort.direction !== 'DESCENDING'}
        fields={sortFields}
        onChange={({ field: { value }, ascending }) =>
          onChange({
            ...filtersAndSort,
            sort: {
              field: value,
              direction: ascending ? 'ASCENDING' : 'DESCENDING',
            },
          })
        }
      />
      <SearchInput
        value={filtersAndSort.filter.query}
        name="search"
        onClear={() =>
          onChange({
            ...filtersAndSort,
            filter: { ...filtersAndSort.filter, query: '' },
          })
        }
        onChange={newQuery =>
          onChange({
            ...filtersAndSort,
            filter: { ...filtersAndSort.filter, query: newQuery },
          })
        }
      />
    </>
  );
}
