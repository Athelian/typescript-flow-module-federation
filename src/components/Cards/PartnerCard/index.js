// @flow
import React from 'react';
import { type Partner } from 'modules/partner/type.js.flow';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import BaseCard, { CardAction } from '../BaseCard';
import { PartnerCardStyle, PartnerCardImageStyle, PartnerNameStyle } from './style';

type OptionalProps = {
  onClick: Function,
  size: 'full' | 'half' | 'quarter',
  selectable: boolean,
  readOnly: boolean,
};

type Props = OptionalProps & {
  partner: ?Partner,
};

const defaultProps = {
  onClick: () => {},
  size: 'full',
  selectable: false,
  readOnly: false,
};

const PartnerCard = ({ partner, onClick, size, selectable, readOnly, ...rest }: Props) => {
  if (!partner) return '';

  const { name } = partner;

  const actions = selectable
    ? []
    : [
        <CardAction icon="CLONE" onClick={() => {}} />,
        <CardAction icon="ARCHIVE" onClick={() => {}} />,
      ];

  return (
    <BaseCard
      {...rest}
      actions={actions}
      icon="PARTNER"
      color="PARTNER"
      selectable={selectable}
      readOnly={readOnly}
    >
      <div className={PartnerCardStyle(size)} role="presentation" onClick={onClick}>
        <img className={PartnerCardImageStyle} src={FALLBACK_IMAGE} alt="exporter_image" />
        <div className={PartnerNameStyle}>{name}</div>
      </div>
    </BaseCard>
  );
};

PartnerCard.defaultProps = defaultProps;

export default PartnerCard;
