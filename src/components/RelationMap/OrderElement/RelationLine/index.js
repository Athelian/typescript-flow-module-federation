// @flow
import React from 'react';
import { getByPathWithDefault } from 'utils/fp';
import * as style from './style';

type Props = {
  type: number,
  isFocused: boolean,
  focusMode: string,
};

const RelationLine = (props: Props) => {
  const { type, isFocused, focusMode } = props;
  const className = getByPathWithDefault('', `RelationLine${type}Style`, style)(
    isFocused,
    focusMode
  );
  return <div className={className} />;
};

export default RelationLine;
