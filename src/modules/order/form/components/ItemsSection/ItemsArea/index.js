// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import SelectProducts from 'modules/order/common/SelectProducts';
import ItemFormInSlide from 'modules/orderItem/common/ItemFormInSlide';
import SlideView from 'components/SlideView';
import { NewButton, BaseButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import Icon from 'components/Icon';
import { ItemCard, CardAction } from 'components/Cards';
import RemoveDialog from 'components/Dialog/RemoveDialog';
import { injectUid } from 'utils/id';
import { getByPath } from 'utils/fp';
import { Display } from 'components/Form';
import { Tooltip } from 'components/Tooltip';
import { ORDER_UPDATE } from 'modules/permission/constants/order';
import {
  PRODUCT_FORM,
  PRODUCT_PROVIDER_GET_UNIT_PRICE,
  PRODUCT_PROVIDER_LIST,
} from 'modules/permission/constants/product';
import {
  ORDER_ITEMS_CREATE,
  ORDER_ITEMS_DELETE,
  ORDER_ITEMS_GET_PRICE,
  ORDER_ITEMS_SET_NO,
  ORDER_ITEMS_SET_QUANTITY,
  ORDER_ITEMS_SET_PRICE,
} from 'modules/permission/constants/orderItem';
import {
  ItemsAreaWrapperStyle,
  ItemsNavbarWrapperStyle,
  ItemsBodyWrapperStyle,
  ItemsHeaderWrapperStyle,
  ItemsTitleWrapperStyle,
  IconStyle,
  TitleStyle,
  SyncButtonWrapperStyle,
  NoItemsFoundStyle,
  ItemsGridStyle,
  ItemCardFocusWrapperStyle,
  ItemCardFocusBackgroundStyle,
  EyeballIconStyle,
  ItemsFooterWrapperStyle,
} from './style';

type Props = {
  isNew: boolean,
  itemsIsExpanded: boolean,
  orderItems: Array<Object>,
  order: {
    currency: string,
    exporter: ?Object,
  },
  setFieldValue: (string, any) => void,
  setFieldTouched: Function,
  focusedItemIndex: number,
  onFocusItem: number => void,
  orderIsArchived: boolean,
};

function ItemsArea({
  isNew,
  itemsIsExpanded,
  orderItems,
  order,
  setFieldValue,
  setFieldTouched,
  focusedItemIndex,
  onFocusItem,
  orderIsArchived,
}: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
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
            {orderItems.length > 0 &&
              hasPermission([ORDER_UPDATE, ORDER_ITEMS_SET_PRICE]) &&
              hasPermission(PRODUCT_PROVIDER_GET_UNIT_PRICE) && (
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
                        return {
                          ...orderItem,
                          price: {
                            currency,
                            amount: unitPrice.amount,
                            __typename: getByPath('price.__typename', orderItem),
                          },
                        };
                      }
                      return orderItem;
                    });

                    setFieldValue('orderItems', newOrderItems);
                  }}
                />
              )}
          </div>
        </div>

        {orderItems.length > 0 ? (
          <div className={ItemsGridStyle}>
            {orderItems.map((item, index) => {
              const isFocused = focusedItemIndex === index;

              const {
                id,
                archived,
                no,
                quantity,
                price,
                tags,
                totalBatched,
                totalShipped,
                batchCount,
                batchShippedCount,
                productProvider,
                batches,
                todo,
              } = item;
              const compiledOrderItem = {
                id,
                archived,
                no,
                quantity,
                price,
                tags,
                totalBatched,
                totalShipped,
                batchCount,
                batchShippedCount,
                todo,
              };

              const { name: productProviderName, unitPrice, product } = productProvider;
              const compiledProductProvider = {
                name: productProviderName,
                unitPrice,
              };

              const { id: productId, name, serial, tags: productTags, files } = product;
              const compiledProduct = {
                id: productId,
                name,
                serial,
                tags: productTags,
                files,
              };

              const compiledOrder = {
                currency,
              };

              const actions = [
                hasPermission(ORDER_ITEMS_CREATE) && (
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
                hasPermission([ORDER_ITEMS_DELETE]) && (
                  <BooleanValue>
                    {({ value: isOpen, set: dialogToggle }) => {
                      const onRemove = () => {
                        setFieldValue(
                          'orderItems',
                          orderItems.filter(({ id: itemId }) => id !== itemId)
                        );
                        setFieldTouched(`orderItems.${id}`);
                        if (focusedItemIndex === index) {
                          onFocusItem(index);
                        }
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
                                        shipment: item.batches.filter(batch => batch.shipment)
                                          .length,
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
                no: hasPermission([ORDER_UPDATE, ORDER_ITEMS_SET_NO]),
                quantity: hasPermission([ORDER_UPDATE, ORDER_ITEMS_SET_QUANTITY]),
                price: hasPermission([ORDER_UPDATE, ORDER_ITEMS_SET_PRICE]),
              };

              const viewable = {
                price: hasPermission(ORDER_ITEMS_GET_PRICE),
              };

              const navigable = {
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
                  <BooleanValue key={item.id}>
                    {({ value: opened, set: itemSlideToggle }) => (
                      <>
                        <SlideView isOpen={opened} onRequestClose={() => itemSlideToggle(false)}>
                          {opened && (
                            <ItemFormInSlide
                              orderItem={{ ...item, order }}
                              onSave={updateItem => {
                                itemSlideToggle(false);
                                setFieldValue(`orderItems.${index}`, updateItem);
                              }}
                            />
                          )}
                        </SlideView>
                        <ItemCard
                          orderItem={compiledOrderItem}
                          productProvider={compiledProductProvider}
                          product={compiledProduct}
                          order={compiledOrder}
                          batches={batches}
                          index={index}
                          actions={actions}
                          setFieldValue={setFieldValue}
                          onClick={() => itemSlideToggle(true)}
                          editable={editable}
                          viewable={viewable}
                          navigable={navigable}
                          config={config}
                        />
                      </>
                    )}
                  </BooleanValue>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={NoItemsFoundStyle}>
            <Display align="center">
              <FormattedMessage id="modules.Orders.noItemsFound" defaultMessage="No items found" />
            </Display>
          </div>
        )}
      </div>

      <div className={ItemsFooterWrapperStyle}>
        {hasPermission(ORDER_ITEMS_CREATE) && hasPermission(PRODUCT_PROVIDER_LIST) && (
          <BooleanValue>
            {({ value: opened, set: slideToggle }) => (
              <>
                {(order.exporter && order.exporter.id) || !isNew ? (
                  <NewButton
                    label={
                      <FormattedMessage id="modules.Orders.newItems" defaultMessage="NEW ITEMS" />
                    }
                    onClick={() => {
                      slideToggle(true);
                    }}
                    data-testid="btnNewItems"
                  />
                ) : (
                  <Tooltip
                    message={
                      <FormattedMessage
                        id="modules.Orders.chooseExporterFirst"
                        defaultMessage="Please choose an Exporter first"
                      />
                    }
                  >
                    <div>
                      <NewButton
                        disabled
                        label={
                          <FormattedMessage
                            id="modules.Orders.newItems"
                            defaultMessage="NEW ITEMS"
                          />
                        }
                      />
                    </div>
                  </Tooltip>
                )}

                <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                  {opened && (
                    <SelectProducts
                      onSelect={selectedItems => {
                        setFieldValue('orderItems', [
                          ...orderItems,
                          ...selectedItems.map((productProvider, position) =>
                            injectUid({
                              productProvider,
                              isNew: true,
                              batches: [],
                              no: `${getByPath('product.name', productProvider)} - ${getByPath(
                                'product.serial',
                                productProvider
                              )} - ${position + 1}`,
                              quantity: 0,
                              price: {
                                amount:
                                  getByPath('unitPrice.currency', productProvider) === currency
                                    ? getByPath('unitPrice.amount', productProvider) || 0
                                    : 0,
                                currency,
                              },
                              files: [],
                              todo: {
                                tasks: [],
                                taskTemplate: null,
                              },
                              tags: [],
                              archived: orderIsArchived,
                            })
                          ),
                        ]);
                        setFieldTouched('orderItems');
                        slideToggle(false);
                      }}
                      exporter={(order.exporter && order.exporter.id) || ''}
                      orderCurrency={currency}
                      onCancel={() => slideToggle(false)}
                    />
                  )}
                </SlideView>
              </>
            )}
          </BooleanValue>
        )}
      </div>
    </div>
  );
}

export default ItemsArea;
