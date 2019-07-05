// @flow
import * as React from 'react';
import { EntityIcon, SortInput, SearchInput, StatusToggleTabs } from 'components/NavBar';

type OptionalProps = {
  icon?: string,
  renderIcon: Function,
  searchable: boolean,
  sortable: boolean,
};

type Props = OptionalProps & {
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

const defaultProps = {
  searchable: true,
  sortable: true,
  renderIcon: icon => (icon ? <EntityIcon icon={icon} color={icon} /> : null),
};

export function currentSort(
  fields: Array<Object>,
  sort: Object
): {
  title: string | React.Node,
  value: string,
} {
  const found = fields.find(item => item.value === sort.field);
  if (found) return found;
  return fields[0];
}

export default function FilterToolBar({
  icon,
  renderIcon,
  sortFields,
  filtersAndSort,
  onChange,
  searchable,
  sortable,
}: Props) {
  return (
    <>
      {renderIcon(icon)}
      {Object.prototype.hasOwnProperty.call(filtersAndSort.filter, 'archived') && (
        <StatusToggleTabs
          activeIndex={filtersAndSort.filter.archived ? 1 : 0}
          onChange={index =>
            onChange({ ...filtersAndSort, filter: { ...filtersAndSort.filter, archived: !!index } })
          }
        />
      )}
      <SortInput
        sort={currentSort(sortFields, filtersAndSort.sort)}
        ascending={filtersAndSort.sort.direction !== 'DESCENDING'}
        sortable={sortable}
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

      {searchable && (
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
      )}
    </>
  );
}

FilterToolBar.defaultProps = defaultProps;
