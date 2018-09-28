// @flow
import React from 'react';
import { ObjectValue, BooleanValue } from 'react-values';
import { type OrderItem } from 'modules/order/type.js.flow';
import { FormField } from 'modules/form';
import { numberInputFactory, priceInputFactory } from 'modules/form/helpers';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import QuantityChart from 'components/QuantityChart';
import FormattedNumber from 'components/FormattedNumber';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import { Label, Display, FieldItem } from 'components/Form';
import BaseCard, { CardAction } from '../BaseCard';
import {
  OrderItemCardWrapperStyle,
  ProductWrapperStyle,
  ProductImageStyle,
  ProductInfoWrapperStyle,
  ProductNameStyle,
  ProductSerialStyle,
  ProductSupplierStyle,
  ProductTagsWrapperStyle,
  ProductIconLinkStyle,
  BodyWrapperStyle,
  QuantityWrapperStyle,
  UnitPriceWrapperStyle,
  SyncButtonStyle,
  DividerStyle,
  ChartWrapperStyle,
  TotalPriceWrapperStyle,
} from './style';

type OptionalProps = {
  onClick: (id: string) => void,
  onSelect: (item: OrderItem) => void,
  onClone: (item: OrderItem) => void,
  onRemove: (item: OrderItem) => void,
  selectable: boolean,
};

type Props = OptionalProps & {
  item: ?OrderItem,
  currency: string,
  saveOnBlur: Function,
};

function getQuantitySummary(item: Object) {
  let orderedQuantity = 0;
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let numOfBatched = 0;
  let numOfShipped = 0;

  orderedQuantity += item.quantity ? item.quantity : 0;

  if (item.batches) {
    item.batches.forEach(batch => {
      batchedQuantity += batch.quantity;
      numOfBatched += 1;
      if (batch.batchAdjustments) {
        batch.batchAdjustments.forEach(batchAdjustment => {
          batchedQuantity += batchAdjustment.quantity;
        });
      }
      if (batch.shipment) {
        shippedQuantity += batch.quantity;
        numOfShipped += 1;
      }
    });
  }

  return {
    orderedQuantity,
    batchedQuantity,
    shippedQuantity,
    numOfBatched,
    numOfShipped,
  };
}

const defaultProps = {
  onClick: () => {},
  onSelect: () => {},
  onRemove: () => {},
  onClone: () => {},
  selectable: false,
};

