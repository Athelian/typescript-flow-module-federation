// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { BooleanValue } from 'react-values';
import { encodeId } from 'utils/id';
import { calculatePackageQuantity } from 'utils/batch';
import { Label, Display, FieldItem } from 'components/Form';
import { FormField } from 'modules/form';
import { numberInputFactory, textInputFactory, dateInputFactory } from 'modules/form/helpers';
import RemoveDialog from 'components/Dialog/RemoveDialog';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import TasksNumber from 'components/TasksNumber';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import { totalAdjustQuantity } from 'components/Cards/utils';
import withForbiddenCard from 'hoc/withForbiddenCard';
import validator from './validator';
import BaseCard, { CardAction } from '../BaseCard';
import {
  OrderBatchCardWrapperStyle,
  BatchNoWrapperStyle,
  QuantityWrapperStyle,
  DateInputWrapperStyle,
  DividerStyle,
  TotalPriceWrapperStyle,
  VolumeWrapperStyle,
  ShipmentWrapperStyle,
  ShipmentIconStyle,
  WarehouseArrivalWrapperStyle,
  WarehouseArrivalIconStyle,
  TagsAndTaskWrapperStyle,
  BatchTagsWrapperStyle,
} from './style';

type OptionalProps = {
  onClick: (batch: Object) => void,
  readOnly: boolean,
};

type Props = OptionalProps & {
  batch: Object,
  currency: string,
  price: ?{
    amount: number,
    currency: string,
  },
  saveOnBlur: Function,
  onClone: (batch: Object) => void,
  onRemove: (batch: Object) => void,
};

const defaultProps = {
  onClick: () => {},
  readOnly: false,
};

