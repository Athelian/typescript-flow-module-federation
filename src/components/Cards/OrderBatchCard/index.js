// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { BooleanValue } from 'react-values';
import { encodeId } from 'utils/id';
import { FormField } from 'modules/form';
import { numberInputFactory, textInputFactory, dateInputFactory } from 'modules/form/helpers';
import RemoveDialog from 'components/Dialog/RemoveDialog';
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
  onClick: (batch: Object) => void,
};

type Props = OptionalProps & {
  batch: ?Object,
  currency: string,
  price: ?{
    amount: number,
    currency: string,
  },
  saveOnBlur: Function,
  onClone: (batch: Object) => void,
  onRemove: (batch: Object) => void,
};

const calculateVolume = (batch: Object, quantity: number) => {
  if (batch && batch.packageVolume && batch.packageVolume.value) {
    return (
      <>
        <FormattedNumber value={batch.packageVolume.value * quantity} />
        {batch.packageVolume.metric}
      </>
    );
  }

  if (batch && batch.packageSize && Object.keys(batch.packageSize).length) {
    const { width, height, length } = batch.packageSize || { width: {}, height: {}, length: {} };
    return `${width.value}${width.metric}x${height.value}${height.metric}x${length.value}${
      length.metric
    }`;
  }

  return <FormattedMessage id="components.cards.notApplicable" defaultMessage="N/A" />;
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
    <BooleanValue>
      {({ value: isOpen, set: dialogToggle }) => (
        <>
          <RemoveDialog
            isOpen={isOpen}
            onRequestClose={() => dialogToggle(false)}
            onCancel={() => dialogToggle(false)}
            onRemove={() => {
              onRemove(batch);
              dialogToggle(false);
            }}
            width={400}
            message={
              <div>
                <div>
                  <FormattedMessage
                    id="components.cards.deleteBatchItem"
                    defaultMessage="Are you sure you want to delete this Batch?"
                  />
                </div>
                <div>
                  <FormattedMessage
                    id="components.cards.deleteBatchItemShipment"
                    defaultMessage="It is being used in a Shipment"
                  />
                </div>
              </div>
            }
          />
          <CardAction
            icon="REMOVE"
            hoverColor="RED"
            onClick={() => {
              if (batch.shipment) {
                dialogToggle(true);
              } else {
                onRemove(batch);
              }
            }}
          />
        </>
      )}
    </BooleanValue>,
  ];

  const { shipment } = batch;
  const warehouseArrivalApproved = false;

  const totalAdjustment = batch.batchAdjustments
    ? batch.batchAdjustments.reduce((total, adjustment) => adjustment.quantity + total, 0)
    : 0;

  const { no, quantity, deliveredAt } = batch;
  return (
    <BaseCard icon="BATCH" color="BATCH" showActionsOnHover actions={actions} {...rest}>
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
                align: 'left',
              })
            }
          </FormField>
        </div>

        <div
          className={QuantityWrapperStyle}
          onClick={evt => evt.stopPropagation()}
          role="presentation"
        >
          <Label required>
            <FormattedMessage id="components.cards.qty" defaultMessage="QTY" />
          </Label>
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
          <Label>
            <FormattedMessage id="components.cards.delivery" defaultMessage="DELIVERY" />
          </Label>
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
          <Label>
            <FormattedMessage id="components.cards.total" defaultMessage="TOTAL" />
          </Label>
          <Display>
            <FormattedNumber
              value={(quantity + totalAdjustment) * (price && price.amount ? price.amount : 0)}
              suffix={currency}
            />
          </Display>
        </div>

        <div className={VolumeWrapperStyle}>
          <Label>
            <FormattedMessage id="components.cards.volume" defaultMessage="VOLUME" />
          </Label>
          <Display>{calculateVolume(batch, quantity + totalAdjustment)} </Display>
        </div>

        <div className={ShipmentWrapperStyle}>
          <Link
            className={ShipmentIconStyle(!!shipment)}
            to={shipment ? `/shipment/${encodeId(shipment.id)}` : '.'}
            onClick={evt => {
              evt.stopPropagation();
            }}
          >
            <Icon icon="SHIPMENT" />
          </Link>
          <Display align="left">{batch.shipment && batch.shipment.no}</Display>
        </div>

        <div className={WarehouseArrivalWrapperStyle}>
          <div className={WarehouseArrivalIconStyle(warehouseArrivalApproved)}>
            <Icon icon="WAREHOUSE" />
          </div>
          <Label>
            <FormattedMessage id="components.cards.arrival" defaultMessage="ARRIVAL" />
          </Label>
          <Display align="left">
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
