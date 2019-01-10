// @flow
import * as React from 'react';

type Props = {
  initFilter: Object,
  filterName: string,
  children: React.Node,
};

const ListConfigContext: React.Context<Object> = React.createContext();

export const ListConfigConsumer = ListConfigContext.Consumer;

export default class ListConfigProvider extends React.Component<Props, Object> {
  constructor(props: Props) {
    super(props);
    const { initFilter }: { initFilter: Object } = props;
    this.state = initFilter;
  }

  componentDidMount() {
    const { filterName } = this.props;
    const localFilter = window.localStorage && window.localStorage.getItem(filterName);
    if (localFilter) {
      this.setState({ ...JSON.parse(localFilter) });
    }
  }

  onChangeFilter = (newValue: Object) => {
    const { filterName } = this.props;
    const { filter: filterBy, sort } = newValue;
    this.setState(prevState => ({ ...prevState, sort, filterBy }));
    window.localStorage.setItem(
      filterName,
      JSON.stringify({
        ...this.state,
        sort,
        filterBy,
      })
    );
  };

  // onChangeFilter = (newValue: any) => {
  //   const { filterName } = this.props
  //   this.setState(prevState => ({ ...prevState, ...newValue }));
  //   if (window.localStorage) {
  //     window.localStorage.setItem(
  //       filterName,
  //       JSON.stringify({
  //         ...this.state,
  //         ...newValue,
  //       })
  //     );
  //   }
  // };

  render() {
    const { children } = this.props;
    return (
      <ListConfigContext.Provider value={{ ...this.state, onChangeFilter: this.onChangeFilter }}>
        {children}
      </ListConfigContext.Provider>
    );
  }
}
