// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { FormField } from 'modules/form';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import Tag from 'components/Tag';
import TasksNumber from 'components/TasksNumber';
import FormattedNumber from 'components/FormattedNumber';
import withForbiddenCard from 'hoc/withForbiddenCard';
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
    removeBatch: boolean,
    cloneBatch: boolean,
    viewOrder: boolean,
    viewProduct: boolean,
    setRepresentativeBatch: boolean,
    getPrice: boolean,
  },
  isRepresented: boolean,
};

type Props = OptionalProps & {
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
    removeBatch: false,
    cloneBatch: false,
    viewOrder: false,
    viewProduct: false,
    setRepresentativeBatch: false,
    getPrice: false,
  },
  isRepresented: false,
};

const ShipmentContainerBatchCard = ({
  batch,
  onClick,
  onClear,
  onClone,
  onClickRepresentative,
  saveOnBlur,
  currency,
  selectable,
  editable,
  isRepresented,
  ...rest
}: Props) => {
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
    batchAdjustments,
    deliveredAt,
    desiredAt,
    packageVolume,
    packageQuantity,
    tags,
    orderItem: {
      price,
      productProvider: { product, supplier, exporter },
      order,
    },
    todo,
  } = batch;
  const productImage = getProductImage(product);
  const totalAdjustment = totalAdjustQuantity(batchAdjustments);

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

          {editable.setRepresentativeBatch ? (
            <button
              type="button"
              onClick={evt => {
                evt.stopPropagation();

                onClickRepresentative();
              }}
              className={RepresentIconStyle(isRepresented)}
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
              name={`batch.${id}.no`}
              initValue={no}
              validator={validation}
              values={values}
            >
              {({ name: fieldName, ...inputHandlers }) => (
                <TextInputFactory
                  inputWidth="185px"
                  inputHeight="20px"
                  inputAlign="left"
                  editable={editable.no}
                  {...{
                    ...inputHandlers,
                    onBlur: evt => {
                      inputHandlers.onBlur(evt);
                      saveOnBlur({ ...batch, no: inputHandlers.value });
                    },
                  }}
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
                      saveOnBlur({
                        ...batch,
                        quantity: inputHandlers.value - totalAdjustment,
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
                <Display blackout={!editable.getPrice}>
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
            <TasksNumber {...todo} />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

ShipmentContainerBatchCard.defaultProps = defaultProps;

export default withForbiddenCard(ShipmentContainerBatchCard, 'batch', {
  width: '195px',
  height: '356px',
  entityIcon: 'BATCH',
  entityColor: 'BATCH',
});
