// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { type Partner } from 'modules/partner/type.js.flow';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import BaseCard, { CardAction } from '../BaseCard';
import { PartnerCardWrapperStyle } from './style';

type Props = {
  partner: ?Partner,
  onClick?: (id: string) => void,
  selectable?: boolean,
};

const defaultProps = {
  onClick: id => navigate(`/partner/${encodeId(id)}`),
  selectable: false,
};

const PartnerCard = ({ partner, onClick, selectable, ...rest }: Props) => {
  if (!partner) return '';

  const { id } = partner;

  const actions = selectable
    ? []
    : [
        <CardAction icon="CLONE" onClick={() => logger.warn('clone')} />,
        <CardAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
        <CardAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
      ];

  return (
    <BaseCard icon="PARTNER" color="PARTNER" actions={actions} selectable={selectable} {...rest}>
      <div className={PartnerCardWrapperStyle} onClick={onClick} role="presentation">
        {id}
      </div>
    </BaseCard>
  );
};

PartnerCard.defaultProps = defaultProps;

export default PartnerCard;
