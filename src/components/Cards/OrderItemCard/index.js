// @flow
import React from 'react';
import { type OrderItem } from 'modules/order/type.js.flow';
import logger from 'utils/logger';
import { Label, Display, StyledNumberInput } from 'components/Form';
import BaseCard, { CardAction } from '../BaseCard';
import { OrderItemCardWrapperStyle, QuantityWrapperStyle, TotalPriceWrapperStyle } from './style';

type Props = {
  item: ?OrderItem,
  onClick?: (id: string) => void,
};

const OrderItemCard = ({ item, onClick, ...rest }: Props) => {
  if (!item) return '';

  const { id } = item;

  const actions = [
    <CardAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <CardAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  const dummyStuff = {
    isNew: false,
    isActive: false,
    hasError: false,
    input: {
      name: 'foo',
      value: 100,
    },
  };

  return (
    <BaseCard icon="ORDER_ITEM" color="ORDER_ITEM" actions={actions} {...rest}>
      <div className={OrderItemCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={QuantityWrapperStyle}>
          <Label>QUANTITY</Label>
          <StyledNumberInput
            isFocused={dummyStuff.isActive}
            forceHoverStyle={dummyStuff.isNew}
            hasError={dummyStuff.hasError}
            width="95px"
            height="20px"
            pureInputOptions={{
              ...dummyStuff.input,
            }}
          />
        </div>
        <div className={TotalPriceWrapperStyle}>
          <Label>PRICE</Label>
          <Display>JPY 4,000</Display>
        </div>
        {id}
      </div>
    </BaseCard>
  );
};

export default OrderItemCard;
