// @flow
import * as React from 'react';
import { useDrag } from 'react-dnd';

type Props = {|
  children: React$Node,
  item: { id: string, type: string },
  canChangeType: boolean,
  onChangeType: Function,
|};

const DocumentDragWrapper = ({ children, item, canChangeType, onChangeType }: Props) => {
  const [, dragRef] = useDrag({
    item,
    canDrag: () => canChangeType,
    end: (dragItem, monitor) => {
      if (monitor.didDrop()) {
        onChangeType(monitor.getDropResult());
      }
    },
  });

  return <div ref={dragRef}>{children}</div>;
};

export default DocumentDragWrapper;
