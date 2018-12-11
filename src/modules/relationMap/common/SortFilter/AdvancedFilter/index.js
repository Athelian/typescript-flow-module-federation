// @flow
import React, { useRef, useReducer, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { getByPathWithDefault, omit, isEmpty } from 'utils/fp';
import { formatToDateTimeGraphql } from 'utils/date';
import { CancelButton, SaveButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { UIConsumer } from 'modules/ui';
import EntityTypesMenu from './EntityTypesMenu';
import FilterMenu from './FilterMenu';
import FilterInputArea from './FilterInputArea';
import { filterByStatus } from './FilterInputArea/components/MiniSelector';
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
      showArchived: false,
    },
    item: {},
    batch: {
      showActive: true,
      showArchived: false,
    },
    shipment: {
      showActive: true,
      showArchived: false,
    },
  },
};

const defaultFilterMenuItemMap = {
  order: 'poNo',
  item: 'createdAt',
  batch: 'deliveredAt',
  shipment: 'forwarder',
};

const FILTER = {
  order: {
    completelyBatched: null,
    completelyShipped: null,
    showActive: null,
    showArchived: null,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    poNo: 'poNos',
    inCharge: 'inChargeIds',
    exporter: 'exporterIds',
    tags: 'tagIds',
  },
  item: {
    createdAt: 'orderItemCreatedAt',
    updatedAt: 'orderItemUpdatedAt',
    exporter: 'productProviderExporterIds',
    supplier: 'productProviderSupplierIds',
    tags: 'productTagIds',
    origin: 'productProviderOrigins',
  },
  batch: {
    deliveredAt: 'batchDeliveredAt',
    expiredAt: 'batchExpiredAt',
    producedAt: 'batchProducedAt',
    tags: 'batchTagIds',
  },
  shipment: {
    cargoReady: 'shipmentCargoReady',
    loadPortDeparture: 'shipmentLoadPortDeparture',
    firstTransitPortArrival: 'shipmentFirstTransitPortArrival',
    firstTransitPortDeparture: 'shipmentFirstTransitPortDeparturel',
    secondTransitPortArrival: 'shipmentSecondTransitPortArrival',
    secondTransitPortDeparture: 'shipmentSecondTransitPortDeparture',
    dischargePortArrival: 'shipmentDischargePortArrival',
    customClearance: 'shipmentCustomClearance',
    warehouseArrival: 'shipmentWarehouseArrival',
    deliveryReady: 'shipmentDeliveryReady',
    forwarder: 'shipmentForwarderIds',
    inCharge: 'shipmentInChargeIds',
    tags: 'shipmentTagIds',
  },
};

const getFilterValue = (name: string, data: any) => {
  switch (name) {
    default:
      return data;
    case 'showArchived':
      return { ...(data ? {} : { archived: false }) };
    case 'poNo':
      return data.map(d => d.poNo);
    case 'exporter':
      return data.map(d => d.group && d.group.id);
    case 'tags':
    case 'inCharge':
    case 'supplier':
    case 'forwarder':
      return data.map(d => d.id);
    case 'origin':
      return data.filter(d => d.name !== '').map(d => d.name);
    case 'createdAt':
    case 'updatedAt':
    case 'deliveredAt':
    case 'expiredAt':
    case 'producedAt':
    case 'cargoReady':
    case 'loadPortDeparture':
    case 'firstTransitPortArrival':
    case 'firstTransitPortDeparture':
    case 'secondTransitPortArrival':
    case 'secondTransitPortDeparture':
    case 'dischargePortArrival':
    case 'customClearance':
    case 'warehouseArrival':
    case 'deliveryReady':
      return {
        ...(data.after && { after: formatToDateTimeGraphql(new Date(data.after)) }),
        ...(data.before && { before: formatToDateTimeGraphql(new Date(data.before)) }),
      };
  }
};

const convertActiveFilter = (state: Object, type: string) => {
  const filters = getByPathWithDefault({}, `activeFilters.${type}`, state);
  const query = filters.reduce((currentQuery, filterName) => {
    if (FILTER[type] && FILTER[type][filterName]) {
      const rawValue = getByPathWithDefault({}, `selectedItems.${type}.${filterName}`, state);
      const filterValue = getFilterValue(filterName, rawValue);
      return Object.assign(currentQuery, {
        [FILTER[type][filterName]]: filterValue,
      });
    }
    return currentQuery;
  }, {});
  return query;
};

