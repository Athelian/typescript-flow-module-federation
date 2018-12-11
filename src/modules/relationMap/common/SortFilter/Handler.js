// @flow
import * as React from 'react';

type OptionalProps = {
  filter: Object,
};
type Props = OptionalProps & {
  children: Function,
};

type State = {
  filter: Object,
  page: number,
  perPage: number,
  sort: {
    field: string,
    direction: string,
  },
};

class SortFilterHandler extends React.Component<Props, State> {
  static defaultProps = {
    filter: {},
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      page: 1,
      perPage: 10,
      filter: {
        ...props.filter,
      },
      sort: {
        field: 'updatedAt',
        direction: 'DESCENDING',
      },
    };
  }

  onChangeSortFilter = (newValue: any) => {
    this.setState(prevState => ({ ...prevState, ...newValue }));
  };

  render() {
    const { children } = this.props;
    const { sort, filter, page, perPage } = this.state;
    return children({
      sort,
      filter,
      page,
      perPage,
      onChangeSortFilter: this.onChangeSortFilter,
    });
  }
}

export default SortFilterHandler;
