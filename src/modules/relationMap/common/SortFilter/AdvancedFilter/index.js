// @flow
import React, { useRef, useReducer, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { isEquals } from 'utils/fp';
import { CancelButton, SaveButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { useUI } from 'components/Context/UI';
import { convertToFilterQuery } from './utils';
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
import reducer, { initialState } from './reducer';

type Props = {
  onApply: Function,
  initialFilter: Object,
};
const ADVANCE_FILTER_STORAGE = 'advanceFilterRelationMap';

const isDefaultFilter = isEquals({
  archived: false,
});

function AdvanceFilter({ onApply, initialFilter }: Props) {
  let initialLocalAdvanceFilter;
  try {
    const localAdvanceFilter =
      window.localStorage && window.localStorage.getItem(ADVANCE_FILTER_STORAGE);
    initialLocalAdvanceFilter = JSON.parse(localAdvanceFilter);
  } catch (error) {
    initialLocalAdvanceFilter = null;
  }

  const uiState = useUI();
  const filterButtonRef = useRef(null);
  const [filterIsApplied, setAppliedFilter] = useState(
    initialLocalAdvanceFilter
      ? !isDefaultFilter(convertToFilterQuery(initialLocalAdvanceFilter))
      : false
  );

  const [state, dispatch] = useReducer(reducer, initialLocalAdvanceFilter || initialState);
  const filterQuery = convertToFilterQuery(state);
  const defaultInitialFilter = isDefaultFilter(initialFilter);
  const defaultFilterQuery = isDefaultFilter(filterQuery);

  useEffect(() => {
    if (window.localStorage) {
      const advanceFilterQuery = convertToFilterQuery(state);
      const localFilter = JSON.parse(window.localStorage.getItem('filterRelationMap') || '{}');
      window.localStorage.setItem(ADVANCE_FILTER_STORAGE, JSON.stringify(state));
      window.localStorage.setItem(
        'filterRelationMap',
        JSON.stringify({
          ...localFilter,
          filter: advanceFilterQuery,
        })
      );
    }
  }, [state]);

  const sameFilter = isEquals(initialFilter, filterQuery);
  const showApplyButton = !defaultInitialFilter || !sameFilter;

  const appliedSomeFilter = sameFilter && !defaultInitialFilter;
  const changeSomeFilter = !sameFilter && !defaultFilterQuery;
  const showCancelButton = appliedSomeFilter || changeSomeFilter;

  return (
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
                  <div className={AdvancedFilterNavbarButtonsWrapperStyle}>
                    {showCancelButton && (
                      <CancelButton
                        onClick={() => {
                          dispatch({ type: 'RESET', payload: {} });
                          setAppliedFilter(false);
                        }}
                        label={
                          <FormattedMessage
                            id="modules.RelationMaps.filter.reset"
                            defaultMessage="RESET"
                          />
                        }
                      />
                    )}
                    {showApplyButton && (
                      <SaveButton
                        disabled={sameFilter}
                        onClick={() => {
                          onApply({ filter: filterQuery });
                          setAppliedFilter(!defaultFilterQuery);
                        }}
                        label={
                          <FormattedMessage
                            id="modules.RelationMaps.filter.apply"
                            defaultMessage="APPLY"
                          />
                        }
                      />
                    )}
                  </div>
                </div>
                <div className={AdvancedFilterBodyStyle}>
                  <EntityTypesMenu
                    selectedEntityType={state.selectedEntityType}
                    activeFilters={state.activeFilters}
                    dispatch={dispatch}
                  />
                  <FilterMenu
                    selectedItems={state.selectedItems}
                    selectedEntityType={state.selectedEntityType}
                    activeFilters={state.activeFilters}
                    radioFilters={state.radioFilters}
                    filterToggles={state.filterToggles}
                    selectedFilterItem={state.selectedFilterItem}
                    dispatch={dispatch}
                  />
                  <FilterInputArea
                    selectedEntityType={state.selectedEntityType}
                    selectedFilterItem={state.selectedFilterItem}
                    selectedItems={
                      state.selectedItems[state.selectedEntityType][state.selectedFilterItem] || []
                    }
                    dispatch={dispatch}
                  />
                </div>
              </div>
            </OutsideClickHandler>
          )}
        </div>
      )}
    </BooleanValue>
  );
}

export default React.memo<Props>(AdvanceFilter);
