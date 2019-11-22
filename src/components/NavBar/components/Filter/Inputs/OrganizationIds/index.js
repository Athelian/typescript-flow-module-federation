// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ArrayValue } from 'react-values';
import { Query } from 'react-apollo';
import {
  EntityIcon,
  Filter,
  Search,
  Sort,
  PartnerSortConfig,
  PartnerFilterConfig,
} from 'components/NavBar';
import { CancelButton, SaveButton } from 'components/Buttons';
import { Content, SlideViewNavBar } from 'components/Layout';
import BaseCard from 'components/Cards/BaseCard';
import { PartnerCard } from 'components/Cards';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { Display } from 'components/Form';
import useFilterSort from 'hooks/useFilterSort';
import { isEquals } from 'utils/fp';
import loadMore from 'utils/loadMore';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import Ids from '../Common/Ids';
import { organizationsByIDsQuery, partnersQuery } from './query';
import { CardStyle } from './style';

type SelectorProps = {
  organizationType: ?string,
  open: boolean,
  onClose: () => void,
  selected: Array<string>,
  setSelected: (Array<string>) => void,
};

const OrganizationSelector = ({
  open,
  onClose,
  selected,
  setSelected,
  organizationType,
}: SelectorProps) => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', ...(organizationType ? { types: [organizationType] } : {}) },
    { updatedAt: 'DESCENDING' }
  );

  return (
    <SlideView isOpen={open} onRequestClose={onClose}>
      <ArrayValue defaultValue={selected}>
        {({ value: values, push, filter }) => (
          <>
            <SlideViewNavBar>
              <EntityIcon icon="PARTNER" color="PARTNER" />
              <Filter
                config={PartnerFilterConfig}
                filterBy={filterBy}
                staticFilters={organizationType ? ['types'] : []}
                onChange={setFilterBy}
              />
              <Search query={query} onChange={setQuery} />
              <Sort sortBy={sortBy} onChange={setSortBy} config={PartnerSortConfig} />
              <CancelButton onClick={onClose} />
              <SaveButton
                disabled={isEquals(values, selected)}
                onClick={() => setSelected(values)}
              />
            </SlideViewNavBar>

            <Content>
              <Query
                query={partnersQuery}
                variables={{ filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 20 }}
                fetchPolicy="network-only"
              >
                {({ loading, data, fetchMore, error }) => {
                  if (error) {
                    return error.message;
                  }

                  const nextPage = (data?.viewer?.user?.organization?.partners?.page ?? 1) + 1;
                  const totalPage = data?.viewer?.user?.organization?.partners?.totalPage ?? 1;
                  const hasMore = nextPage <= totalPage;
                  const nodes = (data?.viewer?.user?.organization?.partners?.nodes ?? []).map(
                    item => ({
                      ...item.organization,
                      code: item.code,
                    })
                  );

                  return (
                    <GridView
                      onLoadMore={() =>
                        loadMore(
                          { fetchMore, data },
                          { filterBy, sortBy },
                          'viewer.user.organization.partners'
                        )
                      }
                      hasMore={hasMore}
                      isLoading={loading}
                      isEmpty={nodes.length === 0}
                      emptyMessage={null}
                      itemWidth="195px"
                    >
                      {nodes.map(partner => {
                        const isSelected = values.some(id => id === partner?.id);
                        return (
                          <PartnerCard
                            key={partner?.id}
                            partner={partner}
                            selectable
                            selected={isSelected}
                            onSelect={() => {
                              if (isSelected) {
                                filter(id => id !== partner?.id);
                              } else {
                                push(partner?.id);
                              }
                            }}
                          />
                        );
                      })}
                    </GridView>
                  );
                }}
              </Query>
            </Content>
          </>
        )}
      </ArrayValue>
    </SlideView>
  );
};

const OrganizationIdsImpl = (organizationType: ?string, title: React.Node) => ({
  value,
  readonly,
  onChange,
}: FilterInputProps<Array<string>>) => {
  return (
    <Ids
      value={value}
      readonly={readonly}
      onChange={onChange}
      title={title}
      selector={({ open, onClose, selected, setSelected }) => (
        <OrganizationSelector
          organizationType={organizationType}
          open={open}
          onClose={onClose}
          selected={selected}
          setSelected={setSelected}
        />
      )}
      query={organizationsByIDsQuery}
      getItems={data => data?.organizationsByIDs ?? []}
      renderItem={partner => (
        <BaseCard icon="PARTNER" color="PARTNER" wrapperClassName={CardStyle}>
          <Display height="30px">{partner?.partner?.name || partner?.name}</Display>
        </BaseCard>
      )}
    />
  );
};

export const ImporterIds = OrganizationIdsImpl(
  'Importer',
  <FormattedMessage {...messages.importers} />
);
export const ExporterIds = OrganizationIdsImpl(
  'Exporter',
  <FormattedMessage {...messages.exporters} />
);
export const SupplierIds = OrganizationIdsImpl(
  'Supplier',
  <FormattedMessage {...messages.suppliers} />
);
export const ForwarderIds = OrganizationIdsImpl(
  'Forwarder',
  <FormattedMessage {...messages.forwarders} />
);
export const WarehouserIds = OrganizationIdsImpl(
  'Warehouser',
  <FormattedMessage {...messages.warehousers} />
);

export default OrganizationIdsImpl(null, <FormattedMessage {...messages.organizations} />);
