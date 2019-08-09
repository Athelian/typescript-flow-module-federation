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

type ContextProps = {
  isSideBarExpanded: boolean,
  toggleSideBarExpansion: Function,
};

export const UIContext: React.Context<ContextProps> = React.createContext({
  isSideBarExpanded: true,
  toggleSideBarExpansion: () => {},
});

type Props = {
  children: React.Node,
};

const UIProvider = ({ children }: Props) => {
  const [isSideBarExpanded, setIsSideBarExpanded] = React.useState(getIsSidebarExpanded());
  const toggleSideBarExpansion = React.useCallback(() => {
    setIsSideBarExpanded(!isSideBarExpanded);
    setIsSidebarExpanded(!isSideBarExpanded);
  }, [isSideBarExpanded]);
  return (
    <UIContext.Provider
      value={{
        isSideBarExpanded,
        toggleSideBarExpansion,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const UIConsumer = UIContext.Consumer;

export default UIProvider;
