// @flow
import * as React from 'react';
import { colors } from 'styles/common';
import type { LogItem } from 'modules/timeline/types';
import Icon from 'components/Icon';
import { IdentifierStyle } from './style';

type Props = {
  log: LogItem,
};

const EntityIdentifier = ({ log }: Props) => {
  let entityType = log.parameters.entity_type.string.toUpperCase();
  switch (entityType) {
    case 'VOYAGE':
    case 'CONTAINER_GROUP':
    case 'TIMELINE_DATE':
    case 'TIMELINE_DATE_REVISION':
      entityType = 'SHIPMENT';
      break;
    default:
      break;
  }

  return (
    <span className={IdentifierStyle(colors[entityType])}>
      <Icon icon={entityType} />
      {log.parameters.entity_identifier.string}
    </span>
  );
};

export default EntityIdentifier;
