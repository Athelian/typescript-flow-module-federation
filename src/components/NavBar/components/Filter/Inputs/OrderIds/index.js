// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  EntityIcon,
  Filter,
  Search,
  Sort,
  OrderSortConfig,
  OrderFilterConfig,
} from 'components/NavBar';
import { CancelButton, SaveButton } from 'components/Buttons';
import { Content, SlideViewNavBar, SlideViewLayout } from 'components/Layout';
import BaseCard from 'components/Cards/BaseCard';
import { OrderCard } from 'components/Cards';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { Display } from 'components/Form';
import Selector from 'components/Selector';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import Ids, { type SelectorProps } from '../Common/Ids';
import { ordersQuery, ordersByIDsQuery } from './query';
import { CardStyle } from './style';

const OrderSelector = ({ open, onClose, selected, setSelected }: SelectorProps) => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '' },
    { updatedAt: 'DESCENDING' }
  );

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    ordersQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 20 },
      fetchPolicy: 'network-only',
    },
    'orders'
  );

  return (
    <SlideView isOpen={open} onRequestClose={onClose}>
      <Selector.Many selected={selected}>
        {({ value, dirty, getItemProps }) => (
          <SlideViewLayout>
            <SlideViewNavBar>
              <EntityIcon icon="ORDER" color="ORDER" />
              <Filter
                config={OrderFilterConfig.filter(c => c.field !== 'ids')}
                filterBy={filterBy}
                onChange={setFilterBy}
              />
              <Search query={query} onChange={setQuery} />
              <Sort sortBy={sortBy} onChange={setSortBy} config={OrderSortConfig} />
              <CancelButton onClick={onClose} />
              <SaveButton disabled={!dirty} onClick={() => setSelected(value)} />
            </SlideViewNavBar>

            <Content>
              <GridView
                isLoading={loading}
                hasMore={hasMore}
                onLoadMore={loadMore}
                isEmpty={nodes.length === 0}
                emptyMessage={null}
                itemWidth="195px"
              >
                {nodes.map(order => (
                  <OrderCard key={order?.id} order={order} {...getItemProps(order)} />
                ))}
              </GridView>
            </Content>
          </SlideViewLayout>
        )}
      </Selector.Many>
    </SlideView>
  );
};

const OrderIds = ({ value, readonly, onChange }: FilterInputProps<Array<string>>) => {
  return (
    <Ids
      value={value}
      readonly={readonly}
      onChange={onChange}
      title={<FormattedMessage {...messages.orders} />}
      selector={OrderSelector}
      query={ordersByIDsQuery}
      getItems={data => data?.ordersByIDs ?? []}
      renderItem={order => (
        <BaseCard icon="ORDER" color="ORDER" wrapperClassName={CardStyle}>
          <Display height="30px">{order?.poNo}</Display>
        </BaseCard>
      )}
    />
  );
};

export default OrderIds;
