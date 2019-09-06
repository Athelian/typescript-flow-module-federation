// @flow
import * as React from 'react';
import { DraggableCore } from 'react-draggable';
import { ColumnStyle, DragHandleStyle, TitleStyle } from './style';

type Props = {
  title: any,
  color: string,
  width: number,
  minWidth: number,
  onResize: number => void,
};

const Column = ({ title, color, minWidth, width: initialWidth, onResize }: Props) => {
  const [width, setWidth] = React.useState(initialWidth);
  const [dragging, setDragging] = React.useState(false);

  return (
    <div className={ColumnStyle(color, width)}>
      <span className={TitleStyle}>{title}</span>
      <DraggableCore
        onStart={() => {
          setDragging(true);
        }}
        onDrag={(event, { deltaX }) => {
          setWidth(Math.max(minWidth, width + deltaX));
        }}
        onStop={() => {
          setDragging(false);
          onResize(width);
        }}
      >
        <div className={DragHandleStyle(dragging)} />
      </DraggableCore>
    </div>
  );
};

Column.defaultProps = {
  minWidth: 50,
};

export default Column;
