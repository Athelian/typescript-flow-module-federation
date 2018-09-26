// @flow
import * as React from 'react';
import { ObjectValue } from 'react-values';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import OrderItemsList from 'providers/OrderItemsList';
import Layout from 'components/Layout';
import { SectionNavBar as NavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import OrderGridView from 'modules/order/list/OrderGridView';
import { OrderItemCard } from 'components/Cards';

type Props = {
  selected?: ?{
    id: string,
    name: string,
  },
  onSelect: (item: Object) => void,
  onCancel: Function,
};

const defaultProps = {
  selected: {
    id: '',
    name: '',
  },
};

const hasMorePage = (result: Object): boolean => {
  const nextPage = getByPathWithDefault(1, 'orderItems.page', result) + 1;
  const totalPage = getByPathWithDefault(1, 'orderItems.totalPage', result);
  return nextPage <= totalPage;
};

const SelectOrderItem = ({ selected, onCancel, onSelect }: Props) => (
  <ObjectValue
    defaultValue={{
      perPage: 20,
      page: 1,
    }}
  >
    {({ value: filtersAndSort }) => (
      <OrderItemsList {...filtersAndSort}>
        {({ loading, data, fetchMore }) => (
          <ObjectValue defaultValue={selected}>
            {({ value, set }) => (
              <Layout
                navBar={
                  <NavBar>
                    <EntityIcon icon="PRODUCT" color="PRODUCT" />
                    <CancelButton onClick={onCancel} />
                    <SaveButton
                      disabled={isEquals(value, selected)}
                      onClick={() => onSelect(value)}
                    />
                  </NavBar>
                }
              >
                <OrderGridView
                  hasMore={hasMorePage(data)}
                  isLoading={loading}
                  onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'orderItems')}
                  items={getByPathWithDefault([], 'orderItems.nodes', data)}
                  renderItem={item => (
                    <OrderItemCard
                      item={item}
                      onSelect={() => set(item)}
                      selectable
                      selected={item.id === value.id}
                      key={item.id}
                    />
                  )}
                />
              </Layout>
            )}
          </ObjectValue>
        )}
      </OrderItemsList>
    )}
  </ObjectValue>
);

SelectOrderItem.defaultProps = defaultProps;

export default SelectOrderItem;
