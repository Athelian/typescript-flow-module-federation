// @flow
import * as React from 'react';
import { isNullOrUndefined } from 'utils/fp';
import { RadioInput, Label } from 'components/Form';
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
  statusMap?: any,
  parsedStatusFilters: { archived?: boolean },
  changeStatusFilter: Function,
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

const isSelectedStatus = (name: string, archived: any): boolean => {
  if (name === 'active' && archived === false) return true;
  if (name === 'archived' && archived === true) return true;
  if (name === 'all' && isNullOrUndefined(archived)) return true;
  return false;
};

const defaultProps = {
  parsedStatusFilters: {
    archived: false,
  },
  changeStatusFilter: () => {},
};

function BaseFilterMenu({
  filtersMap,
  togglesMap,
  statusMap,
  entityType,
  parsedActiveFilters,
  parsedStatusFilters,
  changeStatusFilter,
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

      {statusMap && parsedFilterToggles && (
        <div className={TogglesBodyStyle}>
          {statusMap.map(status => {
            const { name, label: text, field, value } = status;

            return (
              <RadioInput
                key={name}
                selected={isSelectedStatus(
                  name,
                  isNullOrUndefined(parsedStatusFilters) ? null : parsedStatusFilters.archived
                )}
                onToggle={() => changeStatusFilter(entityType, field, value)}
              >
                <Label>{text}</Label>
              </RadioInput>
            );
          })}
        </div>
      )}
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

BaseFilterMenu.defaultProps = defaultProps;

export default BaseFilterMenu;
