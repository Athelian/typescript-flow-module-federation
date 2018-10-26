// @flow
import * as React from 'react';

type Props = {
  children: Function,
};

type State = {
  filter: Object,
  sort: {
    field: string,
    direction: string,
  },
};

class SortFilterHandler extends React.Component<Props, State> {
  state = {
    filter: {
      query: '',
    },
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
  };

  onChangeSortFilter = (newValue: any) => {
    this.setState(prevState => ({ ...prevState, ...newValue }));
  };

  render() {
    const { children } = this.props;
    const { sort, filter } = this.state;
    return children({ sort, filter, onChangeSortFilter: this.onChangeSortFilter });
  }
}

export default SortFilterHandler;
