// @flow
import * as React from 'react';
import type { Tag as TagType } from './type.js.flow';
import { TagStyle, PrefixStyle, SuffixStyle } from './style';

type Props = {
  tag: TagType,
  prefix?: ?string | ?React.Node,
  suffix?: ?string | ?React.Node,
};

export default function Tag({ tag, prefix, suffix }: Props) {
  return (
    <div className={TagStyle(tag.color)} title={tag.description}>
      {prefix && <div className={PrefixStyle(tag.color)}>{prefix}</div>}
      {tag.name}
      {suffix && <div className={SuffixStyle(tag.color)}>{suffix}</div>}
    </div>
  );
}

Tag.defaultProps = {
  prefix: '',
  suffix: '',
};
