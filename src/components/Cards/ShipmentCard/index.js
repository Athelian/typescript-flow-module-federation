// @flow
import React from 'react';
import { Link } from '@reach/router';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import Tag from 'components/Tag';
import { HorizontalLayout } from 'modules/shipment/form/components/TimelineSection/components/Timeline';
import BaseCard, { CardAction } from '../BaseCard';
import {
  ShipmentCardWrapperStyle,
  ShipmentInfoWrapperStyle,
  ShipmentLeftWrapperStyle,
  ShipmentNoStyle,
  ShipmentBLStyle,
  ShipmentRightWrapperStyle,
  ShipmentTagsWrapperStyle,
  DividerStyle,
} from './style';

type Props = {
  shipment: ?Object,
};

const ShipmentCard = ({ shipment }: Props) => {
  if (!shipment) return '';

  const { id } = shipment;

  const actions = [
    <CardAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <CardAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
  ];

  return (
    <BaseCard icon="SHIPMENT" color="SHIPMENT" actions={actions}>
      <Link className={ShipmentCardWrapperStyle} to={`/shipment/${encodeId(id)}`}>
        <div className={ShipmentInfoWrapperStyle}>
          <div className={ShipmentLeftWrapperStyle}>
            <div className={ShipmentNoStyle}>{shipment.no}</div>
            <div className={ShipmentBLStyle}>{shipment.blNo}</div>
          </div>
          <div className={ShipmentRightWrapperStyle}>
            <div className={ShipmentTagsWrapperStyle}>
              {shipment.tags.length > 0 && shipment.tags.map(tag => <Tag key={tag.id} tag={tag} />)}
            </div>
          </div>
        </div>
        <div className={DividerStyle} />
        <HorizontalLayout shipment={shipment} />
      </Link>
    </BaseCard>
  );
};

export default ShipmentCard;