const convertStatusFilter = (state: Object, type: string) => {
  const filterToggle = getByPathWithDefault({}, `filterToggles.${type}`, state);
  const { showActive, showArchived } = filterToggle;
  return filterByStatus(showActive, showArchived);
};

const booleanFilterQuery = (state: Object, filterName: string, path: string) => {
  const filterValue = getByPathWithDefault(false, path, state);
  const filterQuery = {};
  if (filterValue) {
    filterQuery[filterName] = filterValue;
  }
  return filterQuery;
};

const convertToFilterQuery = (state: Object) => ({
  ...convertActiveFilter(state, 'order'),
  ...convertActiveFilter(state, 'item'),
  ...convertActiveFilter(state, 'batch'),
  ...convertActiveFilter(state, 'shipment'),
  ...convertStatusFilter(state, 'order'),
  ...booleanFilterQuery(state, 'completelyBatched', 'filterToggles.order.completelyBatched'),
  ...booleanFilterQuery(state, 'completelyShipped', 'filterToggles.order.completelyShipped'),
});

const removeActiveFilter = state => ({
  activeFilters: {
    ...state.activeFilters,
    [state.selectedEntityType]: state.activeFilters[state.selectedEntityType].filter(
      activeFilter => activeFilter !== state.selectedFilterItem
    ),
  },
});

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

    case 'SET_SELECT_ITEM': {
      const { selectItem, field } = action;

      const selected =
        state.selectedItems[state.selectedEntityType][state.selectedFilterItem] || {};
      let newSelected = {};
      if (!selectItem && selected[field]) {
        newSelected = omit([field], selected);
      } else {
        newSelected = { ...selected, [field]: selectItem };
      }
      return {
        ...state,
        selectedItems: {
          ...state.selectedItems,
          [state.selectedEntityType]: {
            ...state.selectedItems[state.selectedEntityType],
            [state.selectedFilterItem]: newSelected,
          },
        },
        ...(isEmpty(newSelected) ? removeActiveFilter(state) : {}),
      };
    }

    case 'TOGGLE_SELECT_ITEM': {
      const { selectItem } = action;

      let selected = state.selectedItems[state.selectedEntityType][state.selectedFilterItem] || [];

      const selectItemIsArray = Array.isArray(selectItem);
      if (selectItemIsArray) {
        selected = [...selectItem];
      } else {
        const itemIsNotSelected =
          typeof selectItem === 'object' && !selectItemIsArray
            ? !selected.find(selectedData => selectedData.id === selectItem.id)
            : !selected.includes(selectItem);
        if (itemIsNotSelected) {
          selected.push(selectItem);
        } else {
          selected.splice(selected.indexOf(selectItem), 1);
        }
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
        ...(isEmpty(selected) ? removeActiveFilter(state) : {}),
      };
    }

    default:
      return state;
  }
}

const isFilterTogglesDirty = filterToggles => {
  const {
    order: { completelyBatched, completelyShipped, showActive, showArchived },
  } = filterToggles;
  return completelyBatched || completelyShipped || !showActive || showArchived;
};

const isActiveFilterDirty = activeFilters => {
  const { order, item, batch, shipment } = activeFilters;
  return order.length > 0 || item.length > 0 || batch.length > 0 || shipment.length > 0;
};

function AdvanceFilter({ onApply }: Props) {
  const filterButtonRef = useRef(null);
  const [filterIsApplied, setAppliedFilter] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const isDirty =
    isActiveFilterDirty(state.activeFilters) || isFilterTogglesDirty(state.filterToggles);
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
                              setAppliedFilter(false);
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
                              setAppliedFilter(true);
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
                        onToggleSelect={(selectItem: any, field?: string) =>
                          dispatch({
                            type: field ? 'SET_SELECT_ITEM' : 'TOGGLE_SELECT_ITEM',
                            selectItem,
                            ...(field ? { field } : {}),
                          })
                        }
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
