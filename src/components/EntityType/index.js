// @flow
import * as React from 'react';
import { TagStyle, PrefixStyle, SuffixStyle } from './style';

type Props = {
  name: string,
  prefix?: ?string | ?React.Node,
  suffix?: ?string | ?React.Node,
};

export default function EntityType({ name, prefix, suffix }: Props) {
  const color = '#bbb';

  return (
    <div className={TagStyle(color)}>
      {prefix && <div className={PrefixStyle(color)}>{prefix}</div>}
      {name}
      {suffix && <div className={SuffixStyle(color)}>{suffix}</div>}
    </div>
  );
}

EntityType.defaultProps = {
  prefix: '',
  suffix: '',
};
