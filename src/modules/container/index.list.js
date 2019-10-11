// @flow
import * as React from 'react';
import { ExportButton } from 'components/Buttons';
import { Content } from 'components/Layout';
import {
  ContainerFilterConfig,
  ContainerSortConfig,
  EntityIcon,
  Filter,
  NavBar,
  Search,
  Sort,
} from 'components/NavBar';
import useFilterSort from 'hooks/useFilterSort';
import { containersExportQuery } from './query';
import ContainerList from './list';

const ContainerListModule = () => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' },
    'container_cards'
  );

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="CONTAINER" color="CONTAINER" subIcon="CARDS" />

        <Filter config={ContainerFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <Sort config={ContainerSortConfig} sortBy={sortBy} onChange={setSortBy} />

        <ExportButton
          type="Containers"
          exportQuery={containersExportQuery}
          variables={{
            filterBy: { query, ...filterBy },
            sortBy,
          }}
        />
      </NavBar>
      <ContainerList filterBy={{ query, ...filterBy }} sortBy={sortBy} page={1} perPage={10} />
    </Content>
  );
};

export default ContainerListModule;
