// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { ArrayValue } from 'react-values';
import { partnersQuery } from 'graphql/partner/query';
import loadMore from 'utils/loadMore';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import useFilterSort from 'hooks/useFilterSort';
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

type OptionalProps = {
  cacheKey: string,
};

type Props = OptionalProps & {|
  partnerTypes: Array<string>,
  selected: Array<{
    id: string,
    name: string,
  }>,
  onSelect: (item: Object) => void,
  onCancel: Function,
|};

const MAX_SELECTIONS = 4;

const partnerPath = 'viewer.user.organization.partners';

const SelectPartners = ({ cacheKey, partnerTypes, selected, onCancel, onSelect }: Props) => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', types: partnerTypes },
    { updatedAt: 'DESCENDING' },
    cacheKey
  );

  const queryVariables = { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 };

  return (
    <Query fetchPolicy="network-only" query={partnersQuery} variables={queryVariables}>
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }
        const items = getByPathWithDefault([], `${partnerPath}.nodes`, data).map(item => ({
          ...item.organization,
          code: item.code,
        }));
        const nextPage = getByPathWithDefault(1, `${partnerPath}.page`, data) + 1;
        const totalPage = getByPathWithDefault(1, `${partnerPath}.totalPage`, data);
        const hasMore = nextPage <= totalPage;

        return (
          <ArrayValue defaultValue={selected}>
            {({ value: values, push, filter }) => (
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
                    {values.length}/{MAX_SELECTIONS}
                  </h3>
                  <CancelButton disabled={false} onClick={onCancel} />
                  <SaveButton
                    disabled={isEquals(values.map(item => item.id), selected.map(item => item.id))}
                    onClick={() => onSelect(values)}
                  />
                </SlideViewNavBar>

                <Content>
                  <PartnerGridView
                    hasMore={hasMore}
                    isLoading={loading}
                    onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, partnerPath)}
                    items={items}
                    renderItem={item => {
                      const isSelected = values.some(({ id }) => id === item.id);
                      return (
                        <PartnerCard
                          key={item.id}
                          selectable
                          selected={isSelected}
                          partner={item}
                          onSelect={() => {
                            if (isSelected) {
                              filter(({ id }) => id !== item.id);
                            } else if (values.length < MAX_SELECTIONS) {
                              push(item);
                            }
                          }}
                        />
                      );
                    }}
                  />
                </Content>
              </SlideViewLayout>
            )}
          </ArrayValue>
        );
      }}
    </Query>
  );
};

const defaultProps = {
  cacheKey: 'SelectPartners',
};

SelectPartners.defaultProps = defaultProps;

export default SelectPartners;
