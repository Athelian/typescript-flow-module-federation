// @flow
import * as React from 'react';

const getIsSidebarExpanded = () => {
  const initialIsSidebarExpandedState = window.localStorage.getItem('is-sidebar-expanded');
  return initialIsSidebarExpandedState === 'yes' || !initialIsSidebarExpandedState;
};
const setIsSidebarExpanded = val => {
  const setValue = val ? 'yes' : 'no';
  window.localStorage.setItem('is-sidebar-expanded', setValue);
};

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
    isSideBarExpanded: getIsSidebarExpanded(),
  };

  toggleSideBarExpansion = () => {
    this.setState(prevState => {
      const newIsSideBarExpanded = !prevState.isSideBarExpanded;
      setIsSidebarExpanded(newIsSideBarExpanded);
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
