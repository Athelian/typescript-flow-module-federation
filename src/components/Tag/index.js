// @flow
import * as React from 'react';
import type { Tag as TagType } from './type.js.flow';
import { TagStyle, PrefixStyle, SuffixStyle } from './style';

type OptionalProps = {
  prefix: React.Node,
  suffix: React.Node,
};

type Props = OptionalProps & {
  tag: TagType,
};

const defaultProps = {
  prefix: null,
  suffix: null,
};

const Tag = ({ tag, prefix, suffix }: Props) => {
  const defaultTag = {
    name: '',
    color: '#ffffff',
  };
  const mergedTag = { ...defaultTag, ...tag };
  const { color, name } = mergedTag;

  return (
    <div className={TagStyle(color)}>
      {prefix && <div className={PrefixStyle(color)}>{prefix}</div>}
      {name}
      {suffix && <div className={SuffixStyle(color)}>{suffix}</div>}
    </div>
  );
};

Tag.defaultProps = defaultProps;

export default Tag;
