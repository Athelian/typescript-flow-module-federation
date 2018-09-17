// @flow
import React from 'react';
import { Subscribe } from 'unstated';
import { ObjectValue, BooleanValue } from 'react-values';
import { type OrderItem } from 'modules/order/type.js.flow';
import { FormContainer, FormField } from 'modules/form';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import QuantityChart from 'components/QuantityChart';
import FormattedNumber from 'components/FormattedNumber';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import { DefaultStyle, Label, Display, NumberInput, DefaultPriceStyle } from 'components/Form';
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
  let activeBatches = 0;
  let archivedBatches = 0;

  orderedQuantity += item.quantity ? item.quantity : 0;

  if (item.batches) {
    item.batches.forEach(batch => {
      batchedQuantity += batch.quantity;
      if (batch.batchAdjustments) {
        batch.batchAdjustments.forEach(batchAdjustment => {
          batchedQuantity -= batchAdjustment.quantity;
        });
      }
      if (batch.shipment) {
        shippedQuantity += batch.quantity;
      }
      if (batch.archived) {
        archivedBatches += 1;
      } else {
        activeBatches += 1;
      }
    });
  }

  return {
    orderedQuantity,
    batchedQuantity,
    shippedQuantity,
    activeBatches,
    archivedBatches,
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
      {({ value: { quantity, price }, set, assign }) => (
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
                <Label required>QTY</Label>
                {selectable ? (
                  <FormattedNumber value={quantity} />
                ) : (
                  <Subscribe to={[FormContainer]}>
                    {({ state: { activeField }, ...formHelper }) => (
                      <FormField name={`${item.id}.quantity`} initValue={quantity} {...formHelper}>
                        {inputHandlers => (
                          <DefaultStyle
                            type="number"
                            height="20px"
                            width="90px"
                            isFocused={activeField === inputHandlers.name}
                          >
                            <NumberInput
                              {...inputHandlers}
                              value={quantity}
                              onChange={evt => set('quantity', evt.target.value)}
                              onBlur={evt => {
                                inputHandlers.onBlur(evt);
                                saveOnBlur({ quantity, price });
                              }}
                            />
                          </DefaultStyle>
                        )}
                      </FormField>
                    )}
                  </Subscribe>
                )}
              </div>
              <div
                className={UnitPriceWrapperStyle}
                role="presentation"
                onClick={!selectable ? evt => evt.stopPropagation() : () => {}}
              >
                {!selectable && (
                  <BooleanValue>
                    {({ value: isOpen, toggle }) => (
                      <>
                        <ConfirmDialog
                          isOpen={isOpen}
                          onRequestClose={toggle}
                          onCancel={toggle}
                          onConfirm={() => {
                            assign({ price: { currency, amount: unitPrice.amount } });
                            saveOnBlur({ quantity, price: { currency, amount: unitPrice.amount } });
                            toggle();
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
                              toggle();
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
                <Label required>PRICE</Label>
                {selectable ? (
                  <>
                    <FormattedNumber value={price.amount} />
                    {price.currency}
                  </>
                ) : (
                  <Subscribe to={[FormContainer]}>
                    {({ state: { activeField }, ...formHelper }) => (
                      <FormField name={`${item.id}.price`} initValue={price.amount} {...formHelper}>
                        {inputHandlers => (
                          <DefaultPriceStyle
                            currency={currency || price.currency}
                            height="20px"
                            width="90px"
                            isFocused={activeField === inputHandlers.name}
                          >
                            <NumberInput
                              {...inputHandlers}
                              value={price.amount}
                              onChange={evt =>
                                assign({ price: { amount: evt.target.value, currency } })
                              }
                              onBlur={evt => {
                                inputHandlers.onBlur(evt);
                                saveOnBlur({ quantity, price });
                              }}
                            />
                          </DefaultPriceStyle>
                        )}
                      </FormField>
                    )}
                  </Subscribe>
                )}
              </div>
              <div className={DividerStyle} />
              <QuantityChart
                hasLabel={false}
                orderedQuantity={chartDetail.orderedQuantity}
                batchedQuantity={chartDetail.batchedQuantity}
                shippedQuantity={chartDetail.shippedQuantity}
                batched={chartDetail.batchedQuantity}
                shipped={chartDetail.shippedQuantity}
              />
              <div className={TotalPriceWrapperStyle}>
                <Label>TOTAL</Label>
                <Display>
                  <FormattedNumber value={price.amount * quantity} />
                  {currency}
                </Display>
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
