// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { NewButton, BaseButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import Icon from 'components/Icon';
import { ItemCard, CardAction } from 'components/Cards';
import RemoveDialog from 'components/Dialog/RemoveDialog';
import { injectUid } from 'utils/id';
import { getByPath } from 'utils/fp';
import { ORDER_FORM, ORDER_UPDATE } from 'modules/permission/constants/order';
import { PRODUCT_FORM } from 'modules/permission/constants/product';
import { ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import {
  ItemsAreaWrapperStyle,
  ItemsNavbarWrapperStyle,
  ItemsBodyWrapperStyle,
  ItemsHeaderWrapperStyle,
  ItemsTitleWrapperStyle,
  IconStyle,
  TitleStyle,
  SyncButtonWrapperStyle,
  ItemsGridStyle,
  ItemCardFocusWrapperStyle,
  ItemCardFocusBackgroundStyle,
  EyeballIconStyle,
  ItemsFooterWrapperStyle,
} from './style';

type Props = {
  itemsIsExpanded: boolean,
  orderItems: Array<Object>,
  order: {
    currency: string,
  },
  setFieldValue: (string, any) => void,
  setFieldTouched: Function,
  focusedItemIndex: ?number,
  onFocusItem: number => void,
};

function ItemsArea({
  itemsIsExpanded,
  orderItems,
  order,
  setFieldValue,
  setFieldTouched,
  focusedItemIndex,
  onFocusItem,
}: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const allowUpdate = hasPermission(ORDER_UPDATE);

  const { currency } = order;

  return (
    <div className={ItemsAreaWrapperStyle(itemsIsExpanded)}>
      <div className={ItemsNavbarWrapperStyle} />

      <div className={ItemsBodyWrapperStyle}>
        <div className={ItemsHeaderWrapperStyle}>
          <div className={ItemsTitleWrapperStyle}>
            <div className={IconStyle}>
              <Icon icon="ORDER_ITEM" />
            </div>

            <div className={TitleStyle}>
              <FormattedMessage id="modules.Orders.items" defaultMessage="ITEMS" />
              {' ('}
              <FormattedNumber value={orderItems.length} />
              {')'}
            </div>
          </div>

          <div className={SyncButtonWrapperStyle}>
            <BaseButton
              icon="SYNC"
              label={
                <FormattedMessage
                  id="modules.Orders.syncAllPrice"
                  defaultMessage="SYNC ALL PRICES"
                />
              }
              onClick={() => {
                const newOrderItems = orderItems.map(orderItem => {
                  const unitPrice = getByPath('productProvider.unitPrice', orderItem);
                  if (unitPrice && unitPrice.currency === currency) {
                    return { ...orderItem, price: unitPrice };
                  }
                  return orderItem;
                });

                setFieldValue('orderItems', newOrderItems);
              }}
            />
          </div>
        </div>

        <div className={ItemsGridStyle}>
          {orderItems.map((item, index) => {
            const isFocused = focusedItemIndex === index;

            const {
              id,
              no,
              quantity,
              price,
              totalBatched,
              totalShipped,
              batchCount,
              batchShippedCount,
              productProvider,
              batches,
            } = item;
            const compiledOrderItem = {
              id,
              no,
              quantity,
              price,
              totalBatched,
              totalShipped,
              batchCount,
              batchShippedCount,
            };

            const { exporter, supplier, unitPrice, product } = productProvider;
            const compiledProductProvider = {
              exporter,
              supplier,
              unitPrice,
            };

            const { id: productId, name, serial, tags, files } = product;
            const compiledProduct = {
              id: productId,
              name,
              serial,
              tags,
              files,
            };

            const compiledOrder = {
              currency,
            };

            const compiledBatches = batches.map(
              ({ quantity: batchQuantity, batchAdjustments, shipment }) => ({
                quantity: batchQuantity,
                batchAdjustments: batchAdjustments.map(({ quantity: adjustmentQuantity }) => ({
                  quantity: adjustmentQuantity,
                })),
                shipment,
              })
            );

            const actions = [
              allowUpdate && (
                <CardAction
                  icon="CLONE"
                  onClick={() => {
                    const { id: itemId, ...rest } = item;

                    setFieldValue('orderItems', [
                      ...orderItems,
                      injectUid({
                        ...rest,
                        isNew: true,
                        batches: [],
                      }),
                    ]);

                    setFieldTouched(`orderItems.${id}`);
                  }}
                />
              ),
              allowUpdate && (
                <BooleanValue>
                  {({ value: isOpen, set: dialogToggle }) => {
                    const onRemove = () => {
                      setFieldValue(
                        'orderItems',
                        orderItems.filter(({ id: itemId }) => id !== itemId)
                      );

                      setFieldTouched(`orderItems.${id}`);
                    };

                    return batches.length > 0 ? (
                      <>
                        <RemoveDialog
                          isOpen={isOpen}
                          onRequestClose={() => dialogToggle(false)}
                          onCancel={() => dialogToggle(false)}
                          onRemove={() => {
                            onRemove();
                            dialogToggle(false);
                          }}
                          message={
                            <div>
                              <div>
                                <FormattedMessage
                                  id="components.cards.deleteOrderItem"
                                  defaultMessage="Are you sure you want to delete this Item?"
                                />
                              </div>
                              <div>
                                <FormattedMessage
                                  id="components.cards.deleteOrderItemBatches"
                                  defaultMessage="This will delete all {batches} of its Batches as well."
                                  values={{ batches: item.batches.length }}
                                />
                              </div>
                              {item.batches.filter(batch => batch.shipment).length > 0 && (
                                <div>
                                  <FormattedMessage
                                    id="components.cards.deleteOrderItemShipments"
                                    defaultMessage="Warning: {shipment} of the Batches are in a Shipment."
                                    values={{
                                      shipment: item.batches.filter(batch => batch.shipment).length,
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          }
                        />
                        <CardAction
                          icon="REMOVE"
                          hoverColor="RED"
                          onClick={() => {
                            dialogToggle(true);
                          }}
                        />
                      </>
                    ) : (
                      <CardAction icon="REMOVE" hoverColor="RED" onClick={onRemove} />
                    );
                  }}
                </BooleanValue>
              ),
            ].filter(Boolean);

            const editable = {
              no: allowUpdate,
              quantity: allowUpdate,
              price: allowUpdate,
            };

            const viewable = {
              price: hasPermission(ORDER_ITEMS_GET_PRICE),
            };

            const navigable = {
              order: hasPermission(ORDER_FORM),
              product: hasPermission(PRODUCT_FORM),
            };

            const config = {
              hideOrder: true,
            };

            return (
              <div key={id} className={ItemCardFocusWrapperStyle}>
                <button
                  className={ItemCardFocusBackgroundStyle(isFocused)}
                  type="button"
                  onClick={() => onFocusItem(index)}
                >
                  <div className={EyeballIconStyle}>
                    <Icon icon={isFocused ? 'INVISIBLE' : 'VISIBLE'} />
                  </div>
                </button>
                <ItemCard
                  orderItem={compiledOrderItem}
                  productProvider={compiledProductProvider}
                  product={compiledProduct}
                  order={compiledOrder}
                  batches={compiledBatches}
                  index={index}
                  actions={actions}
                  setFieldValue={setFieldValue}
                  onClick={() => console.log('Open slideview')}
                  editable={editable}
                  viewable={viewable}
                  navigable={navigable}
                  config={config}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className={ItemsFooterWrapperStyle}>
        <NewButton
          label={<FormattedMessage id="modules.Orders.newItems" defaultMessage="NEW ITEMS" />}
          onClick={() => console.log('Generate new item')}
        />
      </div>
    </div>
  );
}

export default ItemsArea;
