// @flow
import * as React from 'react';
import { CellDraggableStyle } from './style';

type Props = {|
  children: React.Node,
|};

const CellDraggable = React.forwardRef<Props, HTMLElement>(({ children }: Props, ref) => {
  return (
    <div ref={ref} className={CellDraggableStyle}>
      {children}
    </div>
  );
});

export default CellDraggable;
