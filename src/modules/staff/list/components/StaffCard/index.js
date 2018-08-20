// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { type User as Staff } from 'modules/staff/type.js.flow';
import EntityCard, { EntityAction } from 'components/EntityCard';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import { StaffCardWrapperStyle } from './style';

type Props = {
  staff: ?Staff,
};

const StaffCard = ({ staff }: Props) => {
  if (!staff) return '';

  const { id } = staff;

  const actions = [
    <EntityAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <EntityAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <EntityAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <EntityCard icon="STAFF" color="STAFF" actions={actions}>
      <div
        className={StaffCardWrapperStyle}
        onClick={() => navigate(`/staff/${encodeId(id)}`)}
        role="presentation"
      >
        {id}
      </div>
    </EntityCard>
  );
};

export default StaffCard;
