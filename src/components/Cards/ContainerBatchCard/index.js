// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { FormField } from 'modules/form';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import Tag from 'components/Tag';
import TaskRing from 'components/TaskRing';
import FormattedNumber from 'components/FormattedNumber';
import withForbiddenCard from 'hoc/withForbiddenCard';
import { getByPathWithDefault } from 'utils/fp';
import {
  FieldItem,
  Label,
  Display,
  TextInputFactory,
  NumberInputFactory,
  DateInputFactory,
} from 'components/Form';
import { getProductImage, totalAdjustQuantity } from 'components/Cards/utils';
import validator from './validator';
import BaseCard, { CardAction } from '../BaseCard';
import {
  ContainerBatchCardWrapperStyle,
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
  ShipmentWrapperStyle,
  ShipmentIconStyle,
  OrderInChargeWrapperStyle,
  InChargeWrapperStyle,
  TagsAndTaskWrapperStyle,
  BatchTagsWrapperStyle,
  RepresentIconStyle,
} from './style';

type OptionalProps = {
  onClick: (batch: Object) => void,
  onClone: (batch: Object) => void,
  onClear: (batch: Object) => void,
  onClickRepresentative: () => void,
  selectable: boolean,
  editable: {
    no: boolean,
    quantity: boolean,
    deliveredAt: boolean,
    desiredAt: boolean,
    representativeBatch: boolean,
    cloneBatch: boolean,
    removeBatch: boolean,
  },
  navigate: {
    product: boolean,
    order: boolean,
    shipment: boolean,
  },
  read: {
    price: boolean,
    tasks: boolean,
  },
  isRepresented: boolean,
};

type Props = OptionalProps & {
  position: number,
  batch: Object,
  currency: string,
  saveOnBlur: Function,
};

const defaultProps = {
  onClick: () => {},
  onClone: () => {},
  onClear: () => {},
  onClickRepresentative: () => {},
  selectable: false,
  editable: {
    no: false,
    quantity: false,
    deliveredAt: false,
    desiredAt: false,
    representativeBatch: false,
    cloneBatch: false,
    removeBatch: false,
  },
  navigate: {
    product: false,
    order: false,
    shipment: false,
  },
  read: {
    price: false,
    tasks: false,
  },
  isRepresented: false,
};

const ContainerBatchCard = ({
  position,
  batch,
  onClick,
  onClear,
  onClone,
  onClickRepresentative,
  saveOnBlur,
  currency,
  selectable,
  editable,
  navigate,
  read,
  isRepresented,
  ...rest
}: Props) => {
  const actions = selectable
    ? []
    : [
        ...(editable.cloneBatch
          ? [<CardAction icon="CLONE" onClick={() => onClone(batch)} />]
          : []),
        ...(editable.removeBatch
          ? [<CardAction icon="CLEAR" hoverColor="RED" onClick={() => onClear(batch)} />]
          : []),
      ];

  const {
    no,
    quantity = 0,
    batchAdjustments,
    deliveredAt,
    desiredAt,
    packageVolume,
    packageQuantity,
    tags,
    shipment,
    orderItem: {
      price,
      productProvider: { product, supplier, exporter },
      order,
    },
    todo,
  } = batch;
  const productImage = getProductImage(product);

  const totalAdjustment = totalAdjustQuantity(batchAdjustments);

  const actualQuantity = quantity + totalAdjustment;

  const validation = validator({
    no: `batches.${position}.no`,
    quantity: `batches.${position}.quantity`,
  });
  const values = {
    [`batches.${position}.no`]: no,
    [`batches.${position}.quantity`]: actualQuantity,
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
        className={ContainerBatchCardWrapperStyle}
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

          {navigate.product ? (
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
          {editable.representativeBatch ? (
            <button
              type="button"
              onClick={evt => {
                evt.stopPropagation();
                onClickRepresentative();
              }}
              className={RepresentIconStyle(isRepresented, true)}
            >
              <Icon icon="STAR" />
            </button>
          ) : (
            <div className={RepresentIconStyle(isRepresented)}>
              <Icon icon="STAR" />
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
              name={`batches.${position}.no`}
              initValue={no}
              validator={validation}
              values={values}
            >
              {({ name: fieldName, ...inputHandlers }) => (
                <TextInputFactory
                  name={fieldName}
                  {...inputHandlers}
                  onBlur={evt => {
                    inputHandlers.onBlur(evt);
                    saveOnBlur({ ...batch, no: inputHandlers.value });
                  }}
                  originalValue={no}
                  editable={editable.no}
                  inputWidth="185px"
                  inputHeight="20px"
                  inputAlign="left"
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
              name={`batches.${position}.quantity`}
              initValue={actualQuantity}
              validator={validation}
              values={values}
            >
              {({ name: fieldName, ...inputHandlers }) => (
                <NumberInputFactory
                  name={fieldName}
                  {...inputHandlers}
                  onBlur={evt => {
                    inputHandlers.onBlur(evt);
                    saveOnBlur({
                      ...batch,
                      quantity: inputHandlers.value - totalAdjustment,
                    });
                  }}
                  originalValue={actualQuantity}
                  editable={editable.quantity}
                  inputWidth="90px"
                  inputHeight="20px"
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
            <FormField name={`batches.${position}.deliveredAt`} initValue={deliveredAt}>
              {({ name: fieldName, ...inputHandlers }) => (
                <DateInputFactory
                  name={fieldName}
                  {...inputHandlers}
                  onBlur={evt => {
                    inputHandlers.onBlur(evt);
                    saveOnBlur({
                      ...batch,
                      deliveredAt: inputHandlers.value ? inputHandlers.value : null,
                    });
                  }}
                  originalValue={deliveredAt}
                  editable={editable.deliveredAt}
                  inputWidth="120px"
                  inputHeight="20px"
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
            <FormField name={`batches.${position}.desiredAt`} initValue={desiredAt}>
              {({ name: fieldName, ...inputHandlers }) => (
                <DateInputFactory
                  name={fieldName}
                  {...inputHandlers}
                  onBlur={evt => {
                    inputHandlers.onBlur(evt);
                    saveOnBlur({
                      ...batch,
                      desiredAt: inputHandlers.value ? inputHandlers.value : null,
                    });
                  }}
                  originalValue={desiredAt}
                  editable={editable.desiredAt}
                  inputWidth="120px"
                  inputHeight="20px"
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
                <Display blackout={!read.price}>
                  <FormattedNumber
                    value={(price && price.amount ? price.amount : 0) * actualQuantity}
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
                  {packageVolume != null && packageQuantity != null && (
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
            {navigate.order ? (
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

          <div className={ShipmentWrapperStyle}>
            {navigate.shipment ? (
              <Link
                className={ShipmentIconStyle}
                to={`/shipment/${shipment ? encodeId(shipment.id) : ''}`}
                onClick={evt => {
                  evt.stopPropagation();
                }}
              >
                <Icon icon="SHIPMENT" />
              </Link>
            ) : (
              <div className={ShipmentIconStyle}>
                <Icon icon="SHIPMENT" />
              </div>
            )}
            <Display align="left">{getByPathWithDefault(null, 'no', shipment)}</Display>
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

          <div className={TagsAndTaskWrapperStyle}>
            <div className={BatchTagsWrapperStyle}>
              {tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
            </div>
            <TaskRing {...todo} blackout={!read.tasks} />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

ContainerBatchCard.defaultProps = defaultProps;

export default withForbiddenCard(ContainerBatchCard, 'batch', {
  width: '195px',
  height: '381px',
  entityIcon: 'BATCH',
  entityColor: 'BATCH',
});
