// @flow
import * as React from 'react';
// import { FormattedMessage } from 'react-intl';
// import Icon from 'components/Icon';
// import FormattedNumber from 'components/FormattedNumber';
import { OrderFilterMenuWrapperStyle } from './style';

type Props = {};

type State = {
  selectedFilter: string,
};

class OrderFilterMenu extends React.Component<Props, State> {
  state = {
    selectedFilter: 'poNo',
  };

  render() {
    const { selectedFilter } = this.state;

    return <div className={OrderFilterMenuWrapperStyle}>{selectedFilter}</div>;
  }
}

export default OrderFilterMenu;
