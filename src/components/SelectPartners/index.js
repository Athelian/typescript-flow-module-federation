// @flow
import * as React from 'react';
import { partnersQuery } from 'graphql/partner/query';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import Selector from 'components/Selector';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import {
  EntityIcon,
  Filter,
  PartnerFilterConfig,
  PartnerSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import { PartnerCard } from 'components/Cards';
import PartnerGridView from 'modules/partner/list/PartnerGridView';

type Props = {|
  partnerTypes: Array<string>,
  selected: Array<{
    id: string,
    name: string,
  }>,
  onSelect: (item: Object) => void,
  onCancel: Function,
|};

const MAX_SELECTIONS = 4;

const SelectPartners = ({ partnerTypes, selected, onCancel, onSelect }: Props) => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', types: partnerTypes },
    { updatedAt: 'DESCENDING' }
  );

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    partnersQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 },
      fetchPolicy: 'network-only',
    },
    'viewer.user.organization.partners'
  );

  const partners = React.useMemo(
    () =>
      nodes.map(item => ({
        ...item.organization,
        code: item.code,
      })),
    [nodes]
  );

  return (
    <Selector.Many selected={selected} max={MAX_SELECTIONS}>
      {({ value, dirty, getItemProps }) => (
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="PARTNER" color="PARTNER" />

            <Filter
              config={PartnerFilterConfig}
              filterBy={filterBy}
              onChange={setFilterBy}
              staticFilters={['types']}
            />
            <Search query={query} onChange={setQuery} />
            <Sort config={PartnerSortConfig} sortBy={sortBy} onChange={setSortBy} />

            <h3>
              {value.length}/{MAX_SELECTIONS}
            </h3>
            <CancelButton disabled={false} onClick={onCancel} />
            <SaveButton disabled={!dirty} onClick={() => onSelect(value)} />
          </SlideViewNavBar>

          <Content>
            <PartnerGridView
              hasMore={hasMore}
              isLoading={loading}
              onLoadMore={loadMore}
              items={partners}
              renderItem={item => (
                <PartnerCard key={item.id} partner={item} {...getItemProps(item)} />
              )}
            />
          </Content>
        </SlideViewLayout>
      )}
    </Selector.Many>
  );
};

export default SelectPartners;
