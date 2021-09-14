// @flow
import * as React from 'react';
import { partnersQuery } from 'graphql/partner/query';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import Selector from 'components/Selector';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import useUser from 'hooks/useUser';
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
  partnerCount?: number,
  includeOwner?: boolean,
  selected: Array<{
    id: string,
    name: string,
  }>,
  onSelect: (item: Object) => void,
  onCancel: Function,
|};

/**
 * A selector component for selecting partners
 * If you want to preselect owner org, set includeOwner as true and pass in a
 * falsy value as one of the values in `selected` array parameter
 * @param selected a list of partnership ids
 */
const SelectPartners = ({
  partnerTypes,
  partnerCount,
  includeOwner = false,
  selected,
  onCancel,
  onSelect,
}: Props) => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', types: partnerTypes },
    { updatedAt: 'DESCENDING' }
  );

  const { organization } = useUser();

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    partnersQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 },
      fetchPolicy: 'network-only',
    },
    'viewer.user.organization.partners'
  );

  const items = React.useMemo(() => {
    if (
      includeOwner &&
      partnerTypes.some(partnerType => organization.types.includes(partnerType))
    ) {
      const ownerOrg = {
        id: null,
        name: '', // some partnership name
        organization: {
          id: organization.id,
          name: organization.name,
        },
        types: organization.types,
        code: '',
        tags: [],
      };
      return [ownerOrg, ...nodes];
    }

    return nodes;
  }, [includeOwner, nodes, organization, partnerTypes]);

  const newSelected = React.useMemo(() => {
    return (
      selected
        ?.map(partner => {
          if (partner) {
            return partner;
          }

          // for selecting owner org if supplied
          if (includeOwner) {
            return {
              id: null,
              name: '',
              organization: {
                id: organization.id,
                name: organization.name,
              },
            };
          }

          return null;
        })
        .filter(Boolean) ?? []
    );
  }, [selected, includeOwner, organization]);

  return (
    <Selector.Many selected={newSelected} max={partnerCount}>
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

            {partnerCount && (
              <h3>
                {value.length}/{partnerCount}
              </h3>
            )}
            <CancelButton disabled={false} onClick={onCancel} />
            <SaveButton disabled={!dirty} onClick={() => onSelect(value)} />
          </SlideViewNavBar>

          <Content>
            <PartnerGridView
              hasMore={hasMore}
              isLoading={loading}
              onLoadMore={loadMore}
              items={items}
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
