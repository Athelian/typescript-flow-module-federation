// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ArrayValue } from 'react-values';
import {
  EntityIcon,
  Filter,
  SearchInput,
  Sort,
  OrderSortConfig,
  OrderFilterConfig,
} from 'components/NavBar';
import { CancelButton, SaveButton } from 'components/Buttons';
import { Content, SlideViewNavBar } from 'components/Layout';
import BaseCard from 'components/Cards/BaseCard';
import { OrderCard } from 'components/Cards';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { Display } from 'components/Form';
import useListQuery from 'hooks/useListQuery';
import { isEquals } from 'utils/fp';
import messages from '../../messages';
import Ids from '../Ids';
import { ordersQuery, ordersByIDsQuery } from './query';
import { CardStyle } from './style';

type Props = {
  value: Array<string>,
  readonly: boolean,
  onChange: (Array<string>) => void,
};

type SelectorProps = {
  open: boolean,
  onClose: () => void,
  selected: Array<string>,
  setSelected: (Array<string>) => void,
};

const OrderSelector = ({ open, onClose, selected, setSelected }: SelectorProps) => {
  const [filterBy, setFilterBy] = React.useState({
    query: '',
  });
  const [sortBy, setSortBy] = React.useState({
    updatedAt: 'DESCENDING',
  });
  const { query, ...filters } = filterBy;
  const { loading, hasMore, loadMore, nodes } = useListQuery(ordersQuery, { filterBy, sortBy }, 20);

  return (
    <SlideView isOpen={open} onRequestClose={onClose}>
      <ArrayValue defaultValue={selected}>
        {({ value: values, push, filter }) => (
          <>
            <SlideViewNavBar>
              <EntityIcon icon="ORDER" color="ORDER" />
              <Filter
                config={OrderFilterConfig.filter(c => c.field !== 'ids')}
                filters={filters}
                onChange={value => setFilterBy({ ...value, query })}
              />
              <SearchInput
                value={query}
                name="search"
                onClear={() =>
                  setFilterBy({
                    ...filterBy,
                    query: '',
                  })
                }
                onChange={value =>
                  setFilterBy({
                    ...filterBy,
                    query: value,
                  })
                }
              />
              <Sort sortBy={sortBy} onChange={setSortBy} config={OrderSortConfig} />
              <CancelButton onClick={onClose} />
              <SaveButton
                disabled={isEquals(values, selected)}
                onClick={() => setSelected(values)}
              />
            </SlideViewNavBar>

            <Content>
              <GridView
                onLoadMore={loadMore}
                hasMore={hasMore}
                isLoading={loading}
                isEmpty={nodes.length === 0}
                emptyMessage={null}
                itemWidth="195px"
              >
                {nodes.map(order => {
                  const isSelected = values.some(id => id === order?.id);
                  return (
                    <OrderCard
                      key={order?.id}
                      order={order}
                      selectable
                      selected={isSelected}
                      onSelect={() => {
                        if (isSelected) {
                          filter(id => id !== order?.id);
                        } else {
                          push(order?.id);
                        }
                      }}
                    />
                  );
                })}
              </GridView>
            </Content>
          </>
        )}
      </ArrayValue>
    </SlideView>
  );
};

const OrderIds = ({ value, readonly, onChange }: Props) => {
  return (
    <Ids
      value={value}
      readonly={readonly}
      onChange={onChange}
      title={<FormattedMessage {...messages.orders} />}
      selector={OrderSelector}
      query={ordersByIDsQuery}
      renderItem={order => (
        <BaseCard icon="ORDER" color="ORDER" wrapperClassName={CardStyle} readOnly>
          <Display height="30px">{order?.poNo}</Display>
        </BaseCard>
      )}
    />
  );
};

export default OrderIds;
