// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  EntityIcon,
  Filter,
  Search,
  Sort,
  PartnerSortConfig,
  PartnerFilterConfig,
} from 'components/NavBar';
import { CancelButton, SaveButton } from 'components/Buttons';
import { Content, SlideViewNavBar, SlideViewLayout } from 'components/Layout';
import BaseCard from 'components/Cards/BaseCard';
import { PartnerCard } from 'components/Cards';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { Display } from 'components/Form';
import Selector from 'components/Selector';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import Ids, { type SelectorProps as BaseSelectorProps } from '../Common/Ids';
import { organizationsByIDsQuery, partnersQuery } from './query';
import { CardStyle } from './style';

type SelectorProps = {
  ...BaseSelectorProps,
  organizationType: ?string,
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

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    partnersQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 20 },
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
    <SlideView isOpen={open} onRequestClose={onClose}>
      <Selector.Many selected={selected}>
        {({ value, dirty, getItemProps }) => (
          <SlideViewLayout>
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
              <SaveButton disabled={!dirty} onClick={() => setSelected(value)} />
            </SlideViewNavBar>

            <Content>
              <GridView
                onLoadMore={loadMore}
                hasMore={hasMore}
                isLoading={loading}
                isEmpty={partners.length === 0}
                emptyMessage={null}
                itemWidth="195px"
              >
                {partners.map(partner => (
                  <PartnerCard key={partner?.id} partner={partner} {...getItemProps(partner)} />
                ))}
              </GridView>
            </Content>
          </SlideViewLayout>
        )}
      </Selector.Many>
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
