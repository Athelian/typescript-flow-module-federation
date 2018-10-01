// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import FormattedNumber from 'components/FormattedNumber';
import FormattedDate from 'components/FormattedDate';
import { FieldItem, Label, Display } from 'components/Form';
import BaseCard, { CardAction } from '../BaseCard';
import {
  BatchCardWrapperStyle,
  ProductWrapperStyle,
  ProductImageStyle,
  ProductInfoWrapperStyle,
  ProductNameStyle,
  ProductSerialStyle,
  ProductSupplierStyle,
  ProductIconLinkStyle,
  BatchInfoWrapperStyle,
  BatchNoWrapperStyle,
  DividerStyle,
  OrderWrapperStyle,
  OrderIconStyle,
  ShipmentWrapperStyle,
  ShipmentIconStyle,
  BatchTagsWrapperStyle,
} from './style';

type Props = {
  batch: ?Object,
};

const BatchCard = ({ batch }: Props) => {
  if (!batch) return '';

  const actions = [<CardAction icon="CLONE" onClick={() => {}} />];

  const { id, no, quantity, deliveredAt, orderItem, shipment } = batch;
  const {
    productProvider: { product, supplier, exporter },
    order,
  } = orderItem;

  const productImage =
    product.files && product.files.length > 0 ? product.files[0].path : FALLBACK_IMAGE;

  const totalAdjustment = batch.batchAdjustments
    ? batch.batchAdjustments.reduce((total, adjustment) => adjustment.quantity + total, 0)
    : 0;

  return (
    <BaseCard icon="BATCH" color="BATCH" actions={actions}>
      <Link className={BatchCardWrapperStyle} to={`/batch/${encodeId(id)}`}>
        <div className={ProductWrapperStyle}>
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
          <div className={BatchNoWrapperStyle}>
            <Display align="left">{no}</Display>
          </div>

          <FieldItem
            label={<Label>QUANTITY</Label>}
            input={
              <Display>
                <FormattedNumber value={quantity + totalAdjustment} />
              </Display>
            }
          />

          <FieldItem
            label={<Label>DELIVERY</Label>}
            input={
              <Display>
                <FormattedDate value={deliveredAt} />
              </Display>
            }
          />

          <div className={DividerStyle} />

          <FieldItem
            label={<Label>UNIT PRICE</Label>}
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
            label={<Label>TTL PRICE</Label>}
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
            label={<Label>TTL VOL</Label>}
            input={
              <Display>
                {batch.packageVolume &&
                  batch.packageVolume.value && (
                    <FormattedNumber
                      value={batch.packageVolume.value * quantity}
                      suffix={batch.packageVolume && batch.packageVolume.metric}
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
            <Display align="left">
              {batch.orderItem && batch.orderItem.order && batch.orderItem.order.poNo}
            </Display>
          </div>

          <div className={ShipmentWrapperStyle}>
            <Link
              className={ShipmentIconStyle(!!shipment)}
              to={shipment ? `/shipment/${encodeId(shipment.id)}` : '.'}
              onClick={evt => {
                evt.stopPropagation();
              }}
            >
              <Icon icon="SHIPMENT" />
            </Link>
            <Display align="left">{shipment && shipment.no}</Display>
          </div>

          <div className={BatchTagsWrapperStyle}>
            {batch.tags.length > 0 && batch.tags.map(tag => <Tag key={tag.id} tag={tag} />)}
          </div>
        </div>
      </Link>
    </BaseCard>
  );
};

export default BatchCard;
