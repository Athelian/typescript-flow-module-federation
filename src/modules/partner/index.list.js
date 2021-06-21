// @flow
import * as React from 'react';
import { Content } from 'components/Layout';
import {
  PartnerFilterConfig,
  PartnerSortConfig,
  EntityIcon,
  Filter,
  NavBar,
  Search,
  Sort,
} from 'components/NavBar';
import { ExportButton } from 'components/Buttons';
import useFilterSort from 'hooks/useFilterSort';
import PartnerList from './list';
import { partnersExportQuery } from './query';

const PartnerModule = () => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '' },
    { updatedAt: 'DESCENDING' },
    'partner_cards'
  );

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="PARTNER" color="PARTNER" />

        <Filter config={PartnerFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <Sort config={PartnerSortConfig} sortBy={sortBy} onChange={setSortBy} />

        <ExportButton
          type="Partners"
          exportQuery={partnersExportQuery}
          variables={{
            sortBy,
          }}
        />
      </NavBar>
      <PartnerList filterBy={{ query, ...filterBy }} sortBy={sortBy} page={1} perPage={10} />
    </Content>
  );
};

export default PartnerModule;
