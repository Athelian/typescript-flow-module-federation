// @flow
import * as React from 'react';
import logger from 'utils/logger';
import { BatchFormWrapperStyle } from './style';

type Props = {
  batch: Object,
};

export default function BatchForm({ batch }: Props) {
  const isNew = Object.keys(batch).length === 0;
  logger.warn('batch', batch);

  return <div className={BatchFormWrapperStyle}>WIP {isNew ? 'Batch New' : 'Batch Detail'}</div>;
}
