// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { Content } from 'components/Layout';
import {
  FileFilterConfig,
  FileSortConfig,
  EntityIcon,
  Filter,
  NavBar,
  Search,
  Sort,
} from 'components/NavBar';
import useFilterSort from 'hooks/useFilterSort';
import DocumentList from './list';

const DocumentModule = () => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '' },
    { updatedAt: 'DESCENDING' },
    'file_cards'
  );

  return (
    <Provider>
      <Content>
        <NavBar>
          <EntityIcon icon="DOCUMENT" color="DOCUMENT" />

          <Filter config={FileFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
          <Search query={query} onChange={setQuery} />
          <Sort config={FileSortConfig} sortBy={sortBy} onChange={setSortBy} />
        </NavBar>
        <DocumentList filterBy={{ query, ...filterBy }} sortBy={sortBy} page={1} perPage={10} />
      </Content>
    </Provider>
  );
};

export default DocumentModule;
