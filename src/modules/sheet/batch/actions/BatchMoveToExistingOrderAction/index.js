// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import { useEntityHasPermissions } from 'contexts/Permissions';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import {
  EntityIcon,
  Filter,
  OrderFilterConfig,
  OrderSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { OrderCard } from 'components/Cards';
import { BATCH_UPDATE, BATCH_SET_ORDER_ITEM } from 'modules/permission/constants/batch';
import Selector from 'components/Selector';
import { executeActionMutation, useSheetActionDialog } from 'components/Sheet/SheetAction';
import ValidationCardOverlay from 'components/ValidationCardOverlay';
import { OverlayStyle } from './style';
import { orderListQuery } from './query';
import { batchMoveToExistingOrderActionMutation } from './mutation';

type Props = {|
  getCurrency: (batchId: string, item: Object) => string,
  getOrderId: (batchId: string, item: Object) => string,
  getImporterId: (batchId: string, item: Object) => string,
  getExporterId: (batchId: string, item: Object) => string,
  getLatestQuantity: (batchId: string, item: Object) => number,
  getProductProviderId: (batchId: string, item: Object) => string,
  getOrderItemNo: (batchId: string, item: Object) => string,
  getOrderItemPrice: (batchId: string, item: Object) => { amount: number, currency: string },
|};

type ImplProps = {|
  ...ActionComponentProps,
  ...Props,
|};

type ValidatedOrderCardProps = {|
  order: Object,
  orderId: string,
  importerId: string,
  exporterId: string,
  getItemProps: Function,
|};

const ValidatedOrderCard = ({
  order,
  orderId,
  importerId,
  exporterId,
  getItemProps,
}: ValidatedOrderCardProps) => {
  const itemProps = getItemProps(order);

  const hasPermissions = useEntityHasPermissions(order);
  const isSameParent = order?.id === orderId;
  const isDifferentImporter = order?.importer?.id !== importerId;
  const isDifferentExporter = order?.exporter?.id !== exporterId;
  const noPermission = !hasPermissions([BATCH_UPDATE, BATCH_SET_ORDER_ITEM]);

  let invalidMessage = null;

  if (noPermission) {
    invalidMessage = (
      <FormattedMessage id="modules.RelationMap.move.noPermission" defaultMessage="No permission" />
    );
  } else if (isSameParent) {
    invalidMessage = (
      <FormattedMessage
        id="modules.RelationMap.move.sameParentOrder"
        defaultMessage="Same parent order"
      />
    );
  } else if (isDifferentImporter) {
    invalidMessage = (
      <FormattedMessage
        id="modules.RelationMap.move.isDifferentImporter"
        defaultMessage="Different importer"
      />
    );
  } else if (isDifferentExporter) {
    invalidMessage = (
      <FormattedMessage
        id="modules.RelationMap.move.isDifferentExporter"
        defaultMessage="Different exporter"
      />
    );
  }

  return (
    <ValidationCardOverlay invalidMessage={invalidMessage}>
      <OrderCard order={order} {...itemProps} />
    </ValidationCardOverlay>
  );
};

const BatchMoveToExistingOrderActionImpl = ({
  entity,
  item,
  onDone,
  getCurrency,
  getOrderId,
  getImporterId,
  getExporterId,
  getLatestQuantity,
  getProductProviderId,
  getOrderItemNo,
  getOrderItemPrice,
}: ImplProps) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [orderUpdate, { loading: isProcessing, called }] = useMutation(
    batchMoveToExistingOrderActionMutation
  );

  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    {
      archived: false,
      query: '',
    },
    { updatedAt: 'DESCENDING' }
  );

  const { nodes: orders, loading, hasMore, loadMore } = useQueryList(
    orderListQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 20 },
      fetchPolicy: 'network-only',
    },
    'orders'
  );

  const currency = getCurrency(entity.id, item);
  const orderId = getOrderId(entity.id, item);
  const importerId = getImporterId(entity.id, item);
  const exporterId = getExporterId(entity.id, item);
  const latestQuantity = getLatestQuantity(entity.id, item);
  const productProviderId = getProductProviderId(entity.id, item);
  const orderItemNo = getOrderItemNo(entity.id, item);
  const orderItemPrice = getOrderItemPrice(entity.id, item);

  return (
    <SlideView isOpen={isOpen} onRequestClose={close}>
      <Selector.Single selected={null}>
        {({ value: selectedOrder, dirty, getItemProps }) => (
          <SlideViewLayout>
            <SlideViewNavBar>
              <EntityIcon icon="ORDER" color="ORDER" subIcon="CARDS" />

              <Filter config={OrderFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
              <Search query={query} onChange={setQuery} />
              <Sort config={OrderSortConfig} sortBy={sortBy} onChange={setSortBy} />

              <CancelButton onClick={close} />
              <SaveButton
                disabled={!dirty || isProcessing || called}
                isLoading={isProcessing || called}
                onClick={() => {
                  executeActionMutation(
                    orderUpdate,
                    {
                      id: selectedOrder?.id,
                      input: {
                        orderItems: [
                          ...(selectedOrder?.orderItems ?? []).map(orderItem => ({
                            id: orderItem?.id,
                          })),
                          {
                            productProviderId,
                            no: `[auto] ${orderItemNo}`,
                            quantity: latestQuantity,
                            price: {
                              amount:
                                orderItemPrice?.currency === currency
                                  ? orderItemPrice?.amount ?? 0
                                  : 0,
                              currency,
                            },
                            batches: [{ id: entity.id }],
                          },
                        ],
                      },
                    },
                    close
                  );
                }}
              />
            </SlideViewNavBar>

            <Content>
              {(isProcessing || called) && <div className={OverlayStyle} />}

              <GridView
                onLoadMore={loadMore}
                hasMore={hasMore}
                isLoading={loading}
                itemWidth="195px"
                isEmpty={(orders ?? []).length === 0}
                emptyMessage={
                  <FormattedMessage
                    id="modules.Orders.noOrdersFound"
                    defaultMessage="No Orders found"
                  />
                }
              >
                {orders.map(order => (
                  <ValidatedOrderCard
                    key={order.id}
                    order={order}
                    orderId={orderId}
                    importerId={importerId}
                    exporterId={exporterId}
                    getItemProps={getItemProps}
                  />
                ))}
              </GridView>
            </Content>
          </SlideViewLayout>
        )}
      </Selector.Single>
    </SlideView>
  );
};

const BatchMoveToExistingOrderAction = ({
  getCurrency,
  getOrderId,
  getExporterId,
  getImporterId,
  getLatestQuantity,
  getProductProviderId,
  getOrderItemNo,
  getOrderItemPrice,
}: Props) => (props: ActionComponentProps) => (
  <BatchMoveToExistingOrderActionImpl
    {...props}
    getCurrency={getCurrency}
    getOrderId={getOrderId}
    getExporterId={getExporterId}
    getImporterId={getImporterId}
    getLatestQuantity={getLatestQuantity}
    getProductProviderId={getProductProviderId}
    getOrderItemNo={getOrderItemNo}
    getOrderItemPrice={getOrderItemPrice}
  />
);

export default BatchMoveToExistingOrderAction;
