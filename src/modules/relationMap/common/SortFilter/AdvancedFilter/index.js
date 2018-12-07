// @flow
import React, { useRef, useState, useReducer } from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { getByPathWithDefault as get } from 'utils/fp';
import { formatToDateTimeGraphql } from 'utils/date';
import { CancelButton, SaveButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { UIConsumer } from 'modules/ui';
import EntityTypesMenu from './EntityTypesMenu';
import FilterMenu from './FilterMenu';
import FilterInputArea from './FilterInputArea';
import {
  AdvancedFilterWrapperStyle,
  FilterToggleButtonStyle,
  FilterToggleBadgeStyle,
  AdvancedFilterBodyWrapperStyle,
  AdvancedFilterNavbarStyle,
  AdvancedFilterNavbarButtonsWrapperStyle,
  AdvancedFilterBodyStyle,
} from './style';
import type { EntityTypes, ActiveFilters, FilterToggles } from './type';

type Props = {
  onApply: Function,
};
type State = {
  selectedEntityType: EntityTypes,
  selectedFilterItem: string,
  activeFilters: ActiveFilters,
  filterToggles: FilterToggles,
  selectedItems: {
    order: Object,
    item: Object,
    batch: Object,
    shipment: Object,
  },
};

const initialState: State = {
  selectedEntityType: 'order',
  selectedFilterItem: 'poNo',
  activeFilters: {
    order: [],
    item: [],
    batch: [],
    shipment: [],
  },
  selectedItems: {
    order: {},
    item: {},
    batch: {},
    shipment: {},
  },
  filterToggles: {
    order: {
      completelyBatched: false,
      completelyShipped: false,
      showActive: true,
      showArchived: true,
    },
    item: {},
    batch: {
      showActive: true,
      showArchived: true,
    },
    shipment: {
      showActive: true,
      showArchived: true,
    },
  },
};

const defaultFilterMenuItemMap = {
  order: 'poNo',
  item: 'price',
  batch: 'deliveredAt',
  shipment: 'forwarder',
};

const FILTER = {
  completelyBatched: 'completelyBatched',
  completelyShipped: 'completelyShipped',
  showActive: null,
  showArchived: null,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  poNo: 'poNos',
  inCharge: 'inChargeIds',
  exporter: 'exporterIds',
};

const getFilterValue = (name: string, data: any) => {
  switch (name) {
    default:
      return data;
    case 'poNo':
      return data.map(d => d.poNo);
    case 'inCharge':
    case 'exporter':
      return data.map(d => d.id);
    case 'createdAt':
    case 'updatedAt':
      return {
        ...(data.after && { after: formatToDateTimeGraphql(new Date(data.after)) }),
        ...(data.before && { before: formatToDateTimeGraphql(new Date(data.before)) }),
      };
  }
};

const convertToggleFilter = (state: Object, type: string) => {
  const toggleFilter = get({}, `filterToggles.${type}`, state);
  const filters: Array<any> = Object.entries(toggleFilter);
  const query = filters.reduce((currentQuery, filter) => {
    const [filterName, filterValue] = filter;
    if (FILTER[filterName]) {
      return Object.assign(currentQuery, {
        [FILTER[filterName]]: filterValue,
      });
    }
    return currentQuery;
  }, {});
  return query;
};

const convertActiveFilter = (state: Object, type: string) => {
  const filters = get({}, `activeFilters.${type}`, state);
  const query = filters.reduce((currentQuery, filterName) => {
    if (FILTER[filterName]) {
      const rawValue = get({}, `selectedItems.${type}.${filterName}`, state);
      const filterValue = getFilterValue(filterName, rawValue);
      return Object.assign(currentQuery, {
        [FILTER[filterName]]: filterValue,
      });
    }
    return currentQuery;
  }, {});
  return query;
};
const convertToFilterQuery = (state: Object) => ({
  ...convertActiveFilter(state, 'order'),
  ...convertToggleFilter(state, 'order'),
});
function reducer(state, action) {
  console.warn({
    state,
    action,
  });
  switch (action.type) {
    case 'RESET':
      return initialState;

    case 'CHANGE_ENTITY': {
      const { entityType } = action;

      return {
        ...state,
        selectedEntityType: entityType,
        selectedFilterItem: defaultFilterMenuItemMap[entityType],
      };
    }

    case 'TOGGLE_FILTER_TOGGLE': {
      const { entityType, toggle } = action;
      const { filterToggles } = state;

      const newFilterToggles = { ...filterToggles };
      newFilterToggles[entityType][toggle] = !newFilterToggles[entityType][toggle];

      return {
        ...state,
        filterToggles: newFilterToggles,
      };
    }

    case 'TOGGLE_ACTIVE_FILTER': {
      const { entityType, filter } = action;
      const { activeFilters } = state;
      const newActiveFilters = { ...activeFilters };

      if (!activeFilters[entityType].some(activeFilter => activeFilter === filter)) {
        newActiveFilters[entityType] = [...newActiveFilters[entityType], filter];
      } else {
        newActiveFilters[entityType] = newActiveFilters[entityType].filter(
          activeFilter => activeFilter !== filter
        );
      }

      return {
        ...state,
        activeFilters: newActiveFilters,
      };
    }

    case 'FILTER_ITEM': {
      const { selectedFilterItem } = action;

      return {
        ...state,
        selectedFilterItem,
      };
    }

    case 'SET_SELECT_ITEM': {
      const { selectItem, field } = action;

      const selected =
        state.selectedItems[state.selectedEntityType][state.selectedFilterItem] || {};
      const newSelected = { ...selected, [field]: selectItem };

      return {
        ...state,
        selectedItems: {
          ...state.selectedItems,
          [state.selectedEntityType]: {
            ...state.selectedItems[state.selectedEntityType],
            [state.selectedFilterItem]: newSelected,
          },
        },
      };
    }

    case 'TOGGLE_SELECT_ITEM': {
      const { selectItem } = action;

      const selected =
        state.selectedItems[state.selectedEntityType][state.selectedFilterItem] || [];

      if (!selected.includes(selectItem)) {
        selected.push(selectItem);
      } else {
        selected.splice(selected.indexOf(selectItem), 1);
      }

      return {
        ...state,
        selectedItems: {
          ...state.selectedItems,
          [state.selectedEntityType]: {
            ...state.selectedItems[state.selectedEntityType],
            [state.selectedFilterItem]: selected,
          },
        },
      };
    }

    default:
      return state;
  }
}

function AdvanceFilter({ onApply }: Props) {
  const filterButtonRef = useRef(null);
  const [filterIsApplied] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const isDirty =
    state.activeFilters.batch.length > 0 ||
    state.activeFilters.item.length > 0 ||
    state.activeFilters.order.length > 0 ||
    state.activeFilters.shipment.length > 0;
  console.log(state);
  return (
    <UIConsumer>
      {uiState => (
        <BooleanValue>
          {({ value: isOpen, set: toggleFilter }) => (
            <div className={AdvancedFilterWrapperStyle}>
              <button
                className={FilterToggleButtonStyle}
                onClick={() => toggleFilter(!isOpen)}
                type="button"
                ref={filterButtonRef}
              >
                {filterIsApplied && <div className={FilterToggleBadgeStyle} />}
                <Icon icon="FILTER" />
              </button>
              {isOpen && (
                <OutsideClickHandler
                  onOutsideClick={() => toggleFilter(false)}
                  ignoreClick={false}
                  ignoreElements={
                    filterButtonRef && filterButtonRef.current ? [filterButtonRef.current] : []
                  }
                >
                  <div
                    className={AdvancedFilterBodyWrapperStyle({
                      isOpen,
                      isSideBarExpanded: uiState.isSideBarExpanded,
                    })}
                  >
                    <div className={AdvancedFilterNavbarStyle}>
                      <Label>
                        <FormattedMessage
                          id="modules.RelationMaps.filter.filterBy"
                          defaultMessage="FILTER BY"
                        />
                      </Label>
                      {isDirty && (
                        <div className={AdvancedFilterNavbarButtonsWrapperStyle}>
                          <CancelButton
                            onClick={() => {
                              dispatch({ type: 'RESET' });
                              onApply({ filter: {} });
                            }}
                            label={
                              <FormattedMessage
                                id="modules.RelationMaps.filter.reset"
                                defaultMessage="RESET"
                              />
                            }
                          />
                          <SaveButton
                            onClick={() => {
                              const filter = convertToFilterQuery(state);
                              onApply({ filter });
                            }}
                            label={
                              <FormattedMessage
                                id="modules.RelationMaps.filter.apply"
                                defaultMessage="APPLY"
                              />
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className={AdvancedFilterBodyStyle}>
                      <EntityTypesMenu
                        selectedEntityType={state.selectedEntityType}
                        activeFilters={state.activeFilters}
                        changeSelectedEntityType={entityType =>
                          dispatch({ type: 'CHANGE_ENTITY', entityType })
                        }
                      />
                      <FilterMenu
                        selectedItems={state.selectedItems}
                        selectedEntityType={state.selectedEntityType}
                        activeFilters={state.activeFilters}
                        filterToggles={state.filterToggles}
                        selectedFilterItem={state.selectedFilterItem}
                        toggleActiveFilter={(entityType, filter) =>
                          dispatch({
                            type: 'TOGGLE_ACTIVE_FILTER',
                            entityType,
                            filter,
                          })
                        }
                        toggleFilterToggle={(entityType, toggle) =>
                          dispatch({
                            type: 'TOGGLE_FILTER_TOGGLE',
                            entityType,
                            toggle,
                          })
                        }
                        changeSelectedFilterItem={selectedFilterItem =>
                          dispatch({
                            type: 'FILTER_ITEM',
                            selectedFilterItem,
                          })
                        }
                      />
                      <FilterInputArea
                        selectedEntityType={state.selectedEntityType}
                        selectedFilterItem={state.selectedFilterItem}
                        onToggleSelect={(selectItem: any, field?: string) => {
                          dispatch({
                            type: field ? 'SET_SELECT_ITEM' : 'TOGGLE_SELECT_ITEM',
                            selectItem,
                            ...(field ? { field } : {}),
                          });
                        }}
                        selectedItems={
                          state.selectedItems[state.selectedEntityType][state.selectedFilterItem] ||
                          []
                        }
                      />
                    </div>
                  </div>
                </OutsideClickHandler>
              )}
            </div>
          )}
        </BooleanValue>
      )}
    </UIConsumer>
  );
}

export default AdvanceFilter;
