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
  BaseText,
  QuantityRow,
  QuantityInput,
  Divider,
  DetailWrapper,
  LightIconWrapper,
  GrayIconWrapper,
  GrayCircleIconWrapper,
  GrayLabel,
  TagWrapper,
} from './style';

type Props = {
  batch: Object,
};
const BatchCard = ({ batch }: Props) => {
  const { tags } = batch;

  const arrivalDates = getByPathWithDefault(
    [],
    'shipment.containerGroups.0.warehouseArrival.timelineDateRevisions',
    batch
  );

  const arrivalDate =
    arrivalDates.length > 0
      ? arrivalDates[arrivalDates.length - 1].date
      : getByPathWithDefault('', 'shipment.containerGroups.0.warehouseArrival.date', batch);

  return (
    <BaseCard icon="BATCH" color="BATCH">
      <div className={CardWrapper}>
        <div className={BatchRow}>{batch.no}</div>
        <div className={QuantityRow}>
          <div className={GrayLabel}>QUANTITY</div>
          <div className={QuantityInput}>{batch.quantity}</div>
        </div>
        <div className={Divider} />
        <div className={DetailWrapper}>
          <div className={LightIconWrapper}>
            <Icon icon="ORDER" />
          </div>
          <div className={BaseText}>{getByPathWithDefault('', 'orderItem.order.poNo', batch)}</div>
        </div>
        <div className={DetailWrapper}>
          {getByPath('shipment', batch) ? (
            <div className={LightIconWrapper}>
              <Icon icon="SHIPMENT" />
            </div>
          ) : (
            <div className={GrayIconWrapper}>
              <Icon icon="SHIPMENT" />
            </div>
          )}
          <div className={BaseText}> {getByPathWithDefault('', 'shipment.no', batch)}</div>
        </div>
        <div className={DetailWrapper}>
          {getByPath('shipment.containerGroups.0.warehouseArrival.approvedAt', batch) ? (
            <div className={LightIconWrapper}>
              <Icon icon="WAREHOUSE" />
            </div>
          ) : (
            <div className={GrayCircleIconWrapper}>
              <Icon icon="WAREHOUSE" />
            </div>
          )}
          <div className={GrayLabel}>ARRIVAL</div>
          <div>
            <FormattedDate value={arrivalDate} mode="date" />
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
