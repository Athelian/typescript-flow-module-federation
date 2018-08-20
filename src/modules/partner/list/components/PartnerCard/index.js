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
};

const PartnerCard = ({ partner }: Props) => {
  if (!partner) return '';

  const { id } = partner;

  const actions = [
    <EntityAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <EntityAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <EntityAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <EntityCard icon="PARTNER" color="PARTNER" actions={actions}>
      <div
        className={PartnerCardWrapperStyle}
        onClick={() => navigate(`/partner/${encodeId(id)}`)}
        role="presentation"
      >
        {id}
      </div>
    </EntityCard>
  );
};

export default PartnerCard;
