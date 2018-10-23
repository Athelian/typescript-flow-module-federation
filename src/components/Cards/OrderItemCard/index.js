// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { ObjectValue, BooleanValue } from 'react-values';
import { FormField } from 'modules/form';
import { numberInputFactory, priceInputFactory } from 'modules/form/helpers';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import QuantityChart from 'components/QuantityChart';
import GridColumn from 'components/GridColumn';
import FormattedNumber from 'components/FormattedNumber';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import RemoveDialog from 'components/Dialog/RemoveDialog';
import { Label, Display, FieldItem } from 'components/Form';
import { spanWithColor } from 'utils/color';
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
  readOnly: false,
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
                    width={400}
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

  const productImage =
    product.files && product.files.length > 0 ? product.files[0].path : FALLBACK_IMAGE;

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
                    initValue={price.amount}
                    setFieldValue={(fieldName, amount) => assign({ price: { amount, currency } })}
                  >
                    {({ name: fieldName, ...inputHandlers }) =>
                      priceInputFactory({
                        label: (
                          <FormattedMessage id="components.cards.price" defaultMessage="PRICE" />
                        ),
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

                {!selectable &&
                  !readOnly &&
                  !!unitPrice && (
                    <BooleanValue>
                      {({ value: isOpen, set: dialogToggle }) => (
                        <>
                          <ConfirmDialog
                            isOpen={isOpen}
                            onRequestClose={() => dialogToggle(false)}
                            onCancel={() => dialogToggle(false)}
                            onConfirm={() => {
                              assign({ price: { currency, amount: unitPrice.amount } });
                              saveOnBlur({
                                quantity,
                                price: { currency, amount: unitPrice.amount },
                              });
                              dialogToggle(false);
                            }}
                            message={
                              <GridColumn>
                                <div>
                                  <FormattedMessage
                                    id="components.cards.endProductUnitPrice"
                                    defaultMessage="The unit price of {product} is {unitPrice}"
                                    values={{
                                      product: spanWithColor(product.name, 'PRODUCT'),
                                      unitPrice: spanWithColor(
                                        <FormattedNumber
                                          value={unitPrice.amount}
                                          suffix={unitPrice.currency}
                                        />,
                                        'TEAL'
                                      ),
                                    }}
                                  />
                                </div>
                                <div>
                                  <FormattedMessage
                                    id="components.cards.wantSync"
                                    defaultMessage="Currency is not matched. Do you want to sync?"
                                  />
                                </div>
                              </GridColumn>
                            }
                            width={400}
                          />
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
                                } else {
                                  dialogToggle(true);
                                }
                              }
                            }}
                          >
                            <FormattedMessage id="components.cards.sync" defaultMessage="SYNC" />
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
                  label={
                    <Label>
                      <FormattedMessage id="components.cards.total" defaultMessage="TOTAL" />
                    </Label>
                  }
                  input={
                    <Display>
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
