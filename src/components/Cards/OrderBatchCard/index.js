// @flow
import React from 'react';
import { FormField } from 'modules/form';
import type { BatchQuery as BatchItem } from 'modules/batch/type.js.flow';
import { numberInputFactory, textInputFactory, dateInputFactory } from 'modules/form/helpers';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import { Label, Display } from 'components/Form';
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

type OptionalProps = {
  onClick: (batch: BatchItem) => void,
};

type Props = OptionalProps & {
  batch: ?BatchItem,
  currency: string,
  price: ?{
    amount: number,
    currency: string,
  },
  saveOnBlur: Function,
  onClone: (batch: BatchItem) => void,
  onRemove: (batch: BatchItem) => void,
};

const calculateVolume = (batch: BatchItem, quantity: number) => {
  if (batch && batch.packageVolume && batch.packageVolume.value) {
    return (
      <>
        <FormattedNumber value={batch.packageVolume.value * quantity} />
        {batch.packageVolume.metric}
      </>
    );
  }

  if (batch && batch.packageSize && batch.packageSize.width) {
    return 'Not implemented yet';
  }

  return 'N/A';
};

const defaultProps = {
  onClick: () => {},
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
    <CardAction icon="CLONE" onClick={() => onClone(batch)} />,
    <CardAction icon="REMOVE" hoverColor="RED" onClick={() => onRemove(batch)} />,
  ];

  const hasShipment = !!batch.shipment;
  const warehouseArrivalApproved = false;

  const totalAdjustment = batch.batchAdjustments
    ? batch.batchAdjustments.reduce((total, adjustment) => adjustment.quantity + total, 0)
    : 0;

  const { no, quantity, deliveredAt } = batch;
  return (
    <BaseCard icon="BATCH" color="BATCH" actions={actions} {...rest}>
      <div
        className={OrderBatchCardWrapperStyle}
        onClick={() => onClick({ ...batch, no, quantity, deliveredAt })}
        role="presentation"
      >
        <div
          className={BatchNoWrapperStyle}
          onClick={evt => evt.stopPropagation()}
          role="presentation"
        >
          <FormField name={`batch.${batch.id}.no`} initValue={no}>
            {({ name: fieldName, ...inputHandlers }) =>
              textInputFactory({
                width: '165px',
                height: '20px',
                inputHandlers: {
                  ...inputHandlers,
                  onBlur: evt => {
                    inputHandlers.onBlur(evt);
                    saveOnBlur({ ...batch, no: inputHandlers.value });
                  },
                },
                name: fieldName,
                isNew: false,
                originalValue: no,
              })
            }
          </FormField>
        </div>

        <div
          className={QuantityWrapperStyle}
          onClick={evt => evt.stopPropagation()}
          role="presentation"
        >
          <Label required>QTY</Label>
          <FormField name={`batch.${batch.id}.quantity`} initValue={quantity + totalAdjustment}>
            {({ name: fieldName, ...inputHandlers }) =>
              numberInputFactory({
                width: '90px',
                height: '20px',
                inputHandlers: {
                  ...inputHandlers,
                  onBlur: evt => {
                    inputHandlers.onBlur(evt);
                    saveOnBlur({
                      ...batch,
                      quantity: inputHandlers.value - totalAdjustment,
                    });
                  },
                },
                name: fieldName,
                isNew: false,
                originalValue: quantity + totalAdjustment,
              })
            }
          </FormField>
        </div>

        <div
          className={DeliveryDateWrapperStyle}
          onClick={evt => evt.stopPropagation()}
          role="presentation"
        >
          <Label>DELIVERY</Label>
          <FormField name={`batch.${batch.id}.deliveredAt`} initValue={deliveredAt}>
            {({ name, ...inputHandlers }) =>
              dateInputFactory({
                width: '90px',
                height: '20px',
                name,
                isNew: false,
                originalValue: deliveredAt,
                inputHandlers: {
                  ...inputHandlers,
                  onBlur: evt => {
                    inputHandlers.onBlur(evt);
                    saveOnBlur({
                      ...batch,
                      deliveredAt: inputHandlers.value ? new Date(inputHandlers.value) : null,
                    });
                  },
                },
              })
            }
          </FormField>
        </div>

        <div className={DividerStyle} />

        <div className={TotalPriceWrapperStyle}>
          <Label>TOTAL</Label>
          <Display>
            <FormattedNumber
              value={(quantity + totalAdjustment) * (price && price.amount ? price.amount : 0)}
            />
            {currency}
          </Display>
        </div>

        <div className={VolumeWrapperStyle}>
          <Label>VOLUME</Label>
          <Display>{calculateVolume(batch, quantity + totalAdjustment)} </Display>
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
  );
};

OrderBatchCard.defaultProps = defaultProps;

export default OrderBatchCard;
