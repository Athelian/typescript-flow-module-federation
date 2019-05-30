// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { isForbidden } from 'utils/data';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import FormattedNumber from 'components/FormattedNumber';
import FormattedDate from 'components/FormattedDate';
import { getProductImage } from 'components/Cards/utils';
import withForbiddenCard from 'hoc/withForbiddenCard';
import { FieldItem, Label, Display } from 'components/Form';
import TaskRing from 'components/TaskRing';
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
  OrderIconStyle,
  ShipmentWrapperStyle,
  ShipmentIconStyle,
  ContainerWrapperStyle,
  ContainerIconStyle,
  TagsAndTaskWrapperStyle,
  BatchTagsWrapperStyle,
  ImporterWrapperStyle,
} from './style';

type OptionalProps = {
  actions: Array<React.Node>,
};

type Props = OptionalProps & {
  batch: Object,
};

const defaultProps = {
  actions: [],
};

const BatchCard = ({ batch, actions, ...rest }: Props) => {
  const {
    id,
    archived,
    no,
    latestQuantity,
    deliveredAt,
    desiredAt,
    packageVolume,
    packageQuantity,
    orderItem,
    shipment,
    container,
    todo,
  } = batch;
  const {
    productProvider: { product, name: productProviderName },
    order,
    price,
  } = orderItem;

  const { importer, exporter } = order;

  const productImage = getProductImage(product);

  return (
    <BaseCard icon="BATCH" color="BATCH" actions={actions} isArchived={archived} {...rest}>
      <div
        className={BatchCardWrapperStyle}
        onClick={() => navigate(`/batch/${encodeId(id)}`)}
        role="presentation"
      >
        <div className={ProductWrapperStyle}>
          <img className={ProductImageStyle} src={productImage} alt="product_image" />

          <div className={ProductInfoWrapperStyle}>
            {product && product.id && (
              <>
                <div className={ProductNameWrapperStyle}>
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

          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.quantity" defaultMessage="QUANTITY" />
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
                <FormattedMessage id="components.cards.unitPrice" defaultMessage="UNIT PRICE" />
              </Label>
            }
            input={
              <Display>
                <FormattedNumber
                  value={orderItem.price && orderItem.price.amount ? orderItem.price.amount : 0}
                  suffix={order.currency || (orderItem.price && orderItem.currency)}
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
                  suffix={order.currency || (orderItem.price && orderItem.currency)}
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

          <div className={ShipmentWrapperStyle}>
            <Link
              className={ShipmentIconStyle(!!shipment)}
              to={shipment && shipment.id ? `/shipment/${encodeId(shipment.id)}` : '.'}
              onClick={evt => {
                evt.stopPropagation();
              }}
            >
              <Icon icon="SHIPMENT" />
            </Link>
            <Display blackout={isForbidden(shipment)} align="left">
              {shipment && shipment.no}
            </Display>
          </div>

          <div className={ContainerWrapperStyle}>
            <Link
              className={ContainerIconStyle(!!container)}
              to={container && container.id ? `/container/${encodeId(container.id)}` : '.'}
              onClick={evt => {
                evt.stopPropagation();
              }}
            >
              <Icon icon="CONTAINER" />
            </Link>
            <Display blackout={isForbidden(container)} align="left">
              {container && container.no}
            </Display>
          </div>
          <div className={TagsAndTaskWrapperStyle}>
            <div className={BatchTagsWrapperStyle}>
              {batch.tags.length > 0 && batch.tags.map(tag => <Tag key={tag.id} tag={tag} />)}
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
  height: '406px',
  entityIcon: 'BATCH',
  entityColor: 'BATCH',
});
