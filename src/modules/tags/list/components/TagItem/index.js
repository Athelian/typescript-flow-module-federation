// @flow
import * as React from 'react';
import type { Tag as TagType } from 'components/Tag/type.js.flow';
import { TagStyle } from './style';

type Props = {
  tag: TagType,
};

function TagItem({ tag }: Props) {
  return (
    <div style={{ background: '#fff', padding: '10px' }}>
      <div className={TagStyle(tag.color)} title={tag.description}>
        {tag.name}
      </div>
      <div>description: {tag.description}</div>
    </div>
  );
}

export default TagItem;
