// @flow
import * as React from 'react';
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
import Selector from 'components/Selector';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import Id, { type SelectorProps as BaseSelectorProps } from '../Common/Id';
import { organizationQuery, partnersQuery } from './query';
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
    <Selector.Single selected={selected ? { id: selected } : null}>
      {({ value, dirty, getItemProps }) => (
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
            <SaveButton disabled={!dirty} onClick={() => setSelected(value?.id ?? null)} />
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
        </SlideView>
      )}
    </Selector.Single>
  );
};

const OrganizationId = (organizationType: ?string, title: React.Node) => ({
  value,
  readonly,
  onChange,
}: FilterInputProps<?string>) => (
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
