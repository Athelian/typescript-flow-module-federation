// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { getBatchLatestQuantity } from 'utils/batch';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import Tag from 'components/Tag';
import FormattedNumber from 'components/FormattedNumber';
import { getByPathWithDefault } from 'utils/fp';
import { FieldItem, Label, Display } from 'components/Form';
import TaskRing from 'components/TaskRing';
import withForbiddenCard from 'hoc/withForbiddenCard';
import { getProductImage } from 'components/Cards/utils';
import BaseCard from 'components/Cards/BaseCard';
import FormattedDate from 'components/FormattedDate';
import {
  BatchCardWrapperStyle,
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
  DividerStyle,
  OrderWrapperStyle,
  OrderIconStyle,
  ContainerWrapperStyle,
  ContainerIconStyle,
  OrderInChargeWrapperStyle,
  InChargeWrapperStyle,
  TagsAndTaskWrapperStyle,
  BatchTagsWrapperStyle,
  ImporterWrapperStyle,
} from './style';

type OptionalProps = {
  onClick: (batch: Object) => void,
  viewable: {
    price: boolean,
    tasks: boolean,
  },
};

type Props = OptionalProps & {
  batch: Object,
  currency: string,
  saveOnBlur: Function,
};

const viewableDefault = {
  price: false,
  tasks: false,
};

const defaultProps = {
  onClick: () => {},
};

const BatchCardInSelectPage = ({ batch, onClick, currency, viewable, ...rest }: Props) => {
  const {
    archived,
    no,
    quantity,
    deliveredAt,
    desiredAt,
    batchQuantityRevisions,
    packageVolume,
    packageQuantity,
    tags,
    container,
    orderItem: {
      price,
      productProvider: { name: productProviderName, product },
      order,
    },
    todo,
  } = batch;

  const mergedViewable = { ...viewableDefault, ...viewable };

  const latestQuantity = getBatchLatestQuantity({ quantity, batchQuantityRevisions });

  const productImage = getProductImage(product);

  const { importer, exporter } = order;

  return (
    <BaseCard
      icon="BATCH"
      color="BATCH"
      showActionsOnHover
      selectable
      isArchived={archived}
      {...rest}
    >
      <div
        className={BatchCardWrapperStyle}
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
            <div className={ProductNameWrapperStyle}>
              <div className={ProductIconLinkStyle}>
                <Icon icon="PRODUCT" />
              </div>

              <div className={ProductNameStyle}>{product.name}</div>
            </div>

            <div className={ProductSerialStyle}>{product.serial}</div>

            <div className={ProductProviderNameStyle}>
              <Icon icon="PRODUCT_PROVIDER" />
              {productProviderName}
            </div>
          </div>
        </div>

        <div className={BatchInfoWrapperStyle}>
          <div className={BatchNoWrapperStyle}>
            <Display align="left">{no}</Display>
          </div>

          <div className={ImporterWrapperStyle}>
            <Icon icon="IMPORTER" />
            {importer && importer.name}
          </div>
          <div className={ImporterWrapperStyle}>
            <Icon icon="EXPORTER" />
            {exporter && exporter.name}
          </div>

          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.qty" defaultMessage="QTY" />
              </Label>
            }
            input={
              <Display>
                <FormattedNumber value={latestQuantity} />
              </Display>
            }
          />

          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.delivery" defaultMessage="DELIVERY" />
              </Label>
            }
            input={
              <Display>
                <FormattedDate value={deliveredAt} />
              </Display>
            }
          />

          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.desiredAt" defaultMessage="DESIRED" />
              </Label>
            }
            input={
              <Display>
                <FormattedDate value={desiredAt} />
              </Display>
            }
          />

          <div className={DividerStyle} />

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

          <div className={OrderWrapperStyle}>
            <div className={OrderIconStyle}>
              <Icon icon="ORDER" />
            </div>
            <Display align="left">{order.poNo}</Display>
          </div>

          <div className={ContainerWrapperStyle}>
            <div className={ContainerIconStyle(false)}>
              <Icon icon="CONTAINER" />
            </div>
            <Display align="left">{getByPathWithDefault(null, 'no', container)}</Display>
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

BatchCardInSelectPage.defaultProps = defaultProps;

export default withForbiddenCard(BatchCardInSelectPage, 'batch', {
  width: '195px',
  height: '416px',
  entityIcon: 'BATCH',
  entityColor: 'BATCH',
});
