// @flow
import * as React from 'react';
import { Tooltip, FullValueTooltip } from 'components/Tooltip';
import useUser from 'hooks/useUser';
import type { Tag as TagType } from './type.js.flow';
import { TagStyle, PrefixStyle, SuffixStyle, OwnerStyle } from './style';

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
  const { organization } = useUser();
  console.log(organization);
  return (
    <div className={TagStyle(color)}>
      <FullValueTooltip message={name}>
        <div>
          {prefix && <div className={PrefixStyle(color)}>{prefix}</div>}
          {name}
          {suffix && <div className={SuffixStyle(color)}>{suffix}</div>}
        </div>
      </FullValueTooltip>
      <Tooltip message="shared by Zenport, Inc.">
        <span className={OwnerStyle}>Z</span>
      </Tooltip>
    </div>
  );
};

Tag.defaultProps = defaultProps;

export default Tag;
