// @flow
import React from 'react';
import BaseCard from 'components/Cards';
import Tag from 'components/Tag';
import Icon from 'components/Icon';
import FormattedDate from 'components/FormattedDate';
import { getByPathWithDefault } from 'utils/fp';
import * as Style from './style';

type Props = {
  batch: Object,
};
const BatchCard = ({ batch }: Props) => {
  const { tags, deliveredAt } = batch;
  return (
    <BaseCard icon="BATCH" color="BATCH">
      <div className={Style.CardWrapper}>
        <div className={Style.BatchRow}>{batch.no}</div>
        <div className={Style.QuantityRow}>
          <div className={Style.SecondaryTitle}>QUANTITY</div>
          <div className={Style.QuantityInput}>{batch.quantity}</div>
        </div>
        <div className={Style.Divider} />
        <div className={Style.DetailWrapper}>
          <div className={Style.IconWrapper}>
            <Icon icon="ORDER" />
          </div>
          {getByPathWithDefault('', 'orderItem.order.poNo', batch)}
        </div>
        <div className={Style.DetailWrapper}>
          <div className={Style.IconWrapper}>
            <Icon icon="SHIPMENT" />
          </div>
          {getByPathWithDefault('', 'shipment.no', batch)}
        </div>
        <div className={Style.DetailWrapper}>
          <div className={Style.SecondaryIconWrapper}>
            <Icon icon="WAREHOUSE" />
          </div>
          <div className={Style.SecondaryTitle}>ARRIVAL</div>
          <div>
            <FormattedDate value={deliveredAt} mode="date" />
          </div>
        </div>
        <div className={Style.TagWrapper}>
          {tags && tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
        </div>
      </div>
    </BaseCard>
  );
};

export default BatchCard;
