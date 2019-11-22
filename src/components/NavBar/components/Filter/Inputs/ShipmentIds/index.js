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
  ShipmentSortConfig,
  ShipmentFilterConfig,
} from 'components/NavBar';
import { CancelButton, SaveButton } from 'components/Buttons';
import { Content, SlideViewNavBar } from 'components/Layout';
import BaseCard from 'components/Cards/BaseCard';
import { ShipmentCard } from 'components/Cards';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { Display } from 'components/Form';
import useFilterSort from 'hooks/useFilterSort';
import { isEquals } from 'utils/fp';
import loadMore from 'utils/loadMore';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import Ids from '../Common/Ids';
import { shipmentsQuery, shipmentsByIDsQuery } from './query';
import { CardStyle } from './style';

type SelectorProps = {
  open: boolean,
  onClose: () => void,
  selected: Array<string>,
  setSelected: (Array<string>) => void,
};

const ShipmentSelector = ({ open, onClose, selected, setSelected }: SelectorProps) => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '' },
    { updatedAt: 'DESCENDING' }
  );

  return (
    <SlideView isOpen={open} onRequestClose={onClose}>
      <ArrayValue defaultValue={selected}>
        {({ value: values, push, filter }) => (
          <>
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
              <SaveButton
                disabled={isEquals(values, selected)}
                onClick={() => setSelected(values)}
              />
            </SlideViewNavBar>

            <Content>
              <Query
                query={shipmentsQuery}
                variables={{ filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 20 }}
                fetchPolicy="network-only"
              >
                {({ loading, data, fetchMore, error }) => {
                  if (error) {
                    return error.message;
                  }

                  const nextPage = (data?.shipments?.page ?? 1) + 1;
                  const totalPage = data?.shipments?.totalPage ?? 1;
                  const hasMore = nextPage <= totalPage;
                  const nodes = data?.shipments?.nodes ?? [];

                  return (
                    <GridView
                      onLoadMore={() =>
                        loadMore({ fetchMore, data }, { filterBy, sortBy }, 'shipments')
                      }
                      hasMore={hasMore}
                      isLoading={loading}
                      isEmpty={nodes.length === 0}
                      emptyMessage={null}
                      itemWidth="860px"
                    >
                      {nodes.map(shipment => {
                        const isSelected = values.some(id => id === shipment?.id);
                        return (
                          <ShipmentCard
                            key={shipment?.id}
                            shipment={shipment}
                            selectable
                            selected={isSelected}
                            onSelect={() => {
                              if (isSelected) {
                                filter(id => id !== shipment?.id);
                              } else {
                                push(shipment?.id);
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
