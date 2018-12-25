// @flow
import React from 'react';
import BaseCard from 'components/Cards';
import Tag from 'components/Tag';
import Icon from 'components/Icon';
import FormattedDate from 'components/FormattedDate';
import { getByPathWithDefault, getByPath } from 'utils/fp';
import {
  CardWrapper,
  BatchRow,
  QuantityRow,
  SecondaryTitle,
  QuantityInput,
  Divider,
  DetailWrapper,
  IconWrapper,
  GrayIconWrapper,
  SecondaryIconWrapper,
  TagWrapper,
} from './style';

type Props = {
  batch: Object,
};
const BatchCard = ({ batch }: Props) => {
  const { tags, deliveredAt } = batch;
  return (
    <BaseCard icon="BATCH" color="BATCH">
      <div className={CardWrapper}>
        <div className={BatchRow}>{batch.no}</div>
        <div className={QuantityRow}>
          <div className={SecondaryTitle}>QUANTITY</div>
          <div className={QuantityInput}>{batch.quantity}</div>
        </div>
        <div className={Divider} />
        <div className={DetailWrapper}>
          <div className={IconWrapper}>
            <Icon icon="ORDER" />
          </div>
          {getByPathWithDefault('', 'orderItem.order.poNo', batch)}
        </div>
        <div className={DetailWrapper}>
          {getByPath('shipment', batch) ? (
            <div className={IconWrapper}>
              <Icon icon="SHIPMENT" />
            </div>
          ) : (
            <div className={GrayIconWrapper}>
              <Icon icon="SHIPMENT" />
            </div>
          )}
          {getByPathWithDefault('', 'shipment.no', batch)}
        </div>
        <div className={DetailWrapper}>
          <div className={SecondaryIconWrapper}>
            <Icon icon="WAREHOUSE" />
          </div>
          <div className={SecondaryTitle}>ARRIVAL</div>
          <div>
            <FormattedDate value={deliveredAt} mode="date" />
          </div>
        </div>
        <div className={TagWrapper}>
          {tags && tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
        </div>
      </div>
    </BaseCard>
  );
};

export default BatchCard;
