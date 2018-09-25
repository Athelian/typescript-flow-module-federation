// @flow
import * as React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { ObjectValue, ArrayValue, NumberValue } from 'react-values';
import ProductGridView from 'modules/product/list/ProductGridView';
import GridColumn from 'components/GridColumn';
import IncrementInput from 'components/IncrementInput';
import Layout from 'components/Layout';
import { ProductCard } from 'components/Cards';
import {
  SlideViewNavBar,
  EntityIcon,
  FilterInput,
  SortInput,
  SearchInput,
} from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/NavButtons';
import LoadingIcon from 'components/LoadingIcon';
import { productProvidersQuery } from 'modules/product/list/query';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import messages from 'modules/order/messages';
import type { OrderItem } from 'modules/order/type.js.flow';
import { ItemWrapperStyle, NumberBarStyle } from './style';

type Props = {
  exporter: string,
  onCancel: Function,
  onSelect: Function,
  intl: intlShape,
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
  const fields = [
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
        <ArrayValue>
          {({ value: selected, push, set }) => (
            <Layout
              navBar={
                <SlideViewNavBar>
                  <EntityIcon icon="PRODUCT" color="PRODUCT" />
                  <SortInput
                    sort={
                      fields.find(item => item.value === filtersAndSort.sort.field) || fields[0]
                    }
                    ascending={filtersAndSort.sort.direction !== 'DESCENDING'}
                    fields={fields}
                    onChange={({ field: { value }, ascending }) =>
                      onChange({
                        ...filtersAndSort,
                        sort: {
                          field: value,
                          direction: ascending ? 'ASCENDING' : 'DESCENDING',
                        },
                      })
                    }
                  />
                  <FilterInput
                    initialFilter={{}}
                    onChange={filters =>
                      onChange({
                        ...filtersAndSort,
                        filter: { ...filtersAndSort.filter, ...filters },
                      })
                    }
                    width={400}
                  >
                    {({ values, setFieldValue }) => (
                      <GridColumn>
                        <SearchInput
                          name="search"
                          value={values.query}
                          onClear={() => setFieldValue('query', '')}
                          onChange={newValue => setFieldValue('query', newValue)}
                        />
                      </GridColumn>
                    )}
                  </FilterInput>
                  <SearchInput
                    value={filtersAndSort.filter.query}
                    name="search"
                    onClear={() =>
                      onChange({
                        ...filtersAndSort,
                        filter: { ...filtersAndSort.filter, query: '' },
                      })
                    }
                    onChange={newQuery =>
                      onChange({
                        ...filtersAndSort,
                        filter: { ...filtersAndSort.filter, query: newQuery },
                      })
                    }
                  />
                  <CancelButton disabled={false} onClick={onCancel}>
                    Cancel
                  </CancelButton>
                  <SaveButton disabled={selected.length === 0} onClick={() => onSelect(selected)}>
                    Save
                  </SaveButton>
                </SlideViewNavBar>
              }
            >
              <Query
                query={productProvidersQuery}
                variables={{
                  page: 1,
                  perPage: filtersAndSort.perPage,
                  filter: filtersAndSort.filter,
                  sort: { [filtersAndSort.sort.field]: filtersAndSort.sort.direction },
                }}
              >
                {({ loading, data, error, fetchMore }) => {
                  const nextPage = getByPathWithDefault(1, 'productProviders.page', data) + 1;
                  const totalPage = getByPathWithDefault(1, 'productProviders.totalPage', data);
                  if (error) {
                    return error.message;
                  }

                  if (loading) return <LoadingIcon />;

                  return (
                    <ProductGridView
                      onLoadMore={() =>
                        loadMore({ fetchMore, data }, filtersAndSort, 'productProviders')
                      }
                      hasMore={nextPage <= totalPage}
                      isLoading={loading}
                      items={getByPathWithDefault([], 'productProviders.nodes', data)}
                      renderItem={item => (
                        <div key={item.id} className={ItemWrapperStyle}>
                          {selected.includes(item) && (
                            <div className={NumberBarStyle}>
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
                            </div>
                          )}
                          <ProductCard
                            product={item}
                            selectable
                            selected={selected.includes(item)}
                            onSelect={() => onSelectProduct({ selected, item, push, set })}
                          />
                        </div>
                      )}
                    />
                  );
                }}
              </Query>
            </Layout>
          )}
        </ArrayValue>
      )}
    </ObjectValue>
  );
}

export default injectIntl(SelectProducts);
