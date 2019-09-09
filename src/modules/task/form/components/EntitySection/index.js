// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { SectionHeader, SectionWrapper } from 'components/Form';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import { PRODUCT_FORM } from 'modules/permission/constants/product';
import { SectionNavBar } from 'components/NavBar';
import {
  ShipmentCard,
  OrderCard,
  ItemCard,
  BatchCard,
  ProductCard,
  OrderProductProviderCard,
} from 'components/Cards';
// FIXME:
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { encodeId } from 'utils/id';
import { spreadOrderItem } from 'utils/item';

import { EntitySectionWrapperStyle, EntitySectionStyle } from './style';

type Props = {
  entity: Object,
  task: Object,
};

const EntitySection = ({ entity, task }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const canViewOrderForm = hasPermission(ORDER_FORM);
  const canViewProductForm = hasPermission(PRODUCT_FORM);

  const entityTypename = entity?.__typename;

  const renderSectionHeader = (typename: string) => {
    switch (typename) {
      case 'Order':
        return (
          <SectionHeader
            icon="ORDER"
            title={<FormattedMessage id="modules.task.order" defaultMessage="ORDER" />}
          />
        );
      case 'OrderItem':
        return (
          <SectionHeader
            icon="ORDER_ITEM"
            title={<FormattedMessage id="modules.task.orderItem" defaultMessage="ORDER ITEM" />}
          />
        );
      case 'Batch':
        return (
          <SectionHeader
            icon="BATCH"
            title={<FormattedMessage id="modules.task.batch" defaultMessage="BATCH" />}
          />
        );
      case 'Shipment':
        return (
          <SectionHeader
            icon="SHIPMENT"
            title={<FormattedMessage id="modules.task.shipment" defaultMessage="SHIPMENT" />}
          />
        );
      case 'Product':
        return (
          <SectionHeader
            icon="PRODUCT"
            title={<FormattedMessage id="modules.task.product" defaultMessage="PRODUCT" />}
          />
        );

      case 'ProductProvider':
        return (
          <SectionHeader
            icon="PRODUCT"
            title={<FormattedMessage id="modules.task.endProduct" defaultMessage="END PRODUCT" />}
          />
        );

      default:
        return null;
    }
  };

  return (
    <SectionWrapper id="task_entity_section">
      {renderSectionHeader(entityTypename)}

      <div className={EntitySectionWrapperStyle}>
        <SectionNavBar>
          <div id="sortsandfilterswip" />
        </SectionNavBar>
      </div>
      <div className={EntitySectionStyle}>
        {entity?.__typename === 'Order' && (
          <OrderCard
            order={task.order}
            onClick={() => {
              if (canViewOrderForm) {
                navigate(`/order/${encodeId(task.order.id)}`);
              }
            }}
          />
        )}

        {entity.__typename === 'OrderItem' &&
          (() => {
            const { orderItem, productProvider, product, order } = spreadOrderItem(task.orderItem);

            const viewable = {
              price: hasPermission(ORDER_ITEMS_GET_PRICE),
            };

            const navigable = {
              order: canViewOrderForm,
              product: canViewProductForm,
            };

            const config = {
              hideOrder: false,
            };
            return (
              <ItemCard
                orderItem={orderItem}
                productProvider={productProvider}
                product={product}
                order={order}
                viewable={viewable}
                navigable={navigable}
                config={config}
                onClick={() => navigate(`/order-item/${encodeId(orderItem.id)}`)}
              />
            );
          })()}

        {entity.__typename === 'Batch' && (
          <BatchCard
            batch={task.batch}
            onClick={() => navigate(`/batch/${encodeId(task.batch.id)}`)}
          />
        )}

        {entity.__typename === 'Shipment' && (
          <ShipmentCard
            shipment={task.shipment}
            onClick={() => navigate(`/shipment/${encodeId(task.shipment.id)}`)}
          />
        )}

        {entity.__typename === 'Product' && (
          <PartnerPermissionsWrapper data={task.product}>
            {permissions => (
              <ProductCard
                product={task.product}
                onClick={() => {
                  if (permissions.includes(PRODUCT_FORM)) {
                    navigate(`/product/${encodeId(task.product.id)}`);
                  }
                }}
              />
            )}
          </PartnerPermissionsWrapper>
        )}

        {entity.__typename === 'ProductProvider' && (
          <OrderProductProviderCard
            productProvider={task.productProvider}
            onClick={() => navigate(`/product/${encodeId(task.productProvider.product.id)}`)}
          />
        )}
      </div>
    </SectionWrapper>
  );
};

export default EntitySection;
