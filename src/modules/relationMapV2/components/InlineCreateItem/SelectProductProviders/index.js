// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
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
import Selector from 'components/Selector';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
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

  const { nodes, loading, loadMore, hasMore } = useQueryList(
    productProvidersListQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 },
      fetchPolicy: 'network-only',
    },
    'productProviders'
  );

  return (
    <Selector.Many selected={[]}>
      {({ value, dirty, getItemProps, getIncrementProps }) => (
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
              disabled={!dirty || isLoading}
              onClick={() => onSelect(removeTypename(value))}
              isLoading={isLoading}
            />
          </SlideViewNavBar>

          <Content>
            {isLoading && <div className={OverlayStyle} />}
            <GridView
              onLoadMore={loadMore}
              hasMore={hasMore}
              isLoading={loading}
              itemWidth="195px"
              isEmpty={nodes.length === 0}
              emptyMessage={
                <FormattedMessage
                  id="modules.Orders.noProductProvidersFound"
                  defaultMessage="No end products found"
                />
              }
            >
              {nodes.map(productProvider => {
                const itemProps = getItemProps(productProvider);
                return (
                  <div key={productProvider.id} className={ItemWrapperStyle}>
                    {itemProps.selected && (
                      <IncrementInput {...getIncrementProps(productProvider)} />
                    )}
                    <OrderProductProviderCard
                      orderCurrency={orderCurrency}
                      productProvider={productProvider}
                      {...itemProps}
                    />
                  </div>
                );
              })}
            </GridView>
          </Content>
        </SlideViewLayout>
      )}
    </Selector.Many>
  );
}

SelectProductProviders.defaultProps = defaultProps;

export default SelectProductProviders;
