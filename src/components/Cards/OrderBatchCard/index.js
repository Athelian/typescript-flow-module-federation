// @flow
import React from 'react';
import type { BatchQuery as BatchItem } from 'modules/batch/type.js.flow';
import { ObjectValue } from 'react-values';
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
  batch: ?BatchItem,
  onClick?: (id: string) => void,
  currency: string,
  price: number,
  saveOnBlur: Function,
  onClone: Function,
  onRemove: Function,
};

const OrderBatchCard = ({
  batch,
  onClick,
  onRemove,
  onClone,
  saveOnBlur,
  currency,
  price,
  ...rest
}: Props) => {
  if (!batch) return '';

  const actions = [
    <CardAction icon="CLONE" onClick={onClone} />,
    <CardAction icon="REMOVE" hoverColor="RED" onClick={onRemove} />,
  ];

  const hasShipment = !!batch.shipment;
  const warehouseArrivalApproved = false;

  return (
    <ObjectValue defaultValue={batch}>
      {({ value: { no, quantity, deliveredAt }, set }) => (
        <BaseCard icon="BATCH" color="BATCH" actions={actions} {...rest}>
          <div className={OrderBatchCardWrapperStyle} onClick={onClick} role="presentation">
            <div className={BatchNoWrapperStyle}>
              <DefaultStyle width="165px" height="20px">
                <TextInput
                  align="left"
                  value={no}
                  onChange={evt => set('no', evt.target.value)}
                  onBlur={() => saveOnBlur({ ...batch, no })}
                />
              </DefaultStyle>
            </div>

            <div className={QuantityWrapperStyle}>
              <Label required>QTY</Label>
              <DefaultStyle type="number" width="90px" height="20px">
                <NumberInput
                  value={quantity}
                  onChange={evt => set('quantity', evt.target.value)}
                  onBlur={() => saveOnBlur({ ...batch, quantity })}
                />
              </DefaultStyle>
            </div>

            <div className={DeliveryDateWrapperStyle}>
              <Label>DELIVERY</Label>
              <DefaultStyle type="date" width="90px" height="20px">
                <DateInput
                  value={deliveredAt}
                  onChange={evt => set('deliveredAt', evt.target.value)}
                  onBlur={() => saveOnBlur({ ...batch, deliveredAt })}
                />
              </DefaultStyle>
            </div>

            <div className={DividerStyle} />

            <div className={TotalPriceWrapperStyle}>
              <Label>PRICE</Label>
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
              <Display align="left">{batch.shipment && batch.shipment.blNo}</Display>
            </div>

            <div className={WarehouseArrivalWrapperStyle}>
              <div className={WarehouseArrivalIconStyle(warehouseArrivalApproved)}>
                <Icon icon="WAREHOUSE" />
              </div>
              <Label>ARRIVAL</Label>
              <Display>
                <FormattedDate
                  value={
                    batch &&
                    batch.shipment &&
                    batch.shipment.containerGroups &&
                    batch.shipment.containerGroups[0] &&
                    batch.shipment.containerGroups[0].warehouseArrival.date
                  }
                />
              </Display>
            </div>

            <div className={BatchTagsWrapperStyle}>
              {batch.tags.length > 0 && batch.tags.map(tag => <Tag key={tag.id} tag={tag} />)}
            </div>
          </div>
        </BaseCard>
      )}
    </ObjectValue>
  );
};

export default OrderBatchCard;
