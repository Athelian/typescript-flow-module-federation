// @flow
import React from 'react';
import { getByPathWithDefault } from 'utils/fp';
import * as style from './style';

type Props = {
  type: number,
  isFocused: boolean,
  hasRelation?: boolean,
  isTargeted?: boolean,
};

const RelationLine = (props: Props) => {
  const { type, isFocused, isTargeted, hasRelation } = props;
  const className = getByPathWithDefault('', `RelationLine${type}Style`, style)(
    isFocused,
    isTargeted,
    hasRelation
  );
  return <div className={className} />;
};

export default RelationLine;
