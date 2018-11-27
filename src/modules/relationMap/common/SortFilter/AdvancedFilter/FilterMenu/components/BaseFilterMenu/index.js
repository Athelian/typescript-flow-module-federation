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
  activeFilters: Array<string>,
  toggleActiveFilter: (string, string) => void,
  selectedFilterItem: string,
  changeSelectedFilterItem: string => void,
};

export default function BaseFilterMenu({
  filtersMap,
  togglesMap,
  entityType,
  activeFilters,
  toggleActiveFilter,
  selectedFilterItem,
  changeSelectedFilterItem,
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
                  const { name, label: filterLabel } = filter;
                  const isSelected = selectedFilterItem === name;
                  const isActive = activeFilters.some(activeFilter => activeFilter === name);

                  return (
                    <FilterMenuItem
                      key={name}
                      name={name}
                      label={filterLabel}
                      isSelected={isSelected}
                      changeSelectedFilterItem={changeSelectedFilterItem}
                      isActive={isActive}
                      toggleActiveFilter={(fieldName: string) =>
                        toggleActiveFilter(entityType, fieldName)
                      }
                      data={[]}
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
            const isActive = activeFilters.some(activeFilter => activeFilter === name);

            return (
              <ToggleMenuItem
                key={name}
                name={name}
                label={toggleLabel}
                icon={icon}
                isActive={isActive}
                toggleActiveFilter={(fieldName: string) =>
                  toggleActiveFilter(entityType, fieldName)
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
