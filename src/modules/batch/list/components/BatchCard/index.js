// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import type { BatchItem } from 'modules/batch/type.js.flow';
import EntityCard, { EntityAction } from 'components/EntityCard';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import { BatchCardWrapperStyle } from './style';

type Props = {
  batch: ?BatchItem,
};

const BatchCard = ({ batch }: Props) => {
  if (!batch) return null;

  const { id } = batch;

  const actions = [
    <EntityAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <EntityAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <EntityCard icon="BATCH" color="BATCH" actions={actions}>
      <div
        className={BatchCardWrapperStyle}
        onClick={() => navigate(`/batch/${encodeId(id)}`)}
        role="presentation"
      >
        {id}
      </div>
    </EntityCard>
  );
};

export default BatchCard;
