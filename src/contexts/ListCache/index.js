// @flow
import * as React from 'react';
import { useAuthenticated } from 'contexts/Viewer';

type ListCache = {
  filterBy: { [string]: any },
  sortBy: { [string]: 'ASCENDING' | 'DESCENDING' },
};

type Context = {
  getListCache: (key: string) => ?ListCache,
  setListCache: (key: string, cache: ListCache) => void,
};

const KEY_PREFIX = 'zenport_list_cache';

export const ListCacheContext = React.createContext<Context>({
  getListCache: () => null,
  setListCache: () => {},
});

export const useListCache = (): Context => React.useContext(ListCacheContext);

type Props = {
  children: React.Node,
};

const ListCacheProvider = ({ children }: Props) => {
  const { authenticated } = useAuthenticated();

  const getListCache = React.useCallback((key: string): ListCache => {
    const result = window.localStorage.getItem(`${KEY_PREFIX}_${key}`);
    if (!result) {
      return null;
    }

    const value = JSON.parse(atob(result));
    if (!value) {
      return null;
    }

    const { filterBy = {}, sortBy = {} } = value;
    return { filterBy, sortBy };
  }, []);

  const setListCache = React.useCallback((key: string, { filterBy, sortBy }: ListCache) => {
    window.localStorage.setItem(`${KEY_PREFIX}_${key}`, btoa(JSON.stringify({ filterBy, sortBy })));
  }, []);

  React.useEffect(() => {
    if (authenticated) {
      return;
    }

    const cacheKeys = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < window.localStorage.length; i++) {
      if (window.localStorage.key(i).indexOf(KEY_PREFIX) === 0) {
        cacheKeys.push(window.localStorage.key(i));
      }
    }

    cacheKeys.forEach(window.localStorage.removeItem);
  }, [authenticated]);

  return (
    <ListCacheContext.Provider
      value={{
        getListCache,
        setListCache,
      }}
    >
      {children}
    </ListCacheContext.Provider>
  );
};

export default ListCacheProvider;
