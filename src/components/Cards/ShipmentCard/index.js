// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { isEnableBetaFeature } from 'utils/env';
import Tag from 'components/Tag';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { Label } from 'components/Form';
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
  ShipmentDataWrapperStyle,
  ShipmentInChargeWrapperStyle,
  ShipmentBadgeWrapperStyle,
  ShipmentBadgeIconStyle,
  ShipmentBadgeStyle,
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

  const {
    id,
    no,
    blNo,
    tags,
    inCharges,
    batchCount,
    orderItemCount,
    totalVolume,
    containers,
  } = shipment;

  return (
    <BaseCard icon="SHIPMENT" color="SHIPMENT" actions={actions} {...rest}>
      <div
        className={ShipmentCardWrapperStyle}
        onClick={() => navigate(`/shipment/${encodeId(id)}`)}
        role="presentation"
      >
        <div className={ShipmentInfoWrapperStyle}>
          <div className={ShipmentLeftWrapperStyle}>
            <div className={ShipmentNoStyle}>{no}</div>
            <div className={ShipmentBLStyle}>{blNo}</div>
          </div>
          <div className={ShipmentRightWrapperStyle}>
            <div className={ShipmentTagsWrapperStyle}>
              {tags && tags.length > 0 && tags.map(tag => <Tag key={tag.id} tag={tag} />)}
            </div>
            <div className={ShipmentDataWrapperStyle}>
              <div className={ShipmentInChargeWrapperStyle}>
                {inCharges &&
                  inCharges.length > 0 &&
                  inCharges.map(inCharge => (
                    <UserAvatar
                      key={inCharge.id}
                      firstName={inCharge.firstName}
                      lastName={inCharge.lastName}
                      width="20px"
                      height="20px"
                    />
                  ))}
              </div>

              <div className={ShipmentBadgeWrapperStyle}>
                <Label>
                  <FormattedMessage id="components.cards.ttlVol" defaultValue="TTL VOL" />
                </Label>
                <div className={ShipmentBadgeStyle}>
                  <FormattedNumber value={totalVolume.value} />
                  {totalVolume.metric}
                </div>
              </div>

              {isEnableBetaFeature && (
                <div className={ShipmentBadgeWrapperStyle}>
                  <div className={ShipmentBadgeIconStyle}>
                    <Icon icon="CONTAINER" />
                  </div>
                  <div className={ShipmentBadgeStyle}>
                    <FormattedNumber value={containers ? containers.length : 0} />
                  </div>
                </div>
              )}

              <div className={ShipmentBadgeWrapperStyle}>
                <div className={ShipmentBadgeIconStyle}>
                  <Icon icon="ORDER_ITEM" />
                </div>
                <div className={ShipmentBadgeStyle}>
                  <FormattedNumber value={orderItemCount} />
                </div>
              </div>

              <div className={ShipmentBadgeWrapperStyle}>
                <div className={ShipmentBadgeIconStyle}>
                  <Icon icon="BATCH" />
                </div>
                <div className={ShipmentBadgeStyle}>
                  <FormattedNumber value={batchCount} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={DividerStyle} />
        <HorizontalLayout shipment={shipment} />
      </div>
    </BaseCard>
  );
};

ShipmentCard.defaultProps = defaultProps;

export default ShipmentCard;
