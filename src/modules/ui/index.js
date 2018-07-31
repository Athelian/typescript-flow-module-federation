// @flow
import * as React from 'react';

const UIContext = React.createContext({
  isSideBarExpanded: true,
  toggleSideBarExpansion: () => {},
});

type Props = {
  children: React.Node,
};

type State = {
  isSideBarExpanded: boolean,
};

class UIProvider extends React.Component<Props, State> {
  state = {
    isSideBarExpanded: true,
  };

  toggleSideBarExpansion = () => {
    this.setState(prevState => ({ isSideBarExpanded: !prevState.isSideBarExpanded }));
  };

  render() {
    const { children } = this.props;
    const { isSideBarExpanded } = this.state;
    return (
      <UIContext.Provider
        value={{ isSideBarExpanded, toggleSideBarExpansion: this.toggleSideBarExpansion }}
      >
        {children}
      </UIContext.Provider>
    );
  }
}

export const UIConsumer = UIContext.Consumer;

export default UIProvider;
