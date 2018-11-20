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
import { type EntityTypes } from './type';
import {
  AdvancedFilterWrapperStyle,
  FilterToggleButtonStyle,
  FilterToggleBadgeStyle,
  AdvancedFilterBodyWrapperStyle,
  AdvancedFilterNavbarStyle,
  AdvancedFilterBodyStyle,
  FilterInputWrapperStyle,
} from './style';

type Props = {
  initialFilter: Object,
  onApply: (filters: Object) => void,
};

type filterType = {
  query: ?string,
};

type State = {
  isActive: boolean,
  filter: filterType,
  selectedEntityType: EntityTypes,
};

class AdvanceFilterInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { initialFilter = {} } = props;
    this.state = {
      isActive: false,
      filter: {
        ...initialFilter,
        query: initialFilter.query || '',
      },
      selectedEntityType: 'order',
    };

    this.filterButtonRef = React.createRef();
  }

  componentDidMount() {
    const { initialFilter } = this.props;
    const isActive = this.hasAnyFilter(initialFilter);
    this.setState({ isActive });
  }

  changeEntityType = (entityType: EntityTypes) => {
    this.setState({ selectedEntityType: entityType });
  };

  hasAnyFilter = (values: Object) => Object.values(values).some(value => !!value);

  onChangeFilter = (filter: filterType) => {
    this.setState({ filter });
  };

  submit = () => {
    const { onApply } = this.props;
    const { filter } = this.state;
    const isActive = this.hasAnyFilter(filter);
    onApply(filter);
    this.setState({ isActive });
  };

  reset = () => {
    this.setState({ isActive: false, filter: { query: '' } });
  };

  filterButtonRef: any;

  render() {
    const { initialFilter } = this.props;
    const { isActive, selectedEntityType } = this.state;

    const filterData = {
      order: {
        poNo: ['ABC'],
        exporter: [],
      },
      item: {},
      batch: {},
      shipment: {},
    };

    const numOfActiveOrderFilters = 2;
    const numOfActiveItemFilters = 0;
    const numOfActiveBatchFilters = 1;
    const numOfActiveShipmentFilters = 0;

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
                  {(isActive || this.hasAnyFilter(initialFilter)) && (
                    <div className={FilterToggleBadgeStyle} />
                  )}
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
                        changeEntityType={this.changeEntityType}
                        numOfActiveOrderFilters={numOfActiveOrderFilters}
                        numOfActiveItemFilters={numOfActiveItemFilters}
                        numOfActiveBatchFilters={numOfActiveBatchFilters}
                        numOfActiveShipmentFilters={numOfActiveShipmentFilters}
                      />
                      <FilterMenu selectedEntityType={selectedEntityType} filterData={filterData} />
                      <div className={FilterInputWrapperStyle}>3</div>
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
