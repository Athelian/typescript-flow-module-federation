// @flow
import React from 'react';
import { type OrderItem } from 'modules/order/type.js.flow';
import logger from 'utils/logger';
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
};

const OrderItemCard = ({ item, onClick, ...rest }: Props) => {
  if (!item) return '';

  const actions = [
    <CardAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <CardAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  const isNew = false;
  const currency = 'JPY';
  const dummyProduct = {
    name: 'Apple',
    serial: 'FA-064893',
    supplier: 'Supplier B',
  };
  const dummyTag = {
    id: '1',
    name: 'Fruit',
    color: '#7b6dbb',
    description: '',
  };
  const dummyQuantity = {
    isActive: false,
    hasError: false,
    input: {
      name: 'foo',
      value: 100,
    },
  };
  const dummyPrice = {
    isActive: false,
    hasError: false,
    input: {
      name: 'foo',
      value: 40,
    },
  };

  return (
    <BaseCard icon="ORDER_ITEM" color="ORDER_ITEM" actions={actions} {...rest}>
      <div className={OrderItemCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={ProductWrapperStyle}>
          <img className={ProductImageStyle} src={FALLBACK_IMAGE} alt="product_image" />

          <div className={ProductInfoWrapperStyle}>
            <div className={ProductNameStyle}>{dummyProduct.name}</div>
            <div className={ProductSerialStyle}>{dummyProduct.serial}</div>
            <div className={ProductSupplierStyle}>
              <Icon icon="SUPPLIER" />
              {dummyProduct.supplier}
            </div>
            <div className={ProductTagsWrapperStyle}>
              <Tag tag={dummyTag} />
            </div>
          </div>

          <button className={ProductIconLinkStyle} type="button">
            <Icon icon="PRODUCT" />
          </button>
        </div>

        <div className={BodyWrapperStyle}>
          <div className={QuantityWrapperStyle}>
            <Label required>QTY</Label>
            <DefaultStyle
              type="number"
              isFocused={dummyQuantity.isActive}
              hasError={dummyQuantity.hasError}
              forceHoverStyle={isNew}
              width="90px"
              height="20px"
            >
              <NumberInput {...dummyQuantity.input} />
            </DefaultStyle>
          </div>
          <div className={UnitPriceWrapperStyle}>
            <button className={SyncButtonStyle} type="button">
              SYNC
              <Icon icon="SYNC" />
            </button>
            <Label required>PRICE</Label>
            <DefaultPriceStyle
              currency={currency}
              isFocused={dummyPrice.isActive}
              hasError={dummyPrice.hasError}
              forceHoverStyle={isNew}
              width="90px"
              height="20px"
            >
              <NumberInput {...dummyPrice.input} />
            </DefaultPriceStyle>
          </div>
          <div className={DividerStyle} />
          Chart Goes Here
          <div className={TotalPriceWrapperStyle}>
            <Label>TOTAL</Label>
            <Display>4,000 {currency}</Display>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default OrderItemCard;
