// @flow
import * as React from 'react';

const isSideBarExpandedStorageKey = 'is-sidebar-expanded';

const getIsSideBarExpandedFromStorage = () => {
  const item = window.localStorage.getItem(isSideBarExpandedStorageKey);
  return item === 'yes' || !item;
};

const saveIsSideBarExpandedInStorage = val => {
  window.localStorage.setItem(isSideBarExpandedStorageKey, val ? 'yes' : 'no');
};

type Context = {
  isSideBarExpanded: boolean,
  toggleSideBarExpansion: () => void,
};

export const UIContext = React.createContext<Context>({
  isSideBarExpanded: true,
  toggleSideBarExpansion: () => {},
});

export const useUI = (): Context => React.useContext(UIContext);

type Props = {
  children: React.Node,
};

const UIProvider = ({ children }: Props) => {
  const [isSideBarExpanded, setIsSideBarExpanded] = React.useState(
    getIsSideBarExpandedFromStorage()
  );

  React.useEffect(() => {
    saveIsSideBarExpandedInStorage(isSideBarExpanded);
  }, [isSideBarExpanded]);

  return (
    <UIContext.Provider
      value={{
        isSideBarExpanded,
        toggleSideBarExpansion: () => setIsSideBarExpanded(!isSideBarExpanded),
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export default UIProvider;
