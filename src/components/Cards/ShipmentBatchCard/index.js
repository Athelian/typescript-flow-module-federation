// @flow
import React from 'react';
import { Subscribe } from 'unstated';
import { FormContainer, FormField } from 'modules/form';
import type { BatchQuery as BatchItem } from 'modules/batch/type.js.flow';
import { ObjectValue } from 'react-values';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import FormattedNumber from 'components/FormattedNumber';
import { DefaultStyle, Label, Display, TextInput, DateInput, NumberInput } from 'components/Form';
import BaseCard, { CardAction } from '../BaseCard';
import {
  ProductWrapperStyle,
  ProductImageStyle,
  ProductInfoWrapperStyle,
  ProductNameStyle,
  ProductSerialStyle,
  ProductSupplierStyle,
  ProductIconLinkStyle,
  ShipmentBatchCardWrapperStyle,
  BatchNoWrapperStyle,
  QuantityWrapperStyle,
  DeliveryDateWrapperStyle,
  DividerStyle,
  TotalPriceWrapperStyle,
  VolumeWrapperStyle,
  ShipmentWrapperStyle,
  ShipmentIconStyle,
  BatchTagsWrapperStyle,
} from './style';

type OptionalProps = {
  onClick: (batch: BatchItem) => void,
  onClone: (batch: BatchItem) => void,
  onRemove: (batch: BatchItem) => void,
  selectable: boolean,
};

type Props = OptionalProps & {
  batch: ?BatchItem,
  currency: string,
  price: ?{
    amount: number,
    currency: string,
  },
  saveOnBlur: Function,
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
  onClone: () => {},
  onRemove: () => {},
  selectable: false,
};

const ShipmentBatchCard = ({
  batch,
  onClick,
  onRemove,
  onClone,
  saveOnBlur,
  currency,
  price,
  selectable,
  ...rest
}: Props) => {
  if (!batch) return '';

  const actions = selectable
    ? []
    : [
        <CardAction icon="CLONE" onClick={() => onClone(batch)} />,
        <CardAction icon="REMOVE" hoverColor="RED" onClick={() => onRemove(batch)} />,
      ];

  const {
    orderItem: {
      productProvider: { product, supplier, exporter },
    },
  } = batch;

  const { name, serial } = product;
  return (
    <ObjectValue defaultValue={batch}>
      {({ value: { no, quantity, deliveredAt }, set }) => (
        <BaseCard icon="BATCH" color="BATCH" actions={actions} selectable={selectable} {...rest}>
          <div className={ProductWrapperStyle}>
            <img className={ProductImageStyle} src={FALLBACK_IMAGE} alt="product_image" />

            <div className={ProductInfoWrapperStyle}>
              <div className={ProductNameStyle}>{name}</div>
              <div className={ProductSerialStyle}>{serial}</div>
              <div className={ProductSupplierStyle}>
                <Icon icon="EXPORTER" />
                {exporter && exporter.name}
              </div>
              <div className={ProductSupplierStyle}>
                <Icon icon="SUPPLIER" />
                {supplier && supplier.name}
              </div>
            </div>

            <button className={ProductIconLinkStyle} type="button">
              <Icon icon="PRODUCT" />
            </button>
          </div>
          <div
            className={ShipmentBatchCardWrapperStyle}
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
              <button className={ShipmentIconStyle(true)} type="button">
                <Icon icon="ORDER" />
              </button>
              <Display align="left">
                {batch.orderItem && batch.orderItem.order && batch.orderItem.order.poNo}
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

ShipmentBatchCard.defaultProps = defaultProps;

export default ShipmentBatchCard;
