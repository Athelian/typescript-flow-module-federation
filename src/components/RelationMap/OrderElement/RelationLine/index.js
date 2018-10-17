// @flow

import React from 'react';
import {
  RelationLine0Style,
  RelationLine1Style,
  RelationLine2Style,
  RelationLine3Style,
  RelationLine4Style,
} from './style';

type Props = {
  type: number,
  isFocus: boolean,
  hasRelation: boolean,
};

const RelationLine = (props: Props) => {
  const { type, isFocus, hasRelation } = props;
  let renderer;
  switch (Number(type)) {
    case 0:
      renderer = <div className={RelationLine0Style(isFocus)} />;
      break;
    case 1:
      renderer = <div className={RelationLine1Style(isFocus, hasRelation)} />;
      break;
    case 2:
      renderer = <div className={RelationLine2Style(isFocus)} />;
      break;
    case 3:
      renderer = <div className={RelationLine3Style(isFocus, hasRelation)} />;
      break;
    case 4:
      renderer = <div className={RelationLine4Style(isFocus, hasRelation)} />;
      break;
    default:
      renderer = <div />;
      break;
  }

  return renderer;
};

export default RelationLine;
