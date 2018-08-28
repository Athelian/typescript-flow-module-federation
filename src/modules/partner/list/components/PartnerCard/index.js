// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { type Partner } from 'modules/partner/type.js.flow';
import BaseCard, { CardAction } from 'components/Cards';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import { PartnerCardWrapperStyle } from './style';

type Props = {
  partner: ?Partner,
  onClick?: (id: string) => void,
};

const defaultProps = {
  onClick: id => navigate(`/partner/${encodeId(id)}`),
};

const PartnerCard = ({ partner, onClick, ...rest }: Props) => {
  if (!partner) return '';

  const { id } = partner;

  const actions = [
    <CardAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <CardAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <CardAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <BaseCard icon="PARTNER" color="PARTNER" actions={actions} {...rest}>
      <div className={PartnerCardWrapperStyle} onClick={onClick} role="presentation">
        {id}
      </div>
    </BaseCard>
  );
};

PartnerCard.defaultProps = defaultProps;

export default PartnerCard;
