// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import BaseCard from 'components/Cards/BaseCard';
import { CancelButton, SaveButton } from 'components/Buttons';
import { Display } from 'components/Form';
import { PartnerCard } from 'components/Cards';
import {
  EntityIcon,
  Filter,
  PartnerFilterConfig,
  PartnerSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import GridView from 'components/GridView';
import { Content, SlideViewNavBar } from 'components/Layout';
import SlideView from 'components/SlideView';
import useFilterSort from 'hooks/useFilterSort';
import loadMore from 'utils/loadMore';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import Id from '../Common/Id';
import { organizationQuery, partnersQuery } from './query';
import { CardStyle } from './style';

type SelectorProps = {
  organizationType: ?string,
  open: boolean,
  onClose: () => void,
  selected: ?string,
  setSelected: (?string) => void,
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
  const [id, setId] = React.useState<?string>(selected);

  return (
    <SlideView isOpen={open} onRequestClose={onClose}>
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
        <SaveButton disabled={id === selected} onClick={() => setSelected(id)} />
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
            const nodes = (data?.viewer?.user?.organization?.partners?.nodes ?? []).map(item => ({
              ...item.organization,
              code: item.code,
            }));

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
                  return (
                    <PartnerCard
                      key={partner?.id}
                      partner={partner}
                      selectable
                      selected={partner?.id === id}
                      onSelect={() => {
                        setId(partner?.id);
                      }}
                    />
                  );
                })}
              </GridView>
            );
          }}
        </Query>
      </Content>
    </SlideView>
  );
};

const OrganizationId = (organizationType: ?string, title: React.Node) => ({
  value,
  readonly,
  onChange,
}: FilterInputProps<?string>) => {
  return (
    <Id
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
      query={organizationQuery}
      getItem={data => data?.organization}
      renderItem={partner => (
        <BaseCard icon="PARTNER" color="PARTNER" wrapperClassName={CardStyle}>
          <Display height="30px">{partner?.partner?.name || partner?.name}</Display>
        </BaseCard>
      )}
    />
  );
};

export const ImporterId = OrganizationId('Importer', <FormattedMessage {...messages.importer} />);
export const ExporterId = OrganizationId('Exporter', <FormattedMessage {...messages.exporter} />);
export const SupplierId = OrganizationId('Supplier', <FormattedMessage {...messages.supplier} />);
export const ForwarderId = OrganizationId(
  'Forwarder',
  <FormattedMessage {...messages.forwarder} />
);
export const WarehouserId = OrganizationId(
  'Warehouser',
  <FormattedMessage {...messages.warehouser} />
);

export default OrganizationId(null, <FormattedMessage {...messages.organization} />);
