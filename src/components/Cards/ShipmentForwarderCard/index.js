// @flow
import React from 'react';
import { type Partner } from 'modules/partner/type.js.flow';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import BaseCard from '../BaseCard';
import { ForwarderCardStyle, ForwarderCardImageStyle, ForwarderNameStyle } from './style';

type OptionalProps = {
  onClick: Function,
  size: 'full' | 'half' | 'quarter',
};

type Props = OptionalProps & {
  forwarder: ?Partner,
};

const defaultProps = {
  onClick: () => {},
  size: 'full',
};

const ShipmentForwarderCard = ({ forwarder, onClick, size, ...rest }: Props) => {
  if (!forwarder) return '';

  const { name } = forwarder;

  return (
    <BaseCard {...rest} icon="PARTNER" color="PARTNER">
      <div className={ForwarderCardStyle(size)} role="presentation" onClick={onClick}>
        <img className={ForwarderCardImageStyle} src={FALLBACK_IMAGE} alt="forwarder_image" />
        <div className={ForwarderNameStyle}>{name}</div>
      </div>
    </BaseCard>
  );
};

ShipmentForwarderCard.defaultProps = defaultProps;

export default ShipmentForwarderCard;
