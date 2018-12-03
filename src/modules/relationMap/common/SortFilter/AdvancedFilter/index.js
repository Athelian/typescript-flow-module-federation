// @flow
import * as React from 'react';
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
import type { EntityTypes, ActiveFilters, FilterToggles } from './type';
import {
  AdvancedFilterWrapperStyle,
  FilterToggleButtonStyle,
  FilterToggleBadgeStyle,
  AdvancedFilterBodyWrapperStyle,
  AdvancedFilterNavbarStyle,
  AdvancedFilterNavbarButtonsWrapperStyle,
  AdvancedFilterBodyStyle,
} from './style';

type Props = {};

type State = {
  filterIsApplied: boolean,
  selectedEntityType: EntityTypes,
  selectedFilterItem: string,
  activeFilters: ActiveFilters,
  filterToggles: FilterToggles,
};

class AdvanceFilterInput extends React.Component<Props, State> {
  state = {
    filterIsApplied: false,
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

  filterButtonRef = React.createRef();

  changeSelectedEntityType = (entityType: EntityTypes) => {
    const defaultFilterMenuItemMap = {
      order: 'poNo',
      item: 'price',
      batch: 'deliveredAt',
      shipment: 'forwarder',
    };

    this.setState({
      selectedEntityType: entityType,
      selectedFilterItem: defaultFilterMenuItemMap[entityType],
    });
  };

  changeSelectedFilterItem = (filterItem: string) => {
    this.setState({ selectedFilterItem: filterItem });
  };

  toggleActiveFilter = (entityType: string, filter: string) => {
    const { activeFilters } = this.state;

    // Add
    if (!activeFilters[entityType].some(activeFilter => activeFilter === filter)) {
      const newActiveFilters = { ...activeFilters };
      newActiveFilters[entityType] = [...newActiveFilters[entityType], filter];

      this.setState({ activeFilters: newActiveFilters });
    }
    // Remove
    else {
      const newActiveFilters = { ...activeFilters };
      newActiveFilters[entityType] = newActiveFilters[entityType].filter(
        activeFilter => activeFilter !== filter
      );

      this.setState({ activeFilters: newActiveFilters });
    }
  };

  toggleFilterToggle = (entityType: string, toggle: string) => {
    const { filterToggles } = this.state;

    const newFilterToggles = { ...filterToggles };
    newFilterToggles[entityType][toggle] = !newFilterToggles[entityType][toggle];

    this.setState({ filterToggles: newFilterToggles });
  };

  filterButtonRef: any;

  render() {
    const {
      filterIsApplied,
      selectedEntityType,
      selectedFilterItem,
      activeFilters,
      filterToggles,
    } = this.state;
    const isDirty = true;

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
                  ref={this.filterButtonRef}
                >
                  {filterIsApplied && <div className={FilterToggleBadgeStyle} />}
                  <Icon icon="FILTER" />
                </button>
                <OutsideClickHandler
                  onOutsideClick={() => toggleFilter(false)}
                  ignoreClick={false}
                  ignoreElements={
                    this.filterButtonRef && this.filterButtonRef.current
                      ? [this.filterButtonRef.current]
                      : []
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
                        selectedEntityType={selectedEntityType}
                        changeSelectedEntityType={this.changeSelectedEntityType}
                        activeFilters={activeFilters}
                      />
                      <FilterMenu
                        selectedEntityType={selectedEntityType}
                        activeFilters={activeFilters}
                        toggleActiveFilter={this.toggleActiveFilter}
                        filterToggles={filterToggles}
                        toggleFilterToggle={this.toggleFilterToggle}
                        selectedFilterItem={selectedFilterItem}
                        changeSelectedFilterItem={this.changeSelectedFilterItem}
                      />
                      <FilterInputArea
                        selectedEntityType={selectedEntityType}
                        selectedFilterItem={selectedFilterItem}
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
}

export default AdvanceFilterInput;
