// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
// import Icon from 'components/Icon';
// import FormattedNumber from 'components/FormattedNumber';
import { FilterMenuItem } from '../components';
import messages from './messages';
import { OrderFilterMenuWrapperStyle } from './style';

type Props = {};

type State = {
  selectedFilter: string,
  activeFilters: Array<string>,
};

class OrderFilterMenu extends React.Component<Props, State> {
  state = {
    selectedFilter: 'poNo',
    activeFilters: [],
  };

  changeSelectedFilter = (filter: string) => {
    this.setState({ selectedFilter: filter });
  };

  addActiveFilter = (filter: string) => {
    const { activeFilters } = this.state;

    if (!activeFilters.some(activeFilter => activeFilter === filter)) {
      this.setState({ activeFilters: [...activeFilters, filter] });
    }
  };

  removeActiveFilter = (filter: string) => {
    const { activeFilters } = this.state;

    if (activeFilters.some(activeFilter => activeFilter === filter)) {
      const newActiveFilters = activeFilters.filter(activeFilter => activeFilter !== filter);

      this.setState({ activeFilters: newActiveFilters });
    }
  };

  toggleActiveFilter = (filter: string) => {
    const { activeFilters } = this.state;

    if (!activeFilters.some(activeFilter => activeFilter === filter)) {
      this.addActiveFilter(filter);
    } else {
      this.removeActiveFilter(filter);
    }
  };

  render() {
    const { selectedFilter, activeFilters } = this.state;

    const filtersMap = [{ name: 'poNo' }, { name: 'exporter' }];

    return (
      <div className={OrderFilterMenuWrapperStyle}>
        {filtersMap.map(filter => {
          const { name } = filter;
          const isSelected = selectedFilter === name;
          const isActive = activeFilters.some(activeFilter => activeFilter === name);

          return (
            <FilterMenuItem
              name={name}
              label={<FormattedMessage {...messages[name]} />}
              isSelected={isSelected}
              changeSelectedFilter={this.changeSelectedFilter}
              isActive={isActive}
              toggleActiveFilter={this.toggleActiveFilter}
            />
          );
        })}
      </div>
    );
  }
}

export default OrderFilterMenu;
