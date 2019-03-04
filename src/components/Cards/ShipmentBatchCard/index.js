// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { calculatePackageQuantity } from 'utils/batch';
import { FormField } from 'modules/form';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import Tag from 'components/Tag';
import FormattedNumber from 'components/FormattedNumber';
import {
  FieldItem,
  Label,
  Display,
  NumberInputFactory,
  TextInputFactory,
  DateInputFactory,
} from 'components/Form';
import { getProductImage, totalAdjustQuantity } from 'components/Cards/utils';
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
  DateInputWrapperStyle,
  DividerStyle,
  TotalPriceWrapperStyle,
  VolumeWrapperStyle,
  OrderWrapperStyle,
  OrderIconStyle,
  OrderInChargeWrapperStyle,
  InChargeWrapperStyle,
  BatchTagsWrapperStyle,
  ContainerWrapperStyle,
  ContainerIconStyle,
} from './style';

type OptionalProps = {
  onClick: (batch: Object) => void,
  onClone: (batch: Object) => void,
  onClear: (batch: Object) => void,
  selectable: boolean,
  editable: Object,
};

type Props = OptionalProps & {
  batch: ?Object,
  currency: string,
  saveOnBlur: Function,
};

const defaultProps = {
  onClick: () => {},
  onClone: () => {},
  onClear: () => {},
  selectable: false,
  editable: {
    no: false,
    quantity: false,
    deliveredAt: false,
    desiredAt: false,
    removeBatch: false,
    cloneBatch: false,
    viewOrder: false,
    viewProduct: false,
    viewContainer: false,
  },
};

const ShipmentBatchCard = ({
  batch,
  onClick,
  onClear,
  onClone,
  saveOnBlur,
  currency,
  selectable,
  editable,
  ...rest
}: Props) => {
  if (!batch) return '';

  const actions = selectable
    ? []
    : [
        editable.cloneBatch && <CardAction icon="CLONE" onClick={() => onClone(batch)} />,
        editable.removeBatch && (
          <CardAction icon="CLEAR" hoverColor="RED" onClick={() => onClear(batch)} />
        ),
      ].filter(Boolean);

  const {
    id,
    no,
    quantity,
    deliveredAt,
    desiredAt,
    batchAdjustments,
    packageVolume,
    packageQuantity,
    tags,
    container,
    autoCalculatePackageQuantity,
    orderItem: {
      price,
      productProvider: { product, supplier, exporter },
      order,
    },
  } = batch;

  const totalAdjustment = totalAdjustQuantity(batchAdjustments);

  const productImage = getProductImage(product);

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
        onClick={() => onClick({ ...batch, no, quantity, deliveredAt, desiredAt })}
        role="presentation"
      >
        <div
          className={ProductWrapperStyle}
          onClick={() => onClick({ ...batch, no, quantity, deliveredAt, desiredAt })}
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
          {editable.viewProduct ? (
            <Link
              className={ProductIconLinkStyle}
              to={`/product/${encodeId(product.id)}`}
              onClick={evt => {
                evt.stopPropagation();
              }}
            >
              <Icon icon="PRODUCT" />
            </Link>
          ) : (
            <div className={ProductIconLinkStyle}>
              <Icon icon="PRODUCT" />
            </div>
          )}
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
              {({ name: fieldName, ...inputHandlers }) => (
                <TextInputFactory
                  {...{
                    ...inputHandlers,
                    onBlur: evt => {
                      inputHandlers.onBlur(evt);
                      saveOnBlur({ ...batch, no: inputHandlers.value });
                    },
                  }}
                  editable={editable.no}
                  inputWidth="185px"
                  inputHeight="20px"
                  inputAlign="left"
                  name={fieldName}
                  isNew={false}
                  originalValue={no}
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
              name={`batch.${id}.quantity`}
              initValue={quantity + totalAdjustment}
              validator={validation}
              values={values}
            >
              {({ name: fieldName, ...inputHandlers }) => (
                <NumberInputFactory
                  inputWidth="90px"
                  inputHeight="20px"
                  editable={editable.quantity}
                  {...{
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
                  }}
                  name={fieldName}
                  isNew={false}
                  originalValue={quantity + totalAdjustment}
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
            <FormField name={`batch.${id}.deliveredAt`} initValue={deliveredAt}>
              {({ name: fieldName, ...inputHandlers }) => (
                <DateInputFactory
                  inputWidth="120px"
                  inputHeight="20px"
                  name={fieldName}
                  isNew={false}
                  originalValue={deliveredAt}
                  editable={editable.deliveredAt}
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
            <FormField name={`batch.${id}.desiredAt`} initValue={desiredAt}>
              {({ name: fieldName, ...inputHandlers }) => (
                <DateInputFactory
                  inputWidth="120px"
                  inputHeight="20px"
                  name={fieldName}
                  isNew={false}
                  originalValue={desiredAt}
                  editable={editable.desiredAt}
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
            {editable.viewOrder ? (
              <Link
                className={OrderIconStyle}
                to={`/order/${encodeId(order.id)}`}
                onClick={evt => {
                  evt.stopPropagation();
                }}
              >
                <Icon icon="ORDER" />
              </Link>
            ) : (
              <div className={OrderIconStyle}>
                <Icon icon="ORDER" />
              </div>
            )}
            <Display align="left">{order.poNo}</Display>
          </div>

          <div className={ContainerWrapperStyle}>
            {container ? (
              <>
                {editable.viewContainer ? (
                  <Link
                    className={ContainerIconStyle(true)}
                    to={`/container/${encodeId(container.id)}`}
                    onClick={evt => {
                      evt.stopPropagation();
                    }}
                  >
                    <Icon icon="CONTAINER" />
                  </Link>
                ) : (
                  <div className={ContainerIconStyle(true)}>
                    <Icon icon="CONTAINER" />
                  </div>
                )}
                <Display align="left">{container.no}</Display>
              </>
            ) : (
              <div className={ContainerIconStyle(false)}>
                <Icon icon="CONTAINER" />
              </div>
            )}
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