const OrderBatchCard = ({
  batch,
  onClick,
  onRemove,
  onClone,
  saveOnBlur,
  currency,
  price,
  readOnly,
  ...rest
}: Props) => {
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

  const {
    no,
    quantity,
    deliveredAt,
    desiredAt,
    packageVolume,
    packageQuantity,
    batchAdjustments,
    shipment,
    autoCalculatePackageQuantity,
    todo,
  } = batch;

  const warehouseArrivalApproved = !!(
    batch &&
    batch.shipment &&
    batch.shipment.containerGroups &&
    batch.shipment.containerGroups[0] &&
    batch.shipment.containerGroups[0].warehouseArrival.date
  );

  const totalAdjustment = totalAdjustQuantity(batchAdjustments);

  const validation = validator({
    no: `batch.${batch.id}.no`,
    quantity: `batch.${batch.id}.quantity`,
  });

  const values = {
    [`batch.${batch.id}.no`]: no,
    [`batch.${batch.id}.quantity`]: quantity + totalAdjustment,
  };

  return readOnly ? (
    <BaseCard icon="BATCH" color="BATCH" {...rest}>
      <div
        className={OrderBatchCardWrapperStyle}
        onClick={() => onClick(batch)}
        role="presentation"
      >
        <div className={BatchNoWrapperStyle}>
          <FieldItem input={<Display align="left">{no}</Display>} />
        </div>

        <div className={QuantityWrapperStyle}>
          <Label required>
            <FormattedMessage id="components.cards.qty" defaultMessage="QTY" />
          </Label>
          <Display>
            <FormattedNumber value={quantity + totalAdjustment} />
          </Display>
        </div>

        <div className={DateInputWrapperStyle}>
          <Label>
            <FormattedMessage id="components.cards.delivery" defaultMessage="DELIVERY" />
          </Label>
          <Display>
            <FormattedDate value={deliveredAt} />
          </Display>
        </div>

        <div className={DateInputWrapperStyle}>
          <Label>
            <FormattedMessage id="components.cards.desired" defaultMessage="DESIRED" />
          </Label>
          <Display>
            <FormattedDate value={desiredAt} />
          </Display>
        </div>

        <div className={DividerStyle} />

        <div className={TotalPriceWrapperStyle}>
          <Label>
            <FormattedMessage id="components.cards.total" defaultMessage="TTL PRICE" />
          </Label>
          <Display>
            <FormattedNumber
              value={(price && price.amount ? price.amount : 0) * (quantity + totalAdjustment)}
              suffix={currency}
            />
          </Display>
        </div>

        <div className={VolumeWrapperStyle}>
          <Label>
            <FormattedMessage id="components.cards.volume" defaultMessage="TTL VOL" />
          </Label>
          <Display>
            {packageVolume && packageQuantity != null && (
              <FormattedNumber
                value={packageVolume.value * packageQuantity}
                suffix={packageVolume.metric}
              />
            )}
          </Display>
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

        <div className={TagsAndTaskWrapperStyle}>
          <div className={BatchTagsWrapperStyle}>
            {batch.tags.length > 0 && batch.tags.map(tag => <Tag key={tag.id} tag={tag} />)}
          </div>
          <TasksNumber {...todo} />
        </div>
      </div>
    </BaseCard>
  ) : (
    <BaseCard icon="BATCH" color="BATCH" showActionsOnHover actions={actions} {...rest}>
      <div
        className={OrderBatchCardWrapperStyle}
        onClick={() => onClick({ ...batch, no, quantity, deliveredAt, desiredAt })}
        role="presentation"
      >
        <div
          className={BatchNoWrapperStyle}
          onClick={evt => evt.stopPropagation()}
          role="presentation"
        >
          <FormField
            name={`batch.${batch.id}.no`}
            initValue={no}
            validator={validation}
            values={values}
          >
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
          <FormField
            name={`batch.${batch.id}.quantity`}
            initValue={quantity + totalAdjustment}
            validator={validation}
            values={values}
          >
            {({ name: fieldName, ...inputHandlers }) =>
              numberInputFactory({
                width: '90px',
                height: '20px',
                inputHandlers: {
                  ...inputHandlers,
                  onBlur: evt => {
                    inputHandlers.onBlur(evt);
                    const baseQuantity = Number(inputHandlers.value) - Number(totalAdjustment);
                    saveOnBlur({
                      ...batch,
                      quantity: baseQuantity,
                      ...(autoCalculatePackageQuantity
                        ? {
                            packageQuantity: calculatePackageQuantity({
                              ...batch,
                              quantity: baseQuantity,
                            }),
                          }
                        : {}),
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
          className={DateInputWrapperStyle}
          onClick={evt => evt.stopPropagation()}
          role="presentation"
        >
          <Label>
            <FormattedMessage id="components.cards.delivery" defaultMessage="DELIVERY" />
          </Label>
          <FormField name={`batch.${batch.id}.deliveredAt`} initValue={deliveredAt}>
            {({ name, ...inputHandlers }) =>
              dateInputFactory({
                width: '120px',
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
                      deliveredAt: inputHandlers.value ? inputHandlers.value : null,
                    });
                  },
                },
              })
            }
          </FormField>
        </div>

        <div
          className={DateInputWrapperStyle}
          onClick={evt => evt.stopPropagation()}
          role="presentation"
        >
          <Label>
            <FormattedMessage id="components.cards.desired" defaultMessage="DESIRED" />
          </Label>
          <FormField name={`batch.${batch.id}.desiredAt`} initValue={desiredAt}>
            {({ name, ...inputHandlers }) =>
              dateInputFactory({
                width: '120px',
                height: '20px',
                name,
                isNew: false,
                originalValue: desiredAt,
                inputHandlers: {
                  ...inputHandlers,
                  onBlur: evt => {
                    inputHandlers.onBlur(evt);
                    saveOnBlur({
                      ...batch,
                      desiredAt: inputHandlers.value ? inputHandlers.value : null,
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
            <FormattedMessage id="components.cards.total" defaultMessage="TTL PRICE" />
          </Label>
          <Display>
            <FormattedNumber
              value={(price && price.amount ? price.amount : 0) * (quantity + totalAdjustment)}
              suffix={currency}
            />
          </Display>
        </div>

        <div className={VolumeWrapperStyle}>
          <Label>
            <FormattedMessage id="components.cards.volume" defaultMessage="TTL VOL" />
          </Label>
          <Display>
            {packageVolume && packageQuantity != null && (
              <FormattedNumber
                value={packageVolume.value * packageQuantity}
                suffix={packageVolume.metric}
              />
            )}
          </Display>
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
        <div className={TagsAndTaskWrapperStyle}>
          <div className={BatchTagsWrapperStyle}>
            {batch.tags.length > 0 && batch.tags.map(tag => <Tag key={tag.id} tag={tag} />)}
          </div>
          <TasksNumber {...todo} />
        </div>
      </div>
    </BaseCard>
  );
};

OrderBatchCard.defaultProps = defaultProps;

export default withForbiddenCard(OrderBatchCard, 'batch', {
  width: '195px',
  height: '241px',
  entityIcon: 'BATCH',
  entityColor: 'BATCH',
});
