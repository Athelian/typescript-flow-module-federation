// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { executeActionMutation, useSheetActionDialog } from 'components/Sheet/SheetAction';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { OrderProductProviderCard } from 'components/Cards';
import SlideView from 'components/SlideView';
import { Display, Label } from 'components/Form';
import { CancelButton, SaveButton } from 'components/Buttons';
import IncrementInput from 'components/IncrementInput';
import GridView from 'components/GridView';
import Selector from 'components/Selector';
import {
  EntityIcon,
  Filter,
  ProductProviderFilterConfig,
  ProductProviderSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import { productProvidersListQuery } from 'modules/order/common/SelectProductProviders/query';
import { ItemWrapperStyle } from 'modules/order/common/SelectProductProviders/style';
import { OverlayStyle } from './style';
import orderItemCreateActionMutation from './mutation';

type Props = {
  ...ActionComponentProps,
  getCurrency: (orderId: string, item: Object) => string,
  getImporterId: (orderId: string, item: Object) => string,
  getExporterId: (orderId: string, item: Object) => string,
};

const OrderItemCreateActionImpl = ({
  entity,
  item,
  onDone,
  getCurrency,
  getImporterId,
  getExporterId,
}: Props) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [orderItemCreate, { loading: mutateLoading, called }] = useMutation(
    orderItemCreateActionMutation
  );

  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    {
      archived: false,
      importerId: getImporterId(entity.id, item),
      exporterId: getExporterId(entity.id, item),
      query: '',
    },
    { updatedAt: 'DESCENDING' }
  );

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    productProvidersListQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 20 },
      fetchPolicy: 'network-only',
    },
    'productProviders'
  );

  const currency = getCurrency(entity.id, item);

  const onSelect = (productProviders: Array<Object>) => {
    executeActionMutation(
      orderItemCreate,
      {
        inputs: productProviders.map(productProvider => ({
          orderId: entity.id,
          productProviderId: productProvider.id,
          no: `${productProvider.product.name} ${productProvider.product.serial}`,
          quantity: 0,
          price: {
            amount:
              currency === productProvider.unitPrice?.currency
                ? productProvider.unitPrice?.amount
                : 0,
            currency,
          },
        })),
      },
      close
    );
  };

  return (
    <SlideView isOpen={isOpen} onRequestClose={close}>
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
                <Display align="left">{currency}</Display>
              </div>

              <CancelButton onClick={close} />
              <SaveButton
                disabled={!dirty || mutateLoading || called}
                onClick={() => onSelect(value)}
                isLoading={mutateLoading || called}
              />
            </SlideViewNavBar>

            <Content>
              {(mutateLoading || called) && <div className={OverlayStyle} />}
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
                        orderCurrency={currency}
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
    </SlideView>
  );
};

const OrderItemCreateAction = (
  getCurrency: (orderId: string, item: Object) => string,
  getImporterId: (orderId: string, item: Object) => string,
  getExporterId: (orderId: string, item: Object) => string
) => (props: ActionComponentProps) => (
  <OrderItemCreateActionImpl
    {...props}
    getCurrency={getCurrency}
    getExporterId={getExporterId}
    getImporterId={getImporterId}
  />
);

export default OrderItemCreateAction;
