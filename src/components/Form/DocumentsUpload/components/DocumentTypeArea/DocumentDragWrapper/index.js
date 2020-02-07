// @flow
import * as React from 'react';
import { useDrag } from 'react-dnd';

type Props = {|
  children: React$Node,
  item: { id: string, type: string },
|};

const DocumentDragWrapper = ({ children, item }: Props) => {
  const [, dragRef] = useDrag({ item });
  console.warn(item);
  return <div ref={dragRef}>{children}</div>;
};

export default DocumentDragWrapper;
