// @flow
import * as React from 'react';
import { type EntityTypes } from 'modules/relationMap/common/SortFilter/AdvancedFilter/type';
import { FilterMenuItem, SectionHeader, ToggleMenuItem } from '..';
import { FilterMenuWrapperStyle, FiltersBodyStyle, TogglesBodyStyle } from './style';

type OptionalProps = {
  filtersMap?: Array<{
    label: React.Node,
    icon: string,
    filters: Array<{
      name: string,
      label: React.Node,
      data: Array<any>,
      field?: string,
    }>,
  }>,
  togglesMap?: Array<{
    name: string,
    label: React.Node,
    icon: string,
  }>,
};

type Props = OptionalProps & {
  entityType: EntityTypes,
  parsedActiveFilters: Array<string>,
  toggleActiveFilter: (string, string) => void,
  parsedFilterToggles: Object,
  toggleFilterToggle: (string, string) => void,
  selectedFilterItem: string,
  changeSelectedFilterItem: string => void,
  onToggleSelect: Function,
};

export default function BaseFilterMenu({
  filtersMap,
  togglesMap,
  entityType,
  parsedActiveFilters,
  toggleActiveFilter,
  parsedFilterToggles,
  toggleFilterToggle,
  selectedFilterItem,
  changeSelectedFilterItem,
  onToggleSelect,
}: Props) {
  return (
    <div className={FilterMenuWrapperStyle}>
      {filtersMap &&
        filtersMap.map(filterSection => {
          const { label, icon, filters } = filterSection;

          return (
            <React.Fragment key={icon}>
              <SectionHeader label={label} icon={icon} />
              <div className={FiltersBodyStyle}>
                {filters.map(filter => {
                  const { name, label: filterLabel, data, field } = filter;
                  const isSelected = selectedFilterItem === name;
                  const isActive = parsedActiveFilters.some(activeFilter => activeFilter === name);

                  return (
                    <FilterMenuItem
                      key={name}
                      name={name}
                      field={field}
                      label={filterLabel}
                      data={data}
                      isSelected={isSelected}
                      changeSelectedFilterItem={changeSelectedFilterItem}
                      isActive={isActive}
                      onToggleSelect={onToggleSelect}
                      toggleActiveFilter={(fieldName: string) =>
                        toggleActiveFilter(entityType, fieldName)
                      }
                    />
                  );
                })}
              </div>
            </React.Fragment>
          );
        })}

      {togglesMap && (
        <div className={TogglesBodyStyle}>
          {togglesMap.map(toggle => {
            const { name, label: toggleLabel, icon } = toggle;
            const isActive = parsedFilterToggles[name];

            return (
              <ToggleMenuItem
                key={name}
                name={name}
                label={toggleLabel}
                icon={icon}
                isActive={isActive}
                toggleFilterToggle={(fieldName: string) =>
                  toggleFilterToggle(entityType, fieldName)
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
