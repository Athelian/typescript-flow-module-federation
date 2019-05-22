// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { BooleanValue } from 'react-values';
import { encodeId } from 'utils/id';
import { getByPath } from 'utils/fp';
import { updateBatchCardQuantity, getBatchLatestQuantity } from 'utils/batch';
import {
  Label,
  Display,
  TextInputFactory,
  NumberInputFactory,
  DateInputFactory,
} from 'components/Form';
import TaskRing from 'components/TaskRing';
import withForbiddenCard from 'hoc/withForbiddenCard';
import { FormField } from 'modules/form';
import RemoveDialog from 'components/Dialog/RemoveDialog';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import { getLatestDate } from 'utils/shipment';
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
  ContainerWrapperStyle,
  ContainerIconStyle,
  WarehouseArrivalWrapperStyle,
  WarehouseArrivalIconStyle,
  ApprovalIconStyle,
  TagsAndTaskWrapperStyle,
  BatchTagsWrapperStyle,
} from './style';

type OptionalProps = {
  onClick: (batch: Object) => void,
  editable: boolean,
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
  editable: false,
};

const OrderBatchCard = ({
  batch,
  onClick,
  onRemove,
  onClone,
  saveOnBlur,
  currency,
  price,
  editable,
  ...rest
}: Props) => {
  const actions = editable
    ? [
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
      ]
    : [];

  const {
    id,
    archived,
    no,
    quantity,
    deliveredAt,
    desiredAt,
    packageVolume,
    packageQuantity,
    batchQuantityRevisions = [],
    shipment,
    container,
    todo,
  } = batch;

  const hasContainers = shipment && shipment.containers && shipment.containers.length > 0;

  const actualQuantity = getBatchLatestQuantity({ quantity, batchQuantityRevisions });

  const quantityName =
    batchQuantityRevisions.length > 0
      ? `batches.${id}.batchQuantityRevisions.${batchQuantityRevisions.length - 1}.quantity`
      : `batches.${id}.quantity`;

  const validation = validator({
    no: `batch.${batch.id}.no`,
  });

  const values = {
    [`batch.${batch.id}.no`]: no,
  };

  return (
    <BaseCard
      icon="BATCH"
      color="BATCH"
      showActionsOnHover
      actions={actions}
      isArchived={archived}
      {...rest}
    >
      <div
        className={OrderBatchCardWrapperStyle}
        onClick={() => onClick(batch)}
        role="presentation"
      >
        <div
          className={BatchNoWrapperStyle}
          onClick={evt => evt.stopPropagation()}
          role="presentation"
        >
          <FormField name={`batch.${id}.no`} initValue={no} validator={validation} values={values}>
            {({ name: fieldName, ...inputHandlers }) => (
              <TextInputFactory
                {...{
                  ...inputHandlers,
                  onBlur: evt => {
                    inputHandlers.onBlur(evt);
                    saveOnBlur({ ...batch, no: inputHandlers.value });
                  },
                }}
                editable={editable}
                inputWidth="165px"
                inputHeight="20px"
                inputAlign="left"
                name={fieldName}
                hideTooltip
              />
            )}
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
            name={quantityName}
            initValue={actualQuantity}
            validator={validation}
            values={values}
          >
            {({ name: fieldName, ...inputHandlers }) => (
              <NumberInputFactory
                inputWidth="90px"
                inputHeight="20px"
                editable={editable}
                {...{
                  ...inputHandlers,
                  onBlur: evt => {
                    inputHandlers.onBlur(evt);
                    const newBatch = updateBatchCardQuantity(batch, inputHandlers.value);
                    saveOnBlur(newBatch);
                  },
                }}
                name={fieldName}
                originalValue={actualQuantity}
                hideTooltip
              />
            )}
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
            {({ name: fieldName, ...inputHandlers }) => (
              <DateInputFactory
                inputWidth="120px"
                inputHeight="20px"
                name={fieldName}
                editable={editable}
                hideTooltip
                {...{
                  ...inputHandlers,
                  onBlur: evt => {
                    inputHandlers.onBlur(evt);
                    saveOnBlur({
                      ...batch,
                      deliveredAt: inputHandlers.value ? inputHandlers.value : null,
                    });
                  },
                }}
              />
            )}
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
            {({ name: fieldName, ...inputHandlers }) => (
              <DateInputFactory
                inputWidth="120px"
                inputHeight="20px"
                name={fieldName}
                editable={editable}
                hideTooltip
                {...{
                  ...inputHandlers,
                  onBlur: evt => {
                    inputHandlers.onBlur(evt);
                    saveOnBlur({
                      ...batch,
                      desiredAt: inputHandlers.value ? inputHandlers.value : null,
                    });
                  },
                }}
              />
            )}
          </FormField>
        </div>

        <div className={DividerStyle} />

        <div className={TotalPriceWrapperStyle}>
          <Label>
            <FormattedMessage id="components.cards.total" defaultMessage="TTL PRICE" />
          </Label>
          <Display>
            <FormattedNumber
              value={(price && price.amount ? price.amount : 0) * actualQuantity}
              suffix={currency}
            />
          </Display>
        </div>

        <div className={VolumeWrapperStyle}>
          <Label>
            <FormattedMessage id="components.cards.volume" defaultMessage="TTL VOL" />
          </Label>
          <Display>
            {packageVolume && packageQuantity !== null && (
              <FormattedNumber
                value={packageVolume.value * packageQuantity}
                suffix={packageVolume.metric}
              />
            )}
          </Display>
        </div>

        <div className={ShipmentWrapperStyle}>
          <div
            className={ShipmentIconStyle(!!shipment)}
            onClick={evt => {
              if (shipment) {
                evt.stopPropagation();
                navigate(`/shipment/${encodeId(shipment.id)}`);
              }
            }}
            role="presentation"
          >
            <Icon icon="SHIPMENT" />
          </div>
          <Display align="left">{getByPath('no', shipment)}</Display>
        </div>

        <div className={ContainerWrapperStyle}>
          <div
            className={ContainerIconStyle(!!container)}
            onClick={evt => {
              if (container) {
                evt.stopPropagation();
                navigate(`/container/${encodeId(container.id)}`);
              }
            }}
            role="presentation"
          >
            <Icon icon="CONTAINER" />
          </div>
          <Display align="left">{getByPath('no', container)}</Display>
        </div>

        {hasContainers ? (
          <>
            <div className={WarehouseArrivalWrapperStyle}>
              <div className={WarehouseArrivalIconStyle}>
                <Icon icon="WAREHOUSE" />
              </div>
              <Label>
                <FormattedMessage id="components.cards.agreed" defaultMessage="AGREED" />
              </Label>
              <Display align="left">
                <FormattedDate value={getByPath('warehouseArrivalAgreedDate', container)} />
              </Display>
              <div
                className={ApprovalIconStyle(
                  !!getByPath('warehouseArrivalAgreedDateApprovedBy', container)
                )}
              >
                <Icon icon="CHECKED" />
              </div>
            </div>

            <div className={WarehouseArrivalWrapperStyle}>
              <div className={WarehouseArrivalIconStyle}>
                <Icon icon="WAREHOUSE" />
              </div>
              <Label>
                <FormattedMessage id="components.cards.actual" defaultMessage="ACTUAL" />
              </Label>
              <Display align="left">
                <FormattedDate value={getByPath('warehouseArrivalActualDate', container)} />
              </Display>
              <div
                className={ApprovalIconStyle(
                  !!getByPath('warehouseArrivalActualDateApprovedBy', container)
                )}
              >
                <Icon icon="CHECKED" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={WarehouseArrivalWrapperStyle}>
              <div className={WarehouseArrivalIconStyle}>
                <Icon icon="WAREHOUSE" />
              </div>
              <Label>
                <FormattedMessage id="components.cards.arrival" defaultMessage="ARRIVAL" />
              </Label>
              <Display align="left">
                <FormattedDate
                  value={getLatestDate(getByPath('containerGroups.0.warehouseArrival', shipment))}
                />
              </Display>
              <div
                className={ApprovalIconStyle(
                  !!getByPath('containerGroups.0.warehouseArrival.approvedAt', shipment)
                )}
              >
                <Icon icon="CHECKED" />
              </div>
            </div>
            <div className={WarehouseArrivalWrapperStyle} />
          </>
        )}

        <div className={TagsAndTaskWrapperStyle}>
          <div className={BatchTagsWrapperStyle}>
            {batch.tags.length > 0 && batch.tags.map(tag => <Tag key={tag.id} tag={tag} />)}
          </div>
          <TaskRing {...todo} />
        </div>
      </div>
    </BaseCard>
  );
};

OrderBatchCard.defaultProps = defaultProps;

export default withForbiddenCard(OrderBatchCard, 'batch', {
  width: '195px',
  height: '291px',
  entityIcon: 'BATCH',
  entityColor: 'BATCH',
});
