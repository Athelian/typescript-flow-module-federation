// @flow
import * as React from 'react';
import { useDrag } from 'react-dnd';

type Props = {|
  children: React$Node,
  item: { id: string, type: string },
  canChangeType: boolean,
|};

const DocumentDragWrapper = ({ children, item, canChangeType }: Props) => {
  const [, dragRef] = useDrag({ item, canDrag: () => canChangeType });

  return <div ref={dragRef}>{children}</div>;
};

export default DocumentDragWrapper;
