// @flow
import * as React from 'react';
import { DraggableCore } from 'react-draggable';
import { ColumnStyle, DragHandleStyle, TitleStyle } from './style';

type Props = {
  title: any,
  width: number,
  onResize: number => void,
};

const Column = ({ title, width: initialWidth, onResize }: Props) => {
  const [width, setWidth] = React.useState(initialWidth);
  const [dragging, setDragging] = React.useState(false);

  return (
    <div className={ColumnStyle(width)}>
      <span className={TitleStyle}>{title}</span>
      <DraggableCore
        onStart={() => {
          setDragging(true);
        }}
        onDrag={(event, { deltaX }) => {
          setWidth(width + deltaX);
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

export default Column;
