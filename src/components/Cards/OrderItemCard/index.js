// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { ObjectValue, BooleanValue } from 'react-values';
import { FormField } from 'modules/form';
import { numberInputFactory, priceInputFactory } from 'modules/form/helpers';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import QuantityChart from 'components/QuantityChart';
import FormattedNumber from 'components/FormattedNumber';
import RemoveDialog from 'components/Dialog/RemoveDialog';
import { Label, Display, FieldItem } from 'components/Form';
import { getProductImage } from 'components/Cards/utils';
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
  onSelect: (item: Object) => void,
  onClone: (item: Object) => void,
  onRemove: (item: Object) => void,
  selectable: boolean,
  readOnly: boolean,
  viewPrice: boolean,
  viewTotalPrice: boolean,
};

type Props = OptionalProps & {
  item: ?Object,
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

      let currentQuantity = batch.quantity;

      if (batch.batchAdjustments) {
        batch.batchAdjustments.forEach(batchAdjustment => {
          batchedQuantity += batchAdjustment.quantity;
          currentQuantity += batchAdjustment.quantity;
        });
      }

      if (batch.shipment) {
        shippedQuantity += currentQuantity;
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
  readOnly: false,
  viewPrice: true,
};

const OrderItemCard = ({
  item,
  onClick,
  onRemove,
  onClone,
  saveOnBlur,
  selectable,
  readOnly,
  currency,
  viewPrice,
  ...rest
}: Props) => {
  if (!item) return '';

  const actions =
    selectable || readOnly
      ? []
      : [
          <CardAction icon="CLONE" onClick={() => onClone(item)} />,
          <BooleanValue>
            {({ value: isOpen, set: dialogToggle }) =>
              item.batches && item.batches.length ? (
                <>
                  <RemoveDialog
                    isOpen={isOpen}
                    onRequestClose={() => dialogToggle(false)}
                    onCancel={() => dialogToggle(false)}
                    onRemove={() => {
                      onRemove(item);
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
                <CardAction
                  icon="REMOVE"
                  hoverColor="RED"
                  onClick={() => {
                    onRemove(item);
                  }}
                />
              )
            }
          </BooleanValue>,
        ];

  const chartDetail = getQuantitySummary(item);
  const {
    productProvider: { product, supplier, unitPrice },
  } = item;

  const productImage = getProductImage(product);

  return readOnly ? (
    <BaseCard
      icon="ORDER_ITEM"
      color="ORDER_ITEM"
      selectable={selectable}
      showActionsOnHover
      actions={actions}
      readOnly={readOnly}
      {...rest}
    >
      <div
        className={OrderItemCardWrapperStyle}
        onClick={!selectable ? onClick : () => {}}
        role="presentation"
      >
        <div className={ProductWrapperStyle}>
          <img className={ProductImageStyle} src={productImage} alt="product_image" />

          <div className={ProductInfoWrapperStyle}>
            <div className={ProductNameStyle}>{product.name}</div>
            <div className={ProductSerialStyle}>{product.serial}</div>
            <div className={ProductSupplierStyle}>
              <Icon icon="SUPPLIER" />
              {supplier && supplier.name}
            </div>
            <div className={ProductTagsWrapperStyle}>
              {product.tags &&
                product.tags.length > 0 &&
                product.tags.map(tag => <Tag key={tag.id} tag={tag} />)}
            </div>
          </div>

          <button className={ProductIconLinkStyle} type="button">
            <Icon icon="PRODUCT" />
          </button>
          <Link
            className={ProductIconLinkStyle}
            to={`/product/${encodeId(product.id)}`}
            onClick={evt => {
              evt.stopPropagation();
            }}
          >
            <Icon icon="PRODUCT" />
          </Link>
        </div>

        <div className={BodyWrapperStyle}>
          <div
            className={QuantityWrapperStyle}
            onClick={!selectable ? evt => evt.stopPropagation() : () => {}}
            role="presentation"
          >
            <FieldItem
              label={
                <Label required>
                  <FormattedMessage id="components.cards.qty" defaultMessage="QTY" />
                </Label>
              }
              input={
                <Display>
                  <FormattedNumber value={item.quantity} />
                </Display>
              }
            />
          </div>

          <div
            className={UnitPriceWrapperStyle}
            role="presentation"
            onClick={!selectable ? evt => evt.stopPropagation() : () => {}}
          >
            <FieldItem
              label={
                <Label required>
                  <FormattedMessage id="components.cards.price" defaultMessage="PRICE" />
                </Label>
              }
              input={
                <Display blackout={!viewPrice}>
                  <FormattedNumber value={item.price.amount} />{' '}
                  {item.currency || item.price.currency}
                </Display>
              }
            />
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
              label={
                <Label>
                  <FormattedMessage id="components.cards.total" defaultMessage="TOTAL" />
                </Label>
              }
              input={
                <Display blackout={!viewPrice}>
                  <FormattedNumber
                    value={item.price.amount * item.quantity}
                    suffix={item.currency || item.price.currency}
                  />
                </Display>
              }
            />
          </div>
        </div>
      </div>
    </BaseCard>
  ) : (
    <ObjectValue
      value={{
        quantity: item.quantity,
        price: item.price,
      }}
    >
      {({ value: { quantity, price }, assign, set }) => (
        <BaseCard
          icon="ORDER_ITEM"
          color="ORDER_ITEM"
          selectable={selectable}
          showActionsOnHover
          actions={actions}
          {...rest}
        >
          <div
            className={OrderItemCardWrapperStyle}
            onClick={!selectable ? onClick : () => {}}
            role="presentation"
          >
            <div className={ProductWrapperStyle}>
              <img className={ProductImageStyle} src={productImage} alt="product_image" />

              <div className={ProductInfoWrapperStyle}>
                <div className={ProductNameStyle}>{product.name}</div>
                <div className={ProductSerialStyle}>{product.serial}</div>
                <div className={ProductSupplierStyle}>
                  <Icon icon="SUPPLIER" />
                  {supplier && supplier.name}
                </div>
                <div className={ProductTagsWrapperStyle}>
                  {product.tags &&
                    product.tags.length > 0 &&
                    product.tags.map(tag => <Tag key={tag.id} tag={tag} />)}
                </div>
              </div>

              <button className={ProductIconLinkStyle} type="button">
                <Icon icon="PRODUCT" />
              </button>
              <Link
                className={ProductIconLinkStyle}
                to={`/product/${encodeId(product.id)}`}
                onClick={evt => {
                  evt.stopPropagation();
                }}
              >
                <Icon icon="PRODUCT" />
              </Link>
            </div>

            <div className={BodyWrapperStyle}>
              <div
                className={QuantityWrapperStyle}
                onClick={!selectable ? evt => evt.stopPropagation() : () => {}}
                role="presentation"
              >
                {selectable || readOnly ? (
                  <FieldItem
                    label={
                      <Label required>
                        <FormattedMessage id="components.cards.qty" defaultMessage="QTY" />
                      </Label>
                    }
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
                        label: <FormattedMessage id="components.cards.qty" defaultMessage="QTY" />,
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
                {selectable || readOnly ? (
                  <FieldItem
                    label={
                      <Label required>
                        <FormattedMessage id="components.cards.price" defaultMessage="PRICE" />
                      </Label>
                    }
                    input={
                      <Display>
                        <FormattedNumber value={price.amount} /> {currency || price.currency}
                      </Display>
                    }
                  />
                ) : (
                  <FormField
                    name={`${item.id}.price`}
                    initValue={{ ...price, currency }}
                    setFieldValue={(fieldName, amount) => assign({ price: { amount, currency } })}
                  >
                    {({ name: fieldName, ...inputHandlers }) =>
                      priceInputFactory({
                        label: (
                          <FormattedMessage id="components.cards.price" defaultMessage="PRICE" />
                        ),
                        required: true,
                        width: '90px',
                        height: '20px',
                        inputHandlers: {
                          ...inputHandlers,
                          onBlur: evt => {
                            inputHandlers.onBlur(evt);
                            saveOnBlur({
                              quantity,
                              price: inputHandlers.value,
                            });
                          },
                        },
                        name: fieldName,
                        isNew: false,
                        originalValue: { ...price, currency },
                      })
                    }
                  </FormField>
                )}

                {!selectable && !readOnly && !!unitPrice && (
                  <button
                    className={SyncButtonStyle}
                    type="button"
                    onClick={() => {
                      if (unitPrice) {
                        if (unitPrice.currency === currency) {
                          assign({ price: { currency, amount: unitPrice.amount } });
                          saveOnBlur({
                            quantity,
                            price: { currency, amount: unitPrice.amount },
                          });
                        }
                      }
                    }}
                  >
                    <FormattedMessage id="components.cards.sync" defaultMessage="SYNC" />
                    <Icon icon="SYNC" />
                  </button>
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
                  label={
                    <Label>
                      <FormattedMessage id="components.cards.total" defaultMessage="TOTAL" />
                    </Label>
                  }
                  input={
                    <Display width="90px">
                      <FormattedNumber
                        value={price.amount * quantity}
                        suffix={currency || price.currency}
                      />
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
