// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { type User as Staff } from 'modules/staff/type.js.flow';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import BaseCard, { CardAction } from '../BaseCard';
import { StaffCardWrapperStyle } from './style';

type Props = {
  staff: ?Staff,
};

const StaffCard = ({ staff }: Props) => {
  if (!staff) return '';

  const { id } = staff;

  const actions = [
    <CardAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <CardAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <CardAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <BaseCard icon="STAFF" color="STAFF" actions={actions}>
      <div
        className={StaffCardWrapperStyle}
        onClick={() => navigate(`/staff/${encodeId(id)}`)}
        role="presentation"
      >
        {id}
      </div>
    </BaseCard>
  );
};

export default StaffCard;
