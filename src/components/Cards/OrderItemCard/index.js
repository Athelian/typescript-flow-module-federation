// @flow
import React from 'react';
import { type OrderItem } from 'modules/order/type.js.flow';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
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

type Props = {
  item: ?OrderItem,
  onClick?: (id: string) => void,
  onClone: Function,
  onRemove: Function,
};

const OrderItemCard = ({ item, onClick, onRemove, onClone, ...rest }: Props) => {
  if (!item) return '';

  const actions = [
    <CardAction icon="CLONE" onClick={onClone} />,
    <CardAction icon="REMOVE" hoverColor="RED" onClick={onRemove} />,
  ];

  const {
    productProvider: { product, supplier },
    price: { currency, amount },
  } = item;

  const { name, serial, tags = [] } = product;

  console.warn('tags', tags);
  return (
    <BaseCard icon="ORDER_ITEM" color="ORDER_ITEM" actions={actions} {...rest}>
      <div className={OrderItemCardWrapperStyle} onClick={onClick} role="presentation">
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
              {tags && tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
            </div>
          </div>

          <button className={ProductIconLinkStyle} type="button">
            <Icon icon="PRODUCT" />
          </button>
        </div>

        <div className={BodyWrapperStyle}>
          <div
            className={QuantityWrapperStyle}
            onClick={evt => evt.stopPropagation()}
            role="presentation"
          >
            <Label required>QTY</Label>
            <DefaultStyle type="number" width="90px" height="20px">
              <NumberInput />
            </DefaultStyle>
          </div>
          <div
            className={UnitPriceWrapperStyle}
            onClick={evt => evt.stopPropagation()}
            role="presentation"
          >
            <button className={SyncButtonStyle} type="button">
              SYNC
              <Icon icon="SYNC" />
            </button>
            <Label required>PRICE</Label>
            <DefaultPriceStyle currency={currency} width="90px" height="20px">
              <NumberInput value={amount} onChange={() => {}} />
            </DefaultPriceStyle>
          </div>
          <div className={DividerStyle} />
          Chart Goes Here
          <div className={TotalPriceWrapperStyle}>
            <Label>TOTAL</Label>
            <Display>
              {amount} {currency}
            </Display>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default OrderItemCard;
