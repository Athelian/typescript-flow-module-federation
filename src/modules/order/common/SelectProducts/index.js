// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { ObjectValue, ArrayValue, NumberValue } from 'react-values';
import GridView from 'components/GridView';
import FilterToolBar from 'components/common/FilterToolBar';
import IncrementInput from 'components/IncrementInput';
import Layout from 'components/Layout';
import { OrderProductProviderCard } from 'components/Cards';
import { SlideViewNavBar } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { productProvidersQuery } from 'modules/product/list/query';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import messages from 'modules/order/messages';
import type { OrderItem } from 'modules/order/type.js.flow';
import { ItemWrapperStyle } from './style';

type OptionalProps = {
  exporter: string,
};

type Props = OptionalProps & {
  onCancel: Function,
  onSelect: Function,
  intl: IntlShape,
};

const defaultProps = {
  exporter: '',
};

function onSelectProduct({
  selected,
  item,
  push,
  set,
}: {
  selected: Array<OrderItem>,
  item: OrderItem,
  push: Function,
  set: Function,
}) {
  if (!selected.includes(item)) {
    push(item);
  } else {
    set(selected.filter((orderItem: OrderItem) => orderItem.id !== item.id));
  }
}

function onChangeProductQuantity({
  selected,
  item,
  set,
  total,
}: {
  selected: Array<OrderItem>,
  item: OrderItem,
  set: Function,
  total: number,
}) {
  const items = [];
  for (let counter = 0; counter < total; counter += 1) {
    items.push(item);
  }
  set(items.concat(selected.filter((orderItem: OrderItem) => orderItem.id !== item.id)));
}

function SelectProducts({ intl, onCancel, onSelect, exporter }: Props) {
  const sortFields = [
    { title: intl.formatMessage(messages.nameSort), value: 'name' },
    { title: intl.formatMessage(messages.serialSort), value: 'serial' },
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
  ];
  return (
    <ObjectValue
      defaultValue={{
        perPage: 20,
        page: 1,
        filter: {
          exporterId: exporter,
          query: '',
        },
        sort: { field: 'updatedAt', direction: 'DESCENDING' },
      }}
    >
      {({ value: filtersAndSort, set: onChange }) => (
        <Query
          query={productProvidersQuery}
          variables={{
            page: 1,
            perPage: filtersAndSort.perPage,
            filter: filtersAndSort.filter,
            sort: { [filtersAndSort.sort.field]: filtersAndSort.sort.direction },
          }}
          fetchPolicy="network-only"
        >
          {({ loading, data, error, fetchMore }) => {
            if (error) {
              return error.message;
            }

            const nextPage = getByPathWithDefault(1, 'productProviders.page', data) + 1;
            const totalPage = getByPathWithDefault(1, 'productProviders.totalPage', data);
            const hasMore = nextPage <= totalPage;

            const items = getByPathWithDefault([], 'productProviders.nodes', data);

            return (
              <ArrayValue>
                {({ value: selected, push, set }) => (
                  <Layout
                    navBar={
                      <SlideViewNavBar>
                        <FilterToolBar
                          icon="PROVIDER"
                          sortFields={sortFields}
                          filtersAndSort={filtersAndSort}
                          onChange={onChange}
                        />
                        <CancelButton onClick={onCancel} />
                        <SaveButton
                          disabled={selected.length === 0}
                          onClick={() => onSelect(selected)}
                        />
                      </SlideViewNavBar>
                    }
                  >
                    <GridView
                      onLoadMore={() =>
                        loadMore({ fetchMore, data }, filtersAndSort, 'productProviders')
                      }
                      hasMore={hasMore}
                      isLoading={loading}
                      itemWidth="195px"
                      isEmpty={items.length === 0}
                      emptyMessage={
                        <FormattedMessage
                          id="modules.Orders.noProductProvidersFound"
                          defaultMessage="No end products found"
                        />
                      }
                    >
                      {items.map(item => (
                        <div key={item.id} className={ItemWrapperStyle}>
                          {selected.includes(item) && (
                            <NumberValue
                              defaultValue={1}
                              onChange={total =>
                                onChangeProductQuantity({ total, set, selected, item })
                              }
                            >
                              {({ value: num, set: changeNumber }) => (
                                <IncrementInput value={num} onChange={changeNumber} />
                              )}
                            </NumberValue>
                          )}
                          <OrderProductProviderCard
                            productProvider={item}
                            selectable
                            selected={selected.includes(item)}
                            onSelect={() => onSelectProduct({ selected, item, push, set })}
                          />
                        </div>
                      ))}
                    </GridView>
                  </Layout>
                )}
              </ArrayValue>
            );
          }}
        </Query>
      )}
    </ObjectValue>
  );
}

SelectProducts.defaultProps = defaultProps;

export default injectIntl(SelectProducts);
