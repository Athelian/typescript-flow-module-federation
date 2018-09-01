// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import type { BatchListCard } from './type.js.flow';
import BaseCard, { CardAction } from '../BaseCard';
import { BatchCardWrapperStyle } from './style';

type Props = {
  batch: ?BatchListCard,
};

const BatchCard = ({ batch }: Props) => {
  if (!batch) return null;

  const { id } = batch;

  const actions = [
    <CardAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <CardAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <BaseCard icon="BATCH" color="BATCH" actions={actions}>
      <div
        className={BatchCardWrapperStyle}
        onClick={() => navigate(`/batch/${encodeId(id)}`)}
        role="presentation"
      >
        {id}
      </div>
    </BaseCard>
  );
};

export default BatchCard;
