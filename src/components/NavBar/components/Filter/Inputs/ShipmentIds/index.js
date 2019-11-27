// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  EntityIcon,
  Filter,
  Search,
  Sort,
  ShipmentSortConfig,
  ShipmentFilterConfig,
} from 'components/NavBar';
import { CancelButton, SaveButton } from 'components/Buttons';
import { Content, SlideViewNavBar, SlideViewLayout } from 'components/Layout';
import BaseCard from 'components/Cards/BaseCard';
import { ShipmentCard } from 'components/Cards';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { Display } from 'components/Form';
import Selector from 'components/Selector';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import Ids, { type SelectorProps } from '../Common/Ids';
import { shipmentsQuery, shipmentsByIDsQuery } from './query';
import { CardStyle } from './style';

const ShipmentSelector = ({ open, onClose, selected, setSelected }: SelectorProps) => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '' },
    { updatedAt: 'DESCENDING' }
  );

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    shipmentsQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 20 },
      fetchPolicy: 'network-only',
    },
    'shipments'
  );

  return (
    <SlideView isOpen={open} onRequestClose={onClose}>
      <Selector.Many selected={selected}>
        {({ value, dirty, getItemProps }) => (
          <SlideViewLayout>
            <SlideViewNavBar>
              <EntityIcon icon="SHIPMENT" color="SHIPMENT" />
              <Filter
                config={ShipmentFilterConfig.filter(c => c.field !== 'ids')}
                filterBy={filterBy}
                onChange={setFilterBy}
              />
              <Search query={query} onChange={setQuery} />
              <Sort sortBy={sortBy} onChange={setSortBy} config={ShipmentSortConfig} />
              <CancelButton onClick={onClose} />
              <SaveButton disabled={!dirty} onClick={() => setSelected(value)} />
            </SlideViewNavBar>

            <Content>
              <GridView
                onLoadMore={loadMore}
                hasMore={hasMore}
                isLoading={loading}
                isEmpty={nodes.length === 0}
                emptyMessage={null}
                itemWidth="860px"
              >
                {nodes.map(shipment => (
                  <ShipmentCard
                    key={shipment?.id}
                    shipment={shipment}
                    {...getItemProps(shipment)}
                  />
                ))}
              </GridView>
            </Content>
          </SlideViewLayout>
        )}
      </Selector.Many>
    </SlideView>
  );
};

const ShipmentIds = ({ value, readonly, onChange }: FilterInputProps<Array<string>>) => (
  <Ids
    value={value}
    readonly={readonly}
    onChange={onChange}
    title={<FormattedMessage {...messages.shipments} />}
    selector={ShipmentSelector}
    query={shipmentsByIDsQuery}
    getItems={data => data?.shipmentsByIDs ?? []}
    renderItem={shipment => (
      <BaseCard icon="SHIPMENT" color="SHIPMENT" wrapperClassName={CardStyle}>
        <Display height="30px">{shipment?.no}</Display>
      </BaseCard>
    )}
  />
);

export default ShipmentIds;
