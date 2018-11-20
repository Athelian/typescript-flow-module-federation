// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
// import Icon from 'components/Icon';
// import FormattedNumber from 'components/FormattedNumber';
import { FilterMenuItem } from '../components';
import messages from './messages';
import { OrderFilterMenuWrapperStyle } from './style';

type Props = {
  data: {
    poNo: Array<string>,
    exporter: Array<string>,
  },
};

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

  toggleActiveFilter = (filter: string) => {
    const { activeFilters } = this.state;

    if (!activeFilters.some(activeFilter => activeFilter === filter)) {
      this.setState({ activeFilters: [...activeFilters, filter] });
    } else {
      const newActiveFilters = activeFilters.filter(activeFilter => activeFilter !== filter);

      this.setState({ activeFilters: newActiveFilters });
    }
  };

  render() {
    const { data } = this.props;
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
              data={data[name]}
            />
          );
        })}
      </div>
    );
  }
}

export default OrderFilterMenu;
