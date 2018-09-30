// @flow
import React from 'react';
import BaseCard from 'components/Cards';
import Tag from 'components/Tag';
import Icon from 'components/Icon';
import * as Style from './style';

type Props = {
  item: Object,
};
const BatchCard = ({ item }: Props) => {
  const { tags } = item;
  return (
    <BaseCard icon="BATCH" color="BATCH">
      <Style.CardWrapper>
        <div>CHERRRY_001</div>
        <div>
          <span>Quantity</span>
          <Style.QuantityWrapper>1000</Style.QuantityWrapper>
          <span>1000</span>
        </div>
        <Style.Divider />
        <Style.DetailWrapper>
          <Style.IconWrapper>
            <Icon icon="ORDER" />
          </Style.IconWrapper>
          Order no
        </Style.DetailWrapper>
        <Style.DetailWrapper>
          <Style.IconWrapper>
            <Icon icon="SHIPMENT" />
          </Style.IconWrapper>
          Shipment
        </Style.DetailWrapper>
        <Style.DetailWrapper>
          <Style.SecondaryIconWrapper>
            <Icon icon="WAREHOUSE" />
          </Style.SecondaryIconWrapper>
          warehouse
        </Style.DetailWrapper>
        <Style.TagWrapper>
          {tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
        </Style.TagWrapper>
      </Style.CardWrapper>
    </BaseCard>
  );
};

export default BatchCard;
