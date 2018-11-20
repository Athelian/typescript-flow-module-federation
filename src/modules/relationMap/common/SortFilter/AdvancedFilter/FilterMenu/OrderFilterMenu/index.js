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
  activeFilters: Array<string>,
  toggleActiveFilter: (string, string) => void,
};

type State = {
  selectedFilter: string,
};

class OrderFilterMenu extends React.Component<Props, State> {
  state = {
    selectedFilter: 'poNo',
  };

  changeSelectedFilter = (filter: string) => {
    this.setState({ selectedFilter: filter });
  };

  render() {
    const { data, activeFilters, toggleActiveFilter } = this.props;
    const { selectedFilter } = this.state;

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
              toggleActiveFilter={(fieldName: string) => toggleActiveFilter('order', fieldName)}
              data={data[name]}
            />
          );
        })}
      </div>
    );
  }
}

export default OrderFilterMenu;
