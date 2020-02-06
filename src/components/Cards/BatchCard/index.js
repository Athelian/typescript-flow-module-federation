// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import type { Batch } from 'generated/graphql';
import { encodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import { defaultVolumeMetric } from 'utils/metric';
import { isForbidden } from 'utils/data';
import messages from 'modules/batch/messages';
import { findActiveQuantityField } from 'utils/batch';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import ProductImage from 'components/ProductImage';
import FormattedNumber from 'components/FormattedNumber';
import FormattedDate from 'components/FormattedDate';
import RelateEntity from 'components/RelateEntity';
import withForbiddenCard from 'hoc/withForbiddenCard';
import { FieldItem, Label, Display } from 'components/Form';
import TaskRing from 'components/TaskRing';
import {
  PRODUCED_QUANTITY,
  PRE_SHIPPED_QUANTITY,
  SHIPPED_QUANTITY,
  POST_SHIPPED_QUANTITY,
  DELIVERED_QUANTITY,
} from 'modules/batch/constants';
import BaseCard from '../BaseCard';
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
  ShipmentWrapperStyle,
  ContainerWrapperStyle,
  TagsAndTaskWrapperStyle,
  BatchTagsWrapperStyle,
  ImporterWrapperStyle,
  QuantityWrapperStyle,
} from './style';

type Props = {|
  batch: Batch,
  onClick?: Function,
|};

const defaultProps = {
  onClick: () => {},
};

const BatchCard = ({ batch, onClick, ...rest }: Props) => {
  const {
    no,
    archived,
    latestQuantity = 0,
    deliveredAt,
    desiredAt,
    packageQuantity = 0,
    tags = [],
    shipment,
    container,
    todo,
  } = batch;

  const latestQuantityField: string = findActiveQuantityField({
    [PRODUCED_QUANTITY]: batch?.[PRODUCED_QUANTITY],
    [PRE_SHIPPED_QUANTITY]: batch?.[PRE_SHIPPED_QUANTITY],
    [SHIPPED_QUANTITY]: batch?.[SHIPPED_QUANTITY],
    [POST_SHIPPED_QUANTITY]: batch?.[POST_SHIPPED_QUANTITY],
    [DELIVERED_QUANTITY]: batch?.[DELIVERED_QUANTITY],
  });
  const packageVolume = batch.packageVolume || {
    metric: defaultVolumeMetric,
    value: 0,
  };
  const order = getByPathWithDefault({}, 'orderItem.order', batch);
  const price = getByPathWithDefault(null, 'orderItem.price', batch);
  const currency = getByPathWithDefault(null, 'orderItem.currency', batch);
  const product = getByPathWithDefault(null, 'orderItem.productProvider.product', batch);
  const productProviderName = getByPathWithDefault('', 'orderItem.productProvider.name', batch);
  const importer = getByPathWithDefault(null, 'orderItem.order.importer', batch);
  const exporter = getByPathWithDefault(null, 'orderItem.order.exporter', batch);

  return (
    <BaseCard
      icon="BATCH"
      color="BATCH"
      isArchived={archived}
      showBadge={batch?.notificationUnseenCount > 0}
      {...rest}
    >
      <div className={BatchCardWrapperStyle} onClick={onClick} role="presentation">
        <div className={ProductWrapperStyle}>
          <ProductImage
            className={ProductImageStyle}
            file={getByPathWithDefault(null, 'files.0', product)}
            height="70px"
          />

          <div className={ProductInfoWrapperStyle}>
            {product && product.id && (
              <>
                <div className={ProductNameWrapperStyle}>
                  {/* $FlowFixMe Flow typed is not updated yet */}
                  <Link
                    className={ProductIconLinkStyle}
                    to={`/product/${encodeId(product.id)}`}
                    onClick={evt => {
                      evt.stopPropagation();
                    }}
                  >
                    <Icon icon="PRODUCT" />
                  </Link>
                  <div className={ProductNameStyle}>{product.name}</div>
                </div>
                <div className={ProductSerialStyle}>{product.serial}</div>
                <div className={ProductProviderNameStyle}>
                  <Icon icon="PRODUCT_PROVIDER" />
                  {productProviderName}
                </div>
              </>
            )}
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

          <div className={QuantityWrapperStyle}>
            <Label>
              <FormattedMessage {...messages[latestQuantityField]} />
            </Label>
            <Display>
              <FormattedNumber value={latestQuantity} />
            </Display>
          </div>

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
                <FormattedMessage id="components.cards.unitPrice" defaultMessage="UNIT PRICE" />
              </Label>
            }
            input={
              <Display>
                <FormattedNumber
                  value={price && price.amount ? price.amount : 0}
                  suffix={order.currency || currency}
                />
              </Display>
            }
          />

          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.ttlPrice" defaultMessage="TTL PRICE" />
              </Label>
            }
            input={
              <Display>
                <FormattedNumber
                  value={(price && price.amount ? price.amount : 0) * latestQuantity}
                  suffix={order.currency || currency}
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
            <RelateEntity
              link={order && order.id ? `/order/${encodeId(order.id)}` : ''}
              entity="ORDER"
              value={order && order.poNo}
            />
          </div>

          <div className={ShipmentWrapperStyle}>
            <RelateEntity
              link={shipment && shipment.id ? `/shipment/${encodeId(shipment.id)}` : ''}
              blackout={isForbidden(shipment)}
              entity="SHIPMENT"
              value={shipment && shipment.no}
            />
          </div>

          <div className={ContainerWrapperStyle}>
            <RelateEntity
              link={container && container.id ? `/container/${encodeId(container.id)}` : ''}
              blackout={isForbidden(container)}
              entity="CONTAINER"
              value={container && container.no}
            />
          </div>
          <div className={TagsAndTaskWrapperStyle}>
            <div className={BatchTagsWrapperStyle}>
              {tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
            </div>
            <TaskRing {...todo} />
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

BatchCard.defaultProps = defaultProps;

export default withForbiddenCard(BatchCard, 'batch', {
  width: '195px',
  height: '426px',
  entityIcon: 'BATCH',
  entityColor: 'BATCH',
});
