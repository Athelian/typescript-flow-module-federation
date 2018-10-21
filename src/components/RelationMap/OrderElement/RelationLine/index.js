// @flow
import React from 'react';
import { getByPathWithDefault } from 'utils/fp';
import * as style from './style';

type Props = {
  type: number,
  isFocused: boolean,
  hasRelation?: boolean,
  focusMode: string,
};

const RelationLine = (props: Props) => {
  const { type, isFocused, focusMode, hasRelation } = props;
  const className = getByPathWithDefault('', `RelationLine${type}Style`, style)(
    isFocused,
    focusMode,
    hasRelation
  );
  return <div className={className} />;
};

export default RelationLine;
