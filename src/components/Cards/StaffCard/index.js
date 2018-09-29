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
  onClick?: string => void,
};

const defaultProps = {
  onClick: (id: string) => navigate(`/staff/${encodeId(id)}`),
};

const StaffCard = ({ staff, onClick }: Props) => {
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
        onClick={() => id && onClick && onClick(id)}
        role="presentation"
      >
        {id}
      </div>
    </BaseCard>
  );
};

StaffCard.defaultProps = defaultProps;

export default StaffCard;
