// @flow
import React from 'react';
import { RelationLineHorizontalStyle, RelationLineVerticalStyle } from './style';

export type LINE_CONNECTOR = 'VERTICAL' | 'HORIZONTAL';

type Props = {|
  /**
   * Has relation between entity
   */
  hasRelation?: boolean,
  /**
   * Has targeted
   */
  isTargeted?: boolean,
  type: LINE_CONNECTOR,
  children?: React$Node,
|};

const RelationLine = ({ type, isTargeted, hasRelation, children }: Props) => {
  const className =
    type === 'VERTICAL'
      ? RelationLineVerticalStyle(Boolean(isTargeted))
      : RelationLineHorizontalStyle(Boolean(isTargeted), Boolean(hasRelation));
  return <div className={className}>{children} </div>;
};

export default RelationLine;