const OrderItemCard = ({
  item,
  onClick,
  onRemove,
  onClone,
  saveOnBlur,
  selectable,
  currency,
  ...rest
}: Props) => {
  if (!item) return '';

  const actions = selectable
    ? []
    : [
        <CardAction icon="CLONE" onClick={() => onClone(item)} />,
        <CardAction icon="REMOVE" hoverColor="RED" onClick={() => onRemove(item)} />,
      ];

  const chartDetail = getQuantitySummary(item);
  const {
    productProvider: { product, supplier, unitPrice },
  } = item;

  const { name, serial, tags = [] } = product;

  return (
    <ObjectValue
      defaultValue={{
        quantity: item.quantity,
        price: item.price,
      }}
    >
      {({ value: { quantity, price }, assign, set }) => (
        <BaseCard
          icon="ORDER_ITEM"
          color="ORDER_ITEM"
          selectable={selectable}
          actions={actions}
          {...rest}
        >
          <div
            className={OrderItemCardWrapperStyle}
            onClick={!selectable ? onClick : () => {}}
            role="presentation"
          >
            <div className={ProductWrapperStyle}>
              <img className={ProductImageStyle} src={FALLBACK_IMAGE} alt="product_image" />

              <div className={ProductInfoWrapperStyle}>
                <div className={ProductNameStyle}>{name}</div>
                <div className={ProductSerialStyle}>{serial}</div>
                <div className={ProductSupplierStyle}>
                  <Icon icon="SUPPLIER" />
                  {supplier && supplier.name}
                </div>
                <div className={ProductTagsWrapperStyle}>
                  {tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
                </div>
              </div>

              <button className={ProductIconLinkStyle} type="button">
                <Icon icon="PRODUCT" />
              </button>
            </div>

            <div className={BodyWrapperStyle}>
              <div
                className={QuantityWrapperStyle}
                onClick={!selectable ? evt => evt.stopPropagation() : () => {}}
                role="presentation"
              >
                {selectable ? (
                  <FieldItem
                    label={<Label required>QTY</Label>}
                    input={
                      <Display>
                        <FormattedNumber value={quantity} />
                      </Display>
                    }
                  />
                ) : (
                  <FormField
                    name={`${item.id}.quantity`}
                    initValue={quantity}
                    setFieldValue={(fieldName, newValue) => set('quantity', newValue)}
                  >
                    {({ name: fieldName, ...inputHandlers }) =>
                      numberInputFactory({
                        label: 'QTY',
                        required: true,
                        width: '90px',
                        height: '20px',
                        inputHandlers: {
                          ...inputHandlers,
                          onBlur: evt => {
                            inputHandlers.onBlur(evt);
                            saveOnBlur({ quantity: inputHandlers.value, price });
                          },
                        },
                        name: fieldName,
                        isNew: false,
                        originalValue: quantity,
                      })
                    }
                  </FormField>
                )}
              </div>

              <div
                className={UnitPriceWrapperStyle}
                role="presentation"
                onClick={!selectable ? evt => evt.stopPropagation() : () => {}}
              >
                {selectable ? (
                  <FieldItem
                    label={<Label required>PRICE</Label>}
                    input={
                      <Display>
                        <FormattedNumber value={price.amount} /> {currency || price.currency}
                      </Display>
                    }
                  />
                ) : (
                  <FormField
                    name={`${item.id}.price`}
                    initValue={price.amount}
                    setFieldValue={(fieldName, amount) => assign({ price: { amount, currency } })}
                  >
                    {({ name: fieldName, ...inputHandlers }) =>
                      priceInputFactory({
                        label: 'PRICE',
                        required: true,
                        currency,
                        width: '90px',
                        height: '20px',
                        inputHandlers: {
                          ...inputHandlers,
                          onBlur: evt => {
                            inputHandlers.onBlur(evt);
                            saveOnBlur({
                              quantity,
                              price: {
                                amount: inputHandlers.value,
                                currency,
                              },
                            });
                          },
                        },
                        name: fieldName,
                        isNew: false,
                        originalValue: price.amount,
                      })
                    }
                  </FormField>
                )}

                {!selectable && (
                  <BooleanValue>
                    {({ value: isOpen, set: dialogToggle }) => (
                      <>
                        <ConfirmDialog
                          isOpen={isOpen}
                          onRequestClose={() => dialogToggle(false)}
                          onCancel={() => dialogToggle(false)}
                          onConfirm={() => {
                            assign({ price: { currency, amount: unitPrice.amount } });
                            saveOnBlur({ quantity, price: { currency, amount: unitPrice.amount } });
                            dialogToggle(false);
                          }}
                          message="Currency is not matched. Do you want to sync?"
                          width={400}
                        />
                        <button
                          className={SyncButtonStyle}
                          type="button"
                          onClick={() => {
                            if (unitPrice.currency === currency) {
                              assign({ price: { currency, amount: unitPrice.amount } });
                              saveOnBlur({
                                quantity,
                                price: { currency, amount: unitPrice.amount },
                              });
                            } else {
                              dialogToggle(true);
                            }
                          }}
                        >
                          SYNC
                          <Icon icon="SYNC" />
                        </button>
                      </>
                    )}
                  </BooleanValue>
                )}
              </div>
              <div className={DividerStyle} />
              <div className={ChartWrapperStyle}>
                <QuantityChart
                  hasLabel={false}
                  orderedQuantity={chartDetail.orderedQuantity}
                  batchedQuantity={chartDetail.batchedQuantity}
                  shippedQuantity={chartDetail.shippedQuantity}
                  batched={chartDetail.numOfBatched}
                  shipped={chartDetail.numOfShipped}
                />
              </div>
              <div className={TotalPriceWrapperStyle}>
                <FieldItem
                  label={<Label>TOTAL</Label>}
                  input={
                    <Display>
                      <FormattedNumber value={price.amount * quantity} />{' '}
                      {currency || price.currency}
                    </Display>
                  }
                />
              </div>
            </div>
          </div>
        </BaseCard>
      )}
    </ObjectValue>
  );
};

OrderItemCard.defaultProps = defaultProps;

export default OrderItemCard;
