// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { type Tag } from 'modules/tags/type.js.flow';
import EntityCard, { EntityAction } from 'components/EntityCard';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import { TagCardWrapperStyle } from './style';

type Props = {
  tag: ?Tag,
};

const TagCard = ({ tag }: Props) => {
  if (!tag) return '';

  const { id } = tag;

  const actions = [
    <EntityAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <EntityAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <EntityAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <EntityCard icon="TAGS" color="GRAY_LIGHT" actions={actions}>
      <div
        className={TagCardWrapperStyle}
        onClick={() => navigate(`/tag/${encodeId(id)}`)}
        role="presentation"
      >
        {id}
      </div>
    </EntityCard>
  );
};

export default TagCard;
