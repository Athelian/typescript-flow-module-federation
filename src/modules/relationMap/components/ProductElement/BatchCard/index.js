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
  const { tags } = batch;
  return (
    <BaseCard icon="BATCH" color="BATCH">
      <Style.CardWrapper>
        <Style.BatchRow>{batch.no}</Style.BatchRow>
        <Style.QuantityRow>
          <Style.SecondaryTitle>QUANTITY</Style.SecondaryTitle>
          <Style.QuantityInput>{batch.quantity}</Style.QuantityInput>
        </Style.QuantityRow>
        <Style.Divider />
        <Style.DetailWrapper>
          <Style.IconWrapper>
            <Icon icon="ORDER" />
          </Style.IconWrapper>
          {getByPathWithDefault('', 'orderItem.order.poNo', batch)}
        </Style.DetailWrapper>
        <Style.DetailWrapper>
          <Style.IconWrapper>
            <Icon icon="SHIPMENT" />
          </Style.IconWrapper>
          {getByPathWithDefault('', 'shipment.blNo', batch)}
        </Style.DetailWrapper>
        <Style.DetailWrapper>
          <Style.SecondaryIconWrapper>
            <Icon icon="WAREHOUSE" />
          </Style.SecondaryIconWrapper>
          <Style.SecondaryTitle>ARRIVAL</Style.SecondaryTitle>
          <div>
            <FormattedDate value={getByPathWithDefault('', 'shipment.blDate', batch)} mode="date" />
          </div>
        </Style.DetailWrapper>
        <Style.TagWrapper>
          {tags && tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
        </Style.TagWrapper>
      </Style.CardWrapper>
    </BaseCard>
  );
};

export default BatchCard;
