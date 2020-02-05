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
import messages from 'modules/batch/messages';
import { FormField } from 'modules/form';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import Tag from 'components/Tag';
import ProductImage from 'components/ProductImage';
import FormattedNumber from 'components/FormattedNumber';
import RelateEntity from 'components/RelateEntity';
import { getByPathWithDefault } from 'utils/fp';
import {
  FieldItem,
  Label,
  Display,
  NumberInputFactory,
  TextInputFactory,
  DateInputFactory,
} from 'components/Form';
import {
  INITIAL_QUANTITY,
  PRODUCED_QUANTITY,
  PRE_SHIPPED_QUANTITY,
  SHIPPED_QUANTITY,
  POST_SHIPPED_QUANTITY,
  DELIVERED_QUANTITY,
} from 'modules/batch/constants';
import TaskRing from 'components/TaskRing';
import withForbiddenCard from 'hoc/withForbiddenCard';
import validator from './validator';
import BaseCard, { CardAction } from '../BaseCard';
import {
  ShipmentBatchCardWrapperStyle,
  ProductWrapperStyle,
  ProductImageStyle,
  ProductInfoWrapperStyle,
  ProductNameWrapperStyle,
  ProductIconLinkStyle,
  ProductNameStyle,
  ProductSerialStyle,
  ProductProviderNameStyle,
  RepresentIconStyle,
  BatchInfoWrapperStyle,
  BatchNoWrapperStyle,
  QuantityWrapperStyle,
  DateInputWrapperStyle,
  DividerStyle,
  TotalPriceWrapperStyle,
  VolumeWrapperStyle,
  OrderWrapperStyle,
  ContainerWrapperStyle,
  OrderInChargeWrapperStyle,
  InChargeWrapperStyle,
  TagsAndTaskWrapperStyle,
  BatchTagsWrapperStyle,
  ImporterWrapperStyle,
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
    container: boolean,
  },
  isRepresented: ?boolean,
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
  isRepresented: null,
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
  container: false,
};

const ShipmentBatchCard = ({
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
        mergedEditable.cloneBatch && <CardAction icon="CLONE" onClick={() => onClone(batch)} />,
        mergedEditable.removeBatch && (
          <CardAction icon="CLEAR" hoverColor="RED" onClick={() => onClear(batch)} />
        ),
      ].filter(Boolean);

  const archived = getByPathWithDefault(false, 'archived', batch);
  const id = getByPathWithDefault('', 'id', batch);
  const no = getByPathWithDefault('', 'no', batch);
  const quantity = getByPathWithDefault(0, 'quantity', batch);
  const deliveredAt = getByPathWithDefault('', 'deliveredAt', batch);
  const desiredAt = getByPathWithDefault('', 'desiredAt', batch);
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
  const container = getByPathWithDefault({}, 'container', batch);
  const price = getByPathWithDefault({}, 'orderItem.price', batch);
  const product = getByPathWithDefault({}, 'orderItem.productProvider.product', batch);
  const productProviderName = getByPathWithDefault('', 'orderItem.productProvider.name', batch);
  const todo = getByPathWithDefault({}, 'todo', batch);
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
    no: `batch.${id}.no`,
  });

  const values = {
    [`batch.${id}.no`]: no,
    latestQuantity,
  };

  const { importer, exporter } = order;

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
        className={ShipmentBatchCardWrapperStyle}
        onClick={() => onClick({ ...batch, no, quantity, deliveredAt, desiredAt })}
        role="presentation"
      >
        <div
          className={ProductWrapperStyle}
          onClick={() => onClick({ ...batch, no, quantity, deliveredAt, desiredAt })}
          role="presentation"
        >
          <ProductImage
            height="70px"
            className={ProductImageStyle}
            file={getByPathWithDefault(null, 'files.0', product)}
          />

          <div className={ProductInfoWrapperStyle}>
            <div className={ProductNameWrapperStyle}>
              {mergedNavigable.product && product.id ? (
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

          {isRepresented !== null &&
            (mergedEditable.representativeBatch ? (
              <button
                type="button"
                onClick={evt => {
                  evt.stopPropagation();
                  onClickRepresentative();
                }}
                className={RepresentIconStyle(!!isRepresented)}
              >
                <Icon icon="STAR" />
              </button>
            ) : (
              <div className={RepresentIconStyle(!!isRepresented)}>
                <Icon icon="STAR" />
              </div>
            ))}
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
                  editable={mergedEditable.no}
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

          <div className={ImporterWrapperStyle}>
            <Icon icon="IMPORTER" />
            {importer && importer.name}
          </div>
          <div className={ImporterWrapperStyle}>
            <Icon icon="EXPORTER" />
            {exporter && exporter.name}
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
                  inputWidth="185px"
                  inputHeight="20px"
                  editable={mergedEditable.quantity}
                  {...{
                    ...inputHandlers,
                    onBlur: evt => {
                      inputHandlers.onBlur(evt);
                      const newBatch = updateBatchCardQuantity(batch, evt.target.value || 0);
                      saveOnBlur(newBatch);
                    },
                  }}
                  name={fieldName}
                  isNew={false}
                  originalValue={latestQuantity}
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
                  editable={mergedEditable.deliveredAt}
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
                  editable={mergedEditable.desiredAt}
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
                <Display blackout={!mergedViewable.price}>
                  <FormattedNumber
                    value={(price.amount || 0) * latestQuantity}
                    suffix={currency || price.currency}
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
            <RelateEntity
              link={
                mergedNavigable.order && order && order.id ? `/order/${encodeId(order.id)}` : ''
              }
              entity="ORDER"
              value={order.poNo}
            />
          </div>

          <div className={ContainerWrapperStyle}>
            <RelateEntity
              link={
                mergedNavigable.container && container.id
                  ? `/container/${encodeId(container.id)}`
                  : ''
              }
              entity="CONTAINER"
              value={container.no}
            />
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
            <TaskRing {...todo} blackout={!mergedViewable.tasks} />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

ShipmentBatchCard.defaultProps = defaultProps;

export default withForbiddenCard(ShipmentBatchCard, 'batch', {
  width: '195px',
  height: '437px',
  entityIcon: 'BATCH',
  entityColor: 'BATCH',
});
