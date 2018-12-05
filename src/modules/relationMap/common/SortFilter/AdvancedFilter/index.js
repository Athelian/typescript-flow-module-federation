// @flow
import React, { useRef, useState, useReducer } from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
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

type State = {
  selectedEntityType: EntityTypes,
  selectedFilterItem: string,
  activeFilters: ActiveFilters,
  filterToggles: FilterToggles,
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

function reducer(state, action) {
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

    default:
      return state;
  }
}

function AdvanceFilter() {
  const filterButtonRef = useRef(null);
  const [filterIsApplied] = useState(false);
  const [isDirty] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

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
                          label={
                            <FormattedMessage
                              id="modules.RelationMaps.filter.reset"
                              defaultMessage="RESET"
                            />
                          }
                        />
                        <SaveButton
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
                    />
                  </div>
                </div>
              </OutsideClickHandler>
            </div>
          )}
        </BooleanValue>
      )}
    </UIConsumer>
  );
}

export default AdvanceFilter;
