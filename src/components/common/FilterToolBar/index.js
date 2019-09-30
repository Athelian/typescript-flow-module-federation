// @flow
import * as React from 'react';
import { EntityIcon, SortInput, SearchInput, StatusToggleTabs } from 'components/NavBar';
import { getByPath } from 'utils/fp';

type OptionalProps = {
  icon?: string,
  subIcon?: string,
  renderIcon: Function,
  canArchive: boolean,
  canSearch: boolean,
  canSort: boolean,
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
  canArchive: false,
  canSearch: false,
  canSort: true,
  renderIcon: (icon: string, subIcon?: string) =>
    icon ? <EntityIcon icon={icon} color={icon} subIcon={subIcon} /> : null,
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
  subIcon,
  renderIcon,
  sortFields,
  filtersAndSort,
  onChange,
  canArchive,
  canSearch,
  canSort,
}: Props) {
  return (
    <>
      {renderIcon(icon, subIcon)}
      {canArchive && (
        <StatusToggleTabs
          activeIndex={getByPath('filter.archived', filtersAndSort) ? 1 : 0}
          onChange={index =>
            onChange({
              ...filtersAndSort,
              filter: { ...filtersAndSort.filter, archived: !!index },
            })
          }
        />
      )}

      {canSort && (
        <SortInput
          sort={currentSort(sortFields, filtersAndSort.sort)}
          ascending={filtersAndSort.sort.direction !== 'DESCENDING'}
          fields={sortFields}
          sortable={filtersAndSort.sort.field !== 'default'}
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
      )}

      {canSearch && (
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
