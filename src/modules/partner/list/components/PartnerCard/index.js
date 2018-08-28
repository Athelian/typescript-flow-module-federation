// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { type Partner } from 'modules/partner/type.js.flow';
import EntityCard, { EntityAction } from 'components/EntityCard';
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
    <EntityAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <EntityAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <EntityAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <EntityCard icon="PARTNER" color="PARTNER" actions={actions} {...rest}>
      <div className={PartnerCardWrapperStyle} onClick={onClick} role="presentation">
        {id}
      </div>
    </EntityCard>
  );
};

PartnerCard.defaultProps = defaultProps;

export default PartnerCard;
