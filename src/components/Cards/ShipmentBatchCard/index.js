// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { FormField } from 'modules/form';
import { numberInputFactory, textInputFactory, dateInputFactory } from 'modules/form/helpers';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import Tag from 'components/Tag';
import FormattedNumber from 'components/FormattedNumber';
import { FieldItem, Label, Display } from 'components/Form';
import validator from './validator';
import BaseCard, { CardAction } from '../BaseCard';
import {
  ShipmentBatchCardWrapperStyle,
  ProductWrapperStyle,
  ProductImageStyle,
  ProductInfoWrapperStyle,
  ProductNameStyle,
  ProductSerialStyle,
  ProductSupplierStyle,
  ProductIconLinkStyle,
  BatchInfoWrapperStyle,
  BatchNoWrapperStyle,
  QuantityWrapperStyle,
  DeliveryDateWrapperStyle,
  DividerStyle,
  TotalPriceWrapperStyle,
  VolumeWrapperStyle,
  OrderWrapperStyle,
  OrderIconStyle,
  OrderInChargeWrapperStyle,
  InChargeWrapperStyle,
  BatchTagsWrapperStyle,
} from './style';

type OptionalProps = {
  onClick: (batch: Object) => void,
  onClone: (batch: Object) => void,
  onClear: (batch: Object) => void,
  selectable: boolean,
};

type Props = OptionalProps & {
  batch: ?Object,
  currency: string,
  price: ?{
    amount: number,
    currency: string,
  },
  saveOnBlur: Function,
};

const defaultProps = {
  onClick: () => {},
  onClone: () => {},
  onClear: () => {},
  selectable: false,
};

const ShipmentBatchCard = ({
  batch,
  onClick,
  onClear,
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
        <CardAction icon="CLEAR" hoverColor="RED" onClick={() => onClear(batch)} />,
      ];

  const {
    id,
    no,
    quantity,
    deliveredAt,
    batchAdjustments,
    packageVolume,
    packageQuantity,
    tags,
    orderItem: {
      productProvider: { product, supplier, exporter },
      order,
    },
  } = batch;

  const totalAdjustment = batchAdjustments
    ? batchAdjustments.reduce((total, adjustment) => adjustment.quantity + total, 0)
    : 0;

  const productImage =
    product.files && product.files.length > 0 ? product.files[0].path : FALLBACK_IMAGE;

  const validation = validator({
    no: `batch.${id}.no`,
    quantity: `batch.${id}.quantity`,
  });
  const values = {
    [`batch.${id}.no`]: no,
    [`batch.${id}.quantity`]: quantity + totalAdjustment,
  };
  return (
    <BaseCard
      icon="BATCH"
      color="BATCH"
      showActionsOnHover
      actions={actions}
      selectable={selectable}
      {...rest}
    >
      <div
        className={ShipmentBatchCardWrapperStyle}
        onClick={() => onClick({ ...batch, no, quantity, deliveredAt })}
        role="presentation"
      >
        <div
          className={ProductWrapperStyle}
          onClick={() => onClick({ ...batch, no, quantity, deliveredAt })}
          role="presentation"
        >
          <img className={ProductImageStyle} src={productImage} alt="product_image" />

          <div className={ProductInfoWrapperStyle}>
            <div className={ProductNameStyle}>{product.name}</div>
            <div className={ProductSerialStyle}>{product.serial}</div>
            <div className={ProductSupplierStyle}>
              <Icon icon="EXPORTER" />
              {exporter && exporter.name}
            </div>
            <div className={ProductSupplierStyle}>
              <Icon icon="SUPPLIER" />
              {supplier && supplier.name}
            </div>
          </div>

          <Link
            className={ProductIconLinkStyle}
            to={`/product/${encodeId(product.id)}`}
            onClick={evt => {
              evt.stopPropagation();
            }}
          >
            <Icon icon="PRODUCT" />
          </Link>
        </div>
        <div className={BatchInfoWrapperStyle}>
          <div
            className={BatchNoWrapperStyle}
            onClick={evt => evt.stopPropagation()}
            role="presentation"
          >
            <FormField
              name={`batch.${id}.no`}
              initValue={no}
              validator={validation}
              values={values}
            >
              {({ name: fieldName, ...inputHandlers }) =>
                textInputFactory({
                  width: '185px',
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
              name={`batch.${id}.quantity`}
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
            <FormField name={`batch.${id}.deliveredAt`} initValue={deliveredAt}>
              {({ name: fieldName, ...inputHandlers }) =>
                dateInputFactory({
                  width: '120px',
                  height: '20px',
                  name: fieldName,
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

          <div className={DividerStyle} />

          <div className={TotalPriceWrapperStyle}>
            <FieldItem
              label={
                <Label>
                  <FormattedMessage id="components.cards.ttlPrice" defaultMessage="TTL PRICE" />
                </Label>
              }
              input={
                <Display>
                  <FormattedNumber
                    value={
                      (price && price.amount ? price.amount : 0) * (quantity + totalAdjustment)
                    }
                    suffix={currency || (price && price.currency)}
                  />
                </Display>
              }
            />
          </div>

          <div className={VolumeWrapperStyle}>
            <FieldItem
              label={
                <Label>
                  <FormattedMessage id="components.cards.ttlVol" defaultMessage="TTL VOL" />
                </Label>
              }
              input={
                <Display>
                {packageVolume && packageQuantity != null && (
                  <FormattedNumber
                    value={packageVolume.value * packageQuantity}
                    suffix={packageVolume.metric}
                  />
                )}
                </Display>
              }
            />
          </div>

          <div className={OrderWrapperStyle}>
            <Link
              className={OrderIconStyle}
              to={`/order/${encodeId(order.id)}`}
              onClick={evt => {
                evt.stopPropagation();
              }}
            >
              <Icon icon="ORDER" />
            </Link>
            <Display align="left">{order.poNo}</Display>
          </div>

          <div className={OrderInChargeWrapperStyle}>
            <Label>
              <FormattedMessage
                id="components.cards.orderInCharge"
                defaultMessage="ORDER IN CHARGE"
              />
            </Label>
            <div className={InChargeWrapperStyle}>
              {order.inCharges &&
                order.inCharges.map(inCharge => (
                  <UserAvatar
                    firstName={inCharge.firstName}
                    lastName={inCharge.lastName}
                    key={inCharge.id}
                  />
                ))}
            </div>
          </div>

          <div className={BatchTagsWrapperStyle}>
            {tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

ShipmentBatchCard.defaultProps = defaultProps;

export default ShipmentBatchCard;
