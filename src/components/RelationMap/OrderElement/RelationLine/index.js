// @flow
import React from 'react';
import { getByPathWithDefault } from 'utils/fp';
import * as style from './style';

type OptionalProps = {
  hasRelation: boolean,
  isTargeted: boolean,
  isFocused: boolean,
};

type Props = OptionalProps & {
  type: number,
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

RelationLine.defaultProps = {
  hasRelation: false,
  isTargeted: false,
  isFocused: false,
};

export default RelationLine;
