// @flow
import React from 'react';
import type { Batch } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { defaultVolumeMetric } from 'utils/metric';
import {
  updateBatchCardQuantity,
  getBatchLatestQuantity,
  findActiveQuantityField,
} from 'utils/batch';
import { FormField } from 'modules/form';
import messages from 'modules/batch/messages';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import TaskRing from 'components/TaskRing';
import ProductImage from 'components/ProductImage';
import FormattedNumber from 'components/FormattedNumber';
import withForbiddenCard from 'hoc/withForbiddenCard';
import RelateEntity from 'components/RelateEntity';
import { getByPathWithDefault } from 'utils/fp';
import {
  INITIAL_QUANTITY,
  PRODUCED_QUANTITY,
  PRE_SHIPPED_QUANTITY,
  SHIPPED_QUANTITY,
  POST_SHIPPED_QUANTITY,
  DELIVERED_QUANTITY,
} from 'modules/batch/constants';
import {
  FieldItem,
  Label,
  Display,
  TextInputFactory,
  NumberInputFactory,
  DateInputFactory,
} from 'components/Form';
import validator from './validator';
import BaseCard, { CardAction } from '../BaseCard';
import {
  ContainerBatchCardWrapperStyle,
  ProductWrapperStyle,
  ProductImageStyle,
  ProductInfoWrapperStyle,
  ProductNameWrapperStyle,
  ProductIconLinkStyle,
  ProductNameStyle,
  ProductSerialStyle,
  ProductProviderNameStyle,
  BatchInfoWrapperStyle,
  BatchNoWrapperStyle,
  QuantityWrapperStyle,
  DateInputWrapperStyle,
  DividerStyle,
  TotalPriceWrapperStyle,
  VolumeWrapperStyle,
  OrderWrapperStyle,
  ShipmentWrapperStyle,
  TagsAndTaskWrapperStyle,
  BatchTagsWrapperStyle,
  RepresentIconStyle,
} from './style';

type OptionalProps = {
  onClick: (batch: mixed) => void,
  onClone: (batch: mixed) => void,
  onClear: (batch: mixed) => void,
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
  viewable: {
    price: boolean,
    tasks: boolean,
  },
  navigable: {
    product: boolean,
    order: boolean,
    shipment: boolean,
  },
  isRepresented: boolean,
};

type Props = OptionalProps & {
  batch: Batch,
  currency: string,
  saveOnBlur: Function,
};

const defaultProps = {
  onClick: () => {},
  onClone: () => {},
  onClear: () => {},
  onClickRepresentative: () => {},
  selectable: false,
  isRepresented: false,
};

const editableDefault = {
  no: false,
  quantity: false,
  deliveredAt: false,
  desiredAt: false,
  representativeBatch: false,
  cloneBatch: false,
  removeBatch: false,
};

const viewableDefault = {
  price: false,
  tasks: false,
};

const navigableDefault = {
  product: false,
  order: false,
  shipment: false,
};

