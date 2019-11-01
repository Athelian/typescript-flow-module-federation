// @flow
import { omit, isEmpty, isNullOrUndefined } from 'utils/fp';
import type { EntityTypes, ActiveFilters, FilterToggles } from './type';

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
  radioFilters: {
    order: Object,
    item: Object,
    batch: Object,
    shipment: Object,
  },
};

export const initialState: State = {
  selectedEntityType: 'order',
  selectedFilterItem: 'ids',
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
  radioFilters: {
    order: {
      archived: false,
      completelyBatched: null,
      completelyShipped: null,
    },
    shipment: {
      archived: null,
    },
    item: {},
    batch: {},
  },
  filterToggles: {
    order: {
      completelyBatched: false,
      completelyShipped: false,
    },
    item: {},
    batch: {},
    shipment: {},
  },
};

const defaultFilterMenuItemMap = {
  order: 'ids',
  item: 'price',
  batch: 'deliveredAt',
  shipment: 'forwarder',
};

const removeActiveFilter = (state: State) => ({
  activeFilters: {
    ...state.activeFilters,
    /* $FlowFixMe This comment suppresses an error found when upgrading Flow to
     * v0.111.0. To view the error, delete this comment and run Flow. */
    [state.selectedEntityType]: (state.activeFilters[state.selectedEntityType].filter(
      activeFilter => activeFilter !== state.selectedFilterItem
    ): Array<any>),
  },
});

export default function reducer(state: State, action: { type: string, payload: Object }) {
  switch (action.type) {
    case 'RESET':
      return initialState;
    case 'CHANGE_ENTITY': {
      const {
        payload: { entityType },
      } = action;
      return {
        ...state,
        selectedEntityType: entityType,
        selectedFilterItem: defaultFilterMenuItemMap[entityType],
      };
    }
    case 'CHANGE_RADIO_FILTER': {
      const {
        payload: { entityType, filter, value },
      } = action;
      const { radioFilters } = state;
      const newRadioFilters = { ...radioFilters };
      newRadioFilters[entityType][filter] = value;
      return {
        ...state,
        radioFilters: newRadioFilters,
      };
    }
    case 'OVERRIDE_FILTER': {
      const {
        payload: { advanceFilter },
      } = action;
      return {
        ...state,
        ...advanceFilter,
      };
    }
    case 'TOGGLE_FILTER_TOGGLE': {
      const {
        payload: { entityType, toggle },
      } = action;
      const { filterToggles } = state;
      const newFilterToggles = { ...filterToggles };
      newFilterToggles[entityType][toggle] = !newFilterToggles[entityType][toggle];
      return {
        ...state,
        filterToggles: newFilterToggles,
      };
    }
    case 'TOGGLE_ACTIVE_FILTER': {
      const {
        payload: { entityType, filter },
      } = action;
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
      const {
        payload: { selectedFilterItem },
      } = action;
      return {
        ...state,
        selectedFilterItem,
      };
    }
    case 'SET_SELECT_ITEM': {
      const {
        payload: { selectItem, field },
      } = action;
      const selected =
        state.selectedItems[state.selectedEntityType][state.selectedFilterItem] || {};
      let newSelected = {};
      if (isNullOrUndefined(selectItem)) {
        newSelected = omit([field], selected);
      } else {
        newSelected = { ...selected, [field]: selectItem };
      }
      return {
        ...state,
        selectedItems: {
          ...state.selectedItems,
          /* $FlowFixMe This comment suppresses an error found when upgrading
           * Flow to v0.111.0. To view the error, delete this comment and run
           * Flow. */
          [state.selectedEntityType]: {
            ...state.selectedItems[state.selectedEntityType],
            [state.selectedFilterItem]: newSelected,
          },
        },
        ...(isEmpty(newSelected) ? removeActiveFilter(state) : {}),
      };
    }
    case 'TOGGLE_SELECT_ITEM': {
      const {
        payload: { selectItem },
      } = action;
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
          /* $FlowFixMe This comment suppresses an error found when upgrading
           * Flow to v0.111.0. To view the error, delete this comment and run
           * Flow. */
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
