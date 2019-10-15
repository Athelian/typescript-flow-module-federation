// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Query } from 'react-apollo';
import { ArrayValue } from 'react-values';
import { removeTypename } from 'utils/data';
import GridView from 'components/GridView';
import { productProvidersListQuery } from 'modules/order/common/SelectProductProviders/query';
import { ItemWrapperStyle } from 'modules/order/common/SelectProductProviders/style';
import IncrementInput from 'components/IncrementInput';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { Label, Display } from 'components/Form';
import { OrderProductProviderCard } from 'components/Cards';
import { SaveButton, CancelButton } from 'components/Buttons';
import {
  EntityIcon,
  Filter,
  ProductProviderFilterConfig,
  ProductProviderSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import useFilterSort from 'hooks/useFilterSort';
import type { OrderItem } from 'modules/order/type.js.flow';
import { OverlayStyle } from './style';

type OptionalProps = {
  isLoading: boolean,
  importerId: string,
  exporterId: string,
  orderCurrency: string,
};

type Props = OptionalProps & {
  onCancel: Function,
  onSelect: Function,
};

const defaultProps = {
  importerId: '',
  exporterId: '',
  orderCurrency: '',
  isLoading: false,
};

const countSelected = (selected: Array<OrderItem> = [], value: OrderItem) =>
  selected.filter(item => item.id === value.id).length;

function SelectProductProviders({
  onCancel,
  onSelect,
  importerId,
  exporterId,
  orderCurrency,
  isLoading,
}: Props) {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    {
      importerId,
      exporterId,
      archived: false,
      query: '',
    },
    { updatedAt: 'DESCENDING' }
  );

  const queryVariables = { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 };

  return (
    <Query query={productProvidersListQuery} variables={queryVariables} fetchPolicy="network-only">
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
            {({ value: selected, push, splice, filter }) => (
              <SlideViewLayout>
                <SlideViewNavBar>
                  <EntityIcon icon="PRODUCT_PROVIDER" color="PRODUCT_PROVIDER" />

                  <Filter
                    config={ProductProviderFilterConfig}
                    filterBy={filterBy}
                    onChange={setFilterBy}
                    staticFilters={['importerId', 'exporterId', 'archived']}
                  />
                  <Search query={query} onChange={setQuery} />
                  <Sort config={ProductProviderSortConfig} sortBy={sortBy} onChange={setSortBy} />

                  <div>
                    <Label>
                      <FormattedMessage
                        id="modules.Orders.orderCurrency"
                        defaultMessage="ORDER CURRENCY"
                      />
                    </Label>
                    <Display align="left">
                      {orderCurrency || (
                        <FormattedMessage id="components.cards.na" defaultMessage="N/A" />
                      )}
                    </Display>
                  </div>

                  <CancelButton onClick={onCancel} />
                  <SaveButton
                    data-testid="btnSaveSelectProductProviders"
                    disabled={selected.length === 0 || isLoading}
                    onClick={() => onSelect(removeTypename(selected))}
                    isLoading={isLoading}
                  />
                </SlideViewNavBar>

                <Content>
                  {isLoading && <div className={OverlayStyle} />}
                  <GridView
                    onLoadMore={() =>
                      loadMore({ fetchMore, data }, queryVariables, 'productProviders')
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
                    {items.map(item => {
                      const index = selected.map(({ id }) => id).indexOf(item.id);
                      const isSelected = index !== -1;
                      return (
                        <div key={item.id} className={ItemWrapperStyle}>
                          {isSelected && (
                            <IncrementInput
                              value={countSelected(selected, item)}
                              onMinus={() => splice(index, 1)}
                              onPlus={() => push(item)}
                            />
                          )}
                          <OrderProductProviderCard
                            orderCurrency={orderCurrency}
                            productProvider={item}
                            selectable
                            selected={isSelected}
                            onSelect={() => {
                              if (isSelected) {
                                filter(({ id }) => id !== item.id);
                              } else {
                                push(item);
                              }
                            }}
                          />
                        </div>
                      );
                    })}
                  </GridView>
                </Content>
              </SlideViewLayout>
            )}
          </ArrayValue>
        );
      }}
    </Query>
  );
}

SelectProductProviders.defaultProps = defaultProps;

export default SelectProductProviders;
