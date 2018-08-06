// @flow
import * as React from 'react';

const initialIsSideBarExpandedState = JSON.parse(
  window.localStorage.getItem('is-sidebar-expanded')
);

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
    isSideBarExpanded: initialIsSideBarExpandedState != null ? initialIsSideBarExpandedState : true,
  };

  toggleSideBarExpansion = () => {
    this.setState(prevState => {
      const newIsSideBarExpanded = !prevState.isSideBarExpanded;
      window.localStorage.setItem('is-sidebar-expanded', newIsSideBarExpanded);
      return { isSideBarExpanded: newIsSideBarExpanded };
    });
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
