// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { UIConsumer } from 'modules/ui';
import EntityTypesMenu from './EntityTypesMenu';
import FilterMenu from './FilterMenu';
import FilterInputArea from './FilterInputArea';
import { type EntityTypes } from './type';
import {
  AdvancedFilterWrapperStyle,
  FilterToggleButtonStyle,
  FilterToggleBadgeStyle,
  AdvancedFilterBodyWrapperStyle,
  AdvancedFilterNavbarStyle,
  AdvancedFilterBodyStyle,
} from './style';

type Props = {};

type State = {
  selectedEntityType: EntityTypes,
  selectedFilterItem: string,
  activeFilters: {
    order: Array<string>,
    item: Array<string>,
    batch: Array<string>,
    shipment: Array<string>,
  },
};

class AdvanceFilterInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedEntityType: 'order',
      selectedFilterItem: 'poNo',
      activeFilters: {
        order: [],
        item: [],
        batch: [],
        shipment: [],
      },
    };

    this.filterButtonRef = React.createRef();
  }

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

  filterButtonRef: any;

  render() {
    const { selectedEntityType, selectedFilterItem, activeFilters } = this.state;
    const isActive =
      activeFilters.order.length > 0 ||
      activeFilters.item.length > 0 ||
      activeFilters.batch.length > 0 ||
      activeFilters.shipment.length > 0;

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
                  {isActive && <div className={FilterToggleBadgeStyle} />}
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
