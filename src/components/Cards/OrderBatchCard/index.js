// @flow
import React from 'react';
import { Subscribe } from 'unstated';
import { FormContainer, FormField } from 'modules/form';
import type { BatchQuery as BatchItem } from 'modules/batch/type.js.flow';
import { ObjectValue } from 'react-values';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
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

  return (
    <ObjectValue defaultValue={batch}>
      {({ value: { no, quantity, deliveredAt }, set }) => (
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
              <Subscribe to={[FormContainer]}>
                {({ state: { activeField }, ...formHelper }) => (
                  <FormField name={`batch.${batch.id}.no`} initValue={quantity} {...formHelper}>
                    {inputHandlers => (
                      <DefaultStyle
                        height="20px"
                        width="165px"
                        isFocused={activeField === inputHandlers.name}
                      >
                        <TextInput
                          {...inputHandlers}
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            saveOnBlur({ ...batch, no });
                          }}
                          onChange={evt => set('no', evt.target.value)}
                          align="left"
                          value={no}
                        />
                      </DefaultStyle>
                    )}
                  </FormField>
                )}
              </Subscribe>
            </div>

            <div
              className={QuantityWrapperStyle}
              onClick={evt => evt.stopPropagation()}
              role="presentation"
            >
              <Label required>QTY</Label>
              <Subscribe to={[FormContainer]}>
                {({ state: { activeField }, ...formHelper }) => (
                  <FormField
                    name={`batch.${batch.id}.quantity`}
                    initValue={quantity}
                    {...formHelper}
                  >
                    {inputHandlers => (
                      <DefaultStyle
                        type="number"
                        height="20px"
                        width="90px"
                        isFocused={activeField === inputHandlers.name}
                      >
                        <NumberInput
                          {...inputHandlers}
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            saveOnBlur({ ...batch, quantity });
                          }}
                          onChange={evt => set('quantity', evt.target.value)}
                          value={quantity}
                        />
                      </DefaultStyle>
                    )}
                  </FormField>
                )}
              </Subscribe>
            </div>

            <div
              className={DeliveryDateWrapperStyle}
              onClick={evt => evt.stopPropagation()}
              role="presentation"
            >
              <Label>DELIVERY</Label>
              <Subscribe to={[FormContainer]}>
                {({ state: { activeField }, ...formHelper }) => (
                  <FormField
                    name={`batch.${batch.id}.deliveredAt`}
                    initValue={deliveredAt}
                    {...formHelper}
                  >
                    {inputHandlers => (
                      <DefaultStyle
                        type="date"
                        height="20px"
                        width="90px"
                        isFocused={activeField === inputHandlers.name}
                      >
                        <DateInput
                          {...inputHandlers}
                          onBlur={evt => {
                            inputHandlers.onBlur(evt);
                            saveOnBlur({ ...batch, deliveredAt });
                          }}
                          onChange={evt => set('deliveredAt', evt.target.value)}
                          value={deliveredAt}
                        />
                      </DefaultStyle>
                    )}
                  </FormField>
                )}
              </Subscribe>
            </div>

            <div className={DividerStyle} />

            <div className={TotalPriceWrapperStyle}>
              <Label>TOTAL</Label>
              <Display>
                <FormattedNumber value={quantity * (price && price.amount ? price.amount : 0)} />
                {currency}
              </Display>
            </div>

            <div className={VolumeWrapperStyle}>
              <Label>VOLUME</Label>
              <Display>{calculateVolume(batch, quantity)} </Display>
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

OrderBatchCard.defaultProps = defaultProps;

export default OrderBatchCard;
