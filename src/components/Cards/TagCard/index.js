// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { type Tag } from 'modules/tags/type.js.flow';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import BaseCard, { CardAction } from '../BaseCard';
import { TagCardWrapperStyle } from './style';

type Props = {
  tag: ?Tag,
};

const TagCard = ({ tag }: Props) => {
  if (!tag) return '';

  const { id } = tag;

  const actions = [
    <CardAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <CardAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <CardAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <BaseCard icon="TAG" color="TAG" actions={actions}>
      <div
        className={TagCardWrapperStyle}
        onClick={() => navigate(`/tags/${encodeId(id)}`)}
        role="presentation"
      >
        {id}
      </div>
    </BaseCard>
  );
};

export default TagCard;
