// @flow
import React from 'react';
import { type OrderItem } from 'modules/order/type.js.flow';
import logger from 'utils/logger';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import FormattedDate from 'components/FormattedDate';
import { DefaultStyle, Label, Display, TextInput, DateInput, NumberInput } from 'components/Form';
import BaseCard, { CardAction } from '../BaseCard';
import {
  OrderBatchCardWrapperStyle,
  BatchNoWrapperStyle,
  QuantityWrapperStyle,
  DeliveryDateWrapperStyle,
  DividerStyle,
  TotalPriceWrapperStyle,
  VolumeWrapperStyle,
  ShipmentWrapperStyle,
  ShipmentIconStyle,
  WarehouseArrivalWrapperStyle,
  WarehouseArrivalIconStyle,
  BatchTagsWrapperStyle,
} from './style';

type Props = {
  batch: ?OrderItem,
  onClick?: (id: string) => void,
};

const OrderBatchCard = ({ batch, onClick, ...rest }: Props) => {
  if (!batch) return '';

  const actions = [
    <CardAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <CardAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  const isNew = false;
  const currency = 'JPY';
  const dummyTag = {
    id: '1',
    name: 'Fruit',
    color: '#7b6dbb',
    description: '',
  };
  const dummyNo = {
    isActive: false,
    hasError: false,
    input: {
      name: 'foo',
      value: 'BATCH NO 001',
    },
  };
  const dummyQuantity = {
    isActive: false,
    hasError: false,
    input: {
      name: 'foo',
      value: 100,
    },
  };
  const dummyDate = {
    isActive: false,
    hasError: false,
    input: {
      name: 'foo',
      value: '2018-01-01',
    },
  };

  const dummyShipment = {
    id: '1',
    blNo: 'FHAG69385',
    warehouseArrival: {
      date: '2018-01-01',
      approved: true,
    },
  };

  const hasShipment = !!dummyShipment;
  const warehouseArrivalApproved = dummyShipment.warehouseArrival.approved;

  return (
    <BaseCard icon="BATCH" color="BATCH" actions={actions} {...rest}>
      <div className={OrderBatchCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={BatchNoWrapperStyle}>
          <DefaultStyle
            isFocused={dummyNo.isActive}
            hasError={dummyNo.hasError}
            forceHoverStyle={isNew}
            width="165px"
            height="20px"
            pureInputOptions={{
              ...dummyNo.input,
              align: 'left',
            }}
          >
            <TextInput align="left" {...dummyNo.input} />
          </DefaultStyle>
        </div>

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

        <div className={DeliveryDateWrapperStyle}>
          <Label>DELIVERY</Label>
          <DefaultStyle
            type="date"
            isFocused={dummyDate.isActive}
            hasError={dummyDate.hasError}
            forceHoverStyle={isNew}
            width="90px"
            height="20px"
          >
            <DateInput {...dummyDate.input} />
          </DefaultStyle>
        </div>

        <div className={DividerStyle} />

        <div className={TotalPriceWrapperStyle}>
          <Label>TOTAL</Label>
          <Display>4,000 {currency}</Display>
        </div>

        <div className={VolumeWrapperStyle}>
          <Label>VOLUME</Label>
          <Display>25 m³</Display>
        </div>

        <div className={ShipmentWrapperStyle}>
          <button className={ShipmentIconStyle(hasShipment)} type="button">
            <Icon icon="SHIPMENT" />
          </button>
          <Display align="left">{dummyShipment.blNo}</Display>
        </div>

        <div className={WarehouseArrivalWrapperStyle}>
          <div className={WarehouseArrivalIconStyle(warehouseArrivalApproved)}>
            <Icon icon="WAREHOUSE" />
          </div>
          <Label>ARRIVAL</Label>
          <Display>
            <FormattedDate value={dummyShipment.warehouseArrival.date} />
          </Display>
        </div>

        <div className={BatchTagsWrapperStyle}>
          <Tag tag={dummyTag} />
        </div>
      </div>
    </BaseCard>
  );
};

export default OrderBatchCard;
