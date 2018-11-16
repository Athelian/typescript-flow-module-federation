// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import QuantityChart from 'components/QuantityChart';
import FormattedNumber from 'components/FormattedNumber';
import FormattedDate from 'components/FormattedDate';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import Tag from 'components/Tag';
import { Label, Display, FieldItem } from 'components/Form';
import BaseCard from '../BaseCard';
import {
  OrderCardWrapperStyle,
  OrderInfoWrapperStyle,
  PONoWrapperStyle,
  ExporterWrapperStyle,
  DividerStyle,
  ChartWrapperStyle,
  InChargeWrapperStyle,
  TagsWrapperStyle,
} from './style';

type OptionalProps = {
  actions: Array<React.Node>,
};

type Props = OptionalProps & {
  order: ?Object,
};

const defaultProps = {
  actions: [],
};

const OrderCard = ({ order, actions, ...rest }: Props) => {
  if (!order) return '';

  const { id, poNo, issuedAt: poDate, orderItems, currency, exporter, inCharges } = order;

  const totalItems = orderItems.length;

  let totalPrice = 0;
  orderItems.forEach(item => {
    totalPrice += item.price ? item.price.amount * item.quantity : 0;
  });

  let orderedQuantity = 0;
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let numOfBatched = 0;
  let numOfShipped = 0;

  orderItems.forEach(item => {
    orderedQuantity += item.quantity || 0;

    if (item.batches) {
      item.batches.forEach(batch => {
        batchedQuantity += batch.quantity;
        numOfBatched += 1;

        let currentQuantity = batch.quantity;

        if (batch.batchAdjustments) {
          batch.batchAdjustments.forEach(batchAdjustment => {
            batchedQuantity += batchAdjustment.quantity;
            currentQuantity += batchAdjustment.quantity;
          });
        }

        if (batch.shipment) {
          shippedQuantity += currentQuantity;
          numOfShipped += 1;
        }
      });
    }
  });

  return (
    <BaseCard icon="ORDER" color="ORDER" actions={actions} {...rest}>
      <Link className={OrderCardWrapperStyle} to={`/order/${encodeId(id)}`}>
        <div className={OrderInfoWrapperStyle}>
          <div className={PONoWrapperStyle}>
            <Display align="left">{poNo}</Display>
          </div>
          <div className={ExporterWrapperStyle}>
            <Icon icon="EXPORTER" />
            {exporter.name}
          </div>
          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.ttlPrice" defaultMessage="TTL PRICE" />
              </Label>
            }
            input={
              <Display>
                <FormattedNumber value={totalPrice} suffix={currency} />
              </Display>
            }
          />
          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.ttlItems" defaultMessage="TTL ITEMS" />
              </Label>
            }
            input={
              <Display>
                <FormattedNumber value={totalItems} />
              </Display>
            }
          />
          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.poDate" defaultMessage="PO DATE" />
              </Label>
            }
            input={
              <Display>
                <FormattedDate value={poDate} />
              </Display>
            }
          />
          <div className={DividerStyle} />
          <div className={ChartWrapperStyle}>
            <QuantityChart
              hasLabel={false}
              orderedQuantity={orderedQuantity}
              batchedQuantity={batchedQuantity}
              shippedQuantity={shippedQuantity}
              batched={numOfBatched}
              shipped={numOfShipped}
            />
          </div>
          <div className={InChargeWrapperStyle}>
            {inCharges &&
              inCharges.map(inCharge => (
                <UserAvatar
                  firstName={inCharge.firstName}
                  lastName={inCharge.lastName}
                  key={inCharge.id}
                />
              ))}
          </div>
          <div className={TagsWrapperStyle}>
            {order.tags.length > 0 && order.tags.map(tag => <Tag key={tag.id} tag={tag} />)}
          </div>
        </div>
      </Link>
    </BaseCard>
  );
};

OrderCard.defaultProps = defaultProps;

export default OrderCard;
