// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { spreadOrderItem } from 'utils/item';
import type { UserPayload } from 'generated/graphql';
import { OrderCard, ItemCard, BatchCard, ContainerCard, ShipmentCard } from 'components/Cards';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { ORDER_ITEMS_GET_PRICE, ORDER_ITEMS_FORM } from 'modules/permission/constants/orderItem';
import { PRODUCT_FORM } from 'modules/permission/constants/product';
import {
  ordersInProductQuery,
  itemsInProductQuery,
  batchesInProductQuery,
  containersInProductQuery,
  shipmentsInProductQuery,
} from './query';

export type RelatedType = 'orders' | 'orderItems' | 'batches' | 'containers' | 'shipments';

export const getRelatedQuery = (relatedType: RelatedType) => {
  switch (relatedType) {
    case 'orders':
      return ordersInProductQuery;

    case 'orderItems':
      return itemsInProductQuery;

    case 'batches':
      return batchesInProductQuery;

    case 'containers':
      return containersInProductQuery;

    case 'shipments':
      return shipmentsInProductQuery;

    default:
      return ordersInProductQuery;
  }
};

export const getRelatedConfig = (
  relatedType: RelatedType,
  hasPermission: Function
): ({
  itemWidth: string,
  emptyMessage: React.Node,
  renderItems: (items: Array<Object>, user: UserPayload) => any,
}) => {
  switch (relatedType) {
    case 'orders':
      return {
        itemWidth: '195px',
        emptyMessage: (
          <FormattedMessage id="modules.Orders.noOrderFound" defaultMessage="No orders found" />
        ),
        renderItems: (items: Array<Object>) => {
          return (items.map(item => (
            <PartnerPermissionsWrapper key={item.id} data={item}>
              {permissions => (
                <OrderCard
                  order={item}
                  onClick={() => {
                    if (permissions.includes(ORDER_FORM)) {
                      navigate(`/order/${encodeId(item.id)}`);
                    }
                  }}
                />
              )}
            </PartnerPermissionsWrapper>
          )): Array<React.Node>);
        },
      };

    case 'orderItems':
      return {
        itemWidth: '195px',
        emptyMessage: (
          <FormattedMessage
            id="modules.OrderItems.noOrderItemsFound"
            defaultMessage="No items found"
          />
        ),
        renderItems: (items: Array<Object>) => {
          const viewable = {
            price: hasPermission(ORDER_ITEMS_GET_PRICE),
          };

          const config = {
            hideOrder: false,
          };

          const navigable = {
            order: hasPermission(ORDER_FORM),
            product: hasPermission(PRODUCT_FORM),
          };

          return (items.map(item => {
            const { orderItem, productProvider, product, order } = spreadOrderItem(item);

            return (
              <ItemCard
                key={item.id}
                onClick={() =>
                  hasPermission(ORDER_ITEMS_FORM)
                    ? navigate(`/order-item/${encodeId(item.id)}`)
                    : () => {}
                }
                orderItem={orderItem}
                productProvider={productProvider}
                product={product}
                order={order}
                viewable={viewable}
                config={config}
                navigable={navigable}
              />
            );
          }): Array<React.Node>);
        },
      };

    case 'batches':
      return {
        itemWidth: '195px',
        emptyMessage: (
          <FormattedMessage id="modules.Batches.noBatchesFound" defaultMessage="No batches found" />
        ),
        renderItems: (items: Array<Object>, user: UserPayload) => {
          return (items.map(item => (
            <BatchCard
              key={item.id}
              batch={item}
              onClick={() => navigate(`/batch/${encodeId(item.id)}`)}
              user={user}
            />
          )): Array<React.Node>);
        },
      };

    case 'containers':
      return {
        itemWidth: '195px',
        emptyMessage: (
          <FormattedMessage
            id="modules.Containers.noContainersFound"
            defaultMessage="No containers found"
          />
        ),
        renderItems: (items: Array<Object>, user: UserPayload) => {
          return (items.map(item => (
            <ContainerCard
              key={item.id}
              container={item}
              user={user}
              onClick={() => navigate(`/container/${encodeId(item.id)}`)}
            />
          )): Array<React.Node>);
        },
      };

    case 'shipments':
      return {
        itemWidth: '860px',
        emptyMessage: (
          <FormattedMessage
            id="modules.Shipments.noShipmentFound"
            defaultMessage="No shipments found"
          />
        ),
        renderItems: (items: Array<Object>) => {
          return (items.map(item => (
            <ShipmentCard
              key={item.id}
              shipment={item}
              onClick={() => navigate(`/shipment/${encodeId(item.id)}`)}
            />
          )): Array<React.Node>);
        },
      };

    default:
      return {
        itemWidth: '195px',
        emptyMessage: (
          <FormattedMessage id="modules.Orders.noOrderFound" defaultMessage="No orders found" />
        ),
        renderItems: (items: Array<Object>) => {
          return (items.map(item => (
            <PartnerPermissionsWrapper key={item.id} data={item}>
              {permissions => (
                <OrderCard
                  order={item}
                  onClick={() => {
                    if (permissions.includes(ORDER_FORM)) {
                      navigate(`/order/${encodeId(item.id)}`);
                    }
                  }}
                />
              )}
            </PartnerPermissionsWrapper>
          )): Array<React.Node>);
        },
      };
  }
};
