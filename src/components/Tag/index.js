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
  const { color = '#ffffff', name = 'TAG', description = '' } = tag;

  return (
    <div className={TagStyle(color)} title={description}>
      {prefix && <div className={PrefixStyle(color)}>{prefix}</div>}
      {name}
      {suffix && <div className={SuffixStyle(color)}>{suffix}</div>}
    </div>
  );
}

Tag.defaultProps = {
  prefix: '',
  suffix: '',
};
