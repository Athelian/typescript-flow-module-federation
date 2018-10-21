// @flow
import * as React from 'react';

type Props = {
  children: Function,
};

type State = {
  filter: string,
  sort: {
    field: string,
    direction: string,
  },
};

class SortFilterBar extends React.Component<Props, State> {
  state = {
    filter: '',
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
  };

  onChangeFilter = (newValue: any) => {
    this.setState(prevState => ({ ...prevState, ...newValue }));
  };

  render() {
    const { children } = this.props;
    const { sort, filter } = this.state;
    return children({ sort, filter, onChangeFilter: this.onChangeFilter });
  }
}

export default SortFilterBar;
