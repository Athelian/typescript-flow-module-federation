// @flow
import * as React from 'react';
import { isNullOrUndefined } from 'utils/fp';
import { RadioInput, Label } from 'components/Form';
import { type EntityTypes } from 'modules/relationMap/common/SortFilter/AdvancedFilter/type';
import { FilterMenuItem, SectionHeader, ToggleMenuItem } from '..';
import {
  FilterMenuWrapperStyle,
  FiltersBodyStyle,
  TogglesBodyStyle,
  RadioInputWrapperStyle,
} from './style';

type RadioFilterProps = {
  name: string,
  label: React.Node,
  field: string,
  value: any,
};

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
  archivedUI?: Array<RadioFilterProps>,
  completelyBatchedUI?: Array<RadioFilterProps>,
  completelyShippedUI?: Array<RadioFilterProps>,
  parsedRadioFilters: {
    archived?: boolean,
    completelyBatched?: boolean,
    completelyShipped?: boolean,
  },
};

type Props = OptionalProps & {
  entityType: EntityTypes,
  parsedActiveFilters: Array<string>,
  parsedFilterToggles: Object,
  selectedFilterItem: string,
  dispatch: (action: { type: string, payload: Object }) => void,
};

const isSelectedStatus = (name: string, archived: any): boolean => {
  if (name === 'active' && archived === false) return true;
  if (name === 'archived' && archived === true) return true;
  if (name === 'all' && isNullOrUndefined(archived)) return true;
  return false;
};

const isCompleted = (name: string, status: any): boolean => {
  if (name === 'all' && isNullOrUndefined(status)) return true;
  if (name === 'completely' && !isNullOrUndefined(status)) return true;
  return false;
};

const defaultProps = {
  parsedRadioFilters: {
    archived: false,
  },
};

function BaseFilterMenu({
  filtersMap,
  togglesMap,
  archivedUI,
  completelyBatchedUI,
  completelyShippedUI,
  entityType,
  parsedActiveFilters,
  parsedRadioFilters,
  parsedFilterToggles,
  selectedFilterItem,
  dispatch,
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
                      changeSelectedFilterItem={selectedItem =>
                        dispatch({
                          type: 'FILTER_ITEM',
                          payload: {
                            selectedFilterItem: selectedItem,
                          },
                        })
                      }
                      isActive={isActive}
                      onToggleSelect={(selectItem: any, selectField?: string) =>
                        dispatch({
                          type: selectField ? 'SET_SELECT_ITEM' : 'TOGGLE_SELECT_ITEM',
                          payload: {
                            selectItem,
                            ...(selectField ? { field: selectField } : {}),
                          },
                        })
                      }
                      toggleActiveFilter={(selectFilter: string) =>
                        dispatch({
                          type: 'TOGGLE_ACTIVE_FILTER',
                          payload: {
                            entityType,
                            filter: selectFilter,
                          },
                        })
                      }
                    />
                  );
                })}
              </div>
            </React.Fragment>
          );
        })}

      {archivedUI && parsedFilterToggles && (
        <div className={TogglesBodyStyle}>
          {archivedUI.map(UIItem => {
            const { name, label: text, field, value } = UIItem;

            return (
              <div key={`${name}-${field}`} className={RadioInputWrapperStyle}>
                <RadioInput
                  key={name}
                  selected={isSelectedStatus(
                    name,
                    isNullOrUndefined(parsedRadioFilters) ? null : parsedRadioFilters.archived
                  )}
                  onToggle={() =>
                    dispatch({
                      type: 'CHANGE_RADIO_FILTER',
                      payload: {
                        entityType,
                        filter: field,
                        value,
                      },
                    })
                  }
                >
                  <Label>{text}</Label>
                </RadioInput>
              </div>
            );
          })}
        </div>
      )}

      {completelyBatchedUI && (
        <div className={TogglesBodyStyle}>
          {completelyBatchedUI.map(UIItem => {
            const { name, label: text, field, value } = UIItem;

            return (
              <div key={`${name}-${field}`} className={RadioInputWrapperStyle}>
                <RadioInput
                  key={name}
                  selected={isCompleted(
                    name,
                    isNullOrUndefined(parsedRadioFilters)
                      ? null
                      : parsedRadioFilters.completelyBatched
                  )}
                  onToggle={() =>
                    dispatch({
                      type: 'CHANGE_RADIO_FILTER',
                      payload: {
                        entityType,
                        filter: field,
                        value,
                      },
                    })
                  }
                >
                  <Label>{text}</Label>
                </RadioInput>
              </div>
            );
          })}
        </div>
      )}

      {completelyShippedUI && (
        <div className={TogglesBodyStyle}>
          {completelyShippedUI.map(UIItem => {
            const { name, label: text, field, value } = UIItem;

            return (
              <div key={`${name}-${field}`} className={RadioInputWrapperStyle}>
                <RadioInput
                  key={name}
                  selected={isCompleted(
                    name,
                    isNullOrUndefined(parsedRadioFilters)
                      ? null
                      : parsedRadioFilters.completelyShipped
                  )}
                  onToggle={() =>
                    dispatch({
                      type: 'CHANGE_RADIO_FILTER',
                      payload: {
                        entityType,
                        filter: field,
                        value,
                      },
                    })
                  }
                >
                  <Label>{text}</Label>
                </RadioInput>
              </div>
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
                  dispatch({
                    type: 'TOGGLE_FILTER_TOGGLE',
                    payload: {
                      entityType,
                      toggle: fieldName,
                    },
                  })
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