const ContainerBatchCard = ({
  batch,
  onClick,
  onClear,
  onClone,
  onClickRepresentative,
  saveOnBlur,
  currency,
  selectable,
  editable,
  viewable,
  navigable,
  isRepresented,
  ...rest
}: Props) => {
  const mergedEditable = { ...editableDefault, ...editable };
  const mergedViewable = { ...viewableDefault, ...viewable };
  const mergedNavigable = { ...navigableDefault, ...navigable };

  const actions = selectable
    ? []
    : [
        mergedEditable.cloneBatch ? (
          <CardAction icon="CLONE" onClick={() => onClone(batch)} />
        ) : null,
        mergedEditable.removeBatch ? (
          <CardAction icon="CLEAR" hoverColor="RED" onClick={() => onClear(batch)} />
        ) : null,
      ].filter(Boolean);

  const archived = getByPathWithDefault(false, 'archived', batch);
  const id = getByPathWithDefault('', 'id', batch);
  const no = getByPathWithDefault('', 'no', batch);
  const quantity = getByPathWithDefault(0, 'quantity', batch);
  const deliveredAt = batch?.deliveredAt ?? null;
  const desiredAt = batch?.desiredAt ?? null;
  const packageQuantity = getByPathWithDefault(0, 'packageQuantity', batch);
  const packageVolume = getByPathWithDefault(
    {
      metric: defaultVolumeMetric,
      value: 0,
    },
    'packageVolume',
    batch
  );

  const tags = getByPathWithDefault([], 'tags', batch);
  const order = getByPathWithDefault({}, 'orderItem.order', batch);
  const price = getByPathWithDefault(null, 'orderItem.price', batch);
  const product = getByPathWithDefault(null, 'orderItem.productProvider.product', batch);
  const productProviderName = getByPathWithDefault('', 'orderItem.productProvider.name', batch);
  const shipment = getByPathWithDefault(null, 'shipment', batch);
  const todo = getByPathWithDefault(null, 'todo', batch);
  const latestQuantity = getBatchLatestQuantity(batch);
  const latestQuantityField: string = findActiveQuantityField({
    [PRODUCED_QUANTITY]: batch?.[PRODUCED_QUANTITY],
    [PRE_SHIPPED_QUANTITY]: batch?.[PRE_SHIPPED_QUANTITY],
    [SHIPPED_QUANTITY]: batch?.[SHIPPED_QUANTITY],
    [POST_SHIPPED_QUANTITY]: batch?.[POST_SHIPPED_QUANTITY],
    [DELIVERED_QUANTITY]: batch?.[DELIVERED_QUANTITY],
  });
  const quantityName = `batches.${id}.${latestQuantityField}`;
  const validation = validator({
    no: `batches.${id}.no`,
  });
  const values = {
    [`batches.${id}.no`]: no,
  };

  return (
    <BaseCard
      icon="BATCH"
      color="BATCH"
      showActionsOnHover
      actions={actions}
      selectable={selectable}
      isArchived={archived}
      showBadge={batch?.notificationUnseenCount > 0}
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
          <ProductImage
            className={ProductImageStyle}
            file={getByPathWithDefault(null, 'files.0', product)}
            height="70px"
          />

          <div className={ProductInfoWrapperStyle}>
            <div className={ProductNameWrapperStyle}>
              {mergedNavigable.product ? (
                // $FlowFixMe Flow typed is not updated yet
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

              <div className={ProductNameStyle}>{product.name}</div>
            </div>

            <div className={ProductSerialStyle}>{product.serial}</div>

            <div className={ProductProviderNameStyle}>
              <Icon icon="PRODUCT_PROVIDER" />
              {productProviderName}
            </div>
          </div>

          {mergedEditable.representativeBatch ? (
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
              name={`batches.${id}.no`}
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
                  editable={mergedEditable.no}
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
            <Label required={latestQuantityField === INITIAL_QUANTITY}>
              <FormattedMessage {...messages[latestQuantityField]} />
            </Label>
            <FormField
              name={quantityName}
              initValue={latestQuantity}
              validator={validation}
              values={values}
            >
              {({ name: fieldName, ...inputHandlers }) => (
                <NumberInputFactory
                  name={fieldName}
                  {...{
                    ...inputHandlers,
                    onBlur: evt => {
                      inputHandlers.onBlur(evt);
                      const newBatch = updateBatchCardQuantity(batch, evt.target.value || 0);
                      saveOnBlur(newBatch);
                    },
                  }}
                  originalValue={latestQuantity}
                  editable={mergedEditable.quantity}
                  inputWidth="185px"
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
            <FormField name={`batches.${id}.deliveredAt`} initValue={deliveredAt}>
              {({ name: fieldName, ...inputHandlers }) => (
                <DateInputFactory
                  name={fieldName}
                  {...inputHandlers}
                  onBlur={evt => {
                    inputHandlers.onBlur(evt);
                    saveOnBlur({
                      ...batch,
                      deliveredAt: evt?.target?.value || null,
                    });
                  }}
                  originalValue={deliveredAt}
                  editable={mergedEditable.deliveredAt}
                  inputWidth="120px"
                  inputHeight="20px"
                  handleTimezone
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
            <FormField name={`batches.${id}.desiredAt`} initValue={desiredAt}>
              {({ name: fieldName, ...inputHandlers }) => (
                <DateInputFactory
                  name={fieldName}
                  {...inputHandlers}
                  onBlur={evt => {
                    inputHandlers.onBlur(evt);
                    saveOnBlur({
                      ...batch,
                      desiredAt: evt?.target?.value || null,
                    });
                  }}
                  originalValue={desiredAt}
                  editable={mergedEditable.desiredAt}
                  inputWidth="120px"
                  inputHeight="20px"
                  handleTimezone
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
                <Display blackout={!mergedViewable.price}>
                  <FormattedNumber
                    value={(price && price.amount ? price.amount : 0) * latestQuantity}
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
            <RelateEntity
              link={mergedNavigable.order ? `/order/${encodeId(order.id)}` : ''}
              entity="ORDER"
              value={order.poNo}
            />
          </div>

          <div className={ShipmentWrapperStyle}>
            <RelateEntity
              link={
                mergedNavigable.shipment ? `/shipment/${shipment ? encodeId(shipment.id) : ''}` : ''
              }
              entity="SHIPMENT"
              value={getByPathWithDefault(null, 'no', shipment)}
            />
          </div>

          <div className={TagsAndTaskWrapperStyle}>
            <div className={BatchTagsWrapperStyle}>
              {tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
            </div>
            <TaskRing {...todo} blackout={!mergedViewable.tasks} />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

ContainerBatchCard.defaultProps = defaultProps;

export default withForbiddenCard(ContainerBatchCard, 'batch', {
  width: '195px',
  height: '331px',
  entityIcon: 'BATCH',
  entityColor: 'BATCH',
});
