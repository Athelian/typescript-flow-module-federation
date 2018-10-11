// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import Tag from 'components/Tag';
import { HorizontalLayout } from 'modules/shipment/form/components/TimelineSection/components/Timeline';
import BaseCard from '../BaseCard';
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

type OptionalProps = {
  actions: Array<React.Node>,
};

type Props = OptionalProps & {
  shipment: ?Object,
};

const defaultProps = {
  actions: [],
};

const ShipmentCard = ({ shipment, actions, ...rest }: Props) => {
  if (!shipment) return '';

  const { id } = shipment;

  return (
    <BaseCard icon="SHIPMENT" color="SHIPMENT" actions={actions} {...rest}>
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

ShipmentCard.defaultProps = defaultProps;

export default ShipmentCard;
