// @flow
import * as React from 'react';
import { DraggableCore } from 'react-draggable';
import Icon from 'components/Icon';
import { ColumnStyle, DragHandleStyle, TitleStyle, SortButtonStyle } from './style';

type Props = {
  title: any,
  color: string,
  sortable: boolean,
  direction?: 'ASCENDING' | 'DESCENDING',
  onSortToggle: () => void,
  width: number,
  minWidth: number,
  onResize: number => void,
};

const Column = ({
  title,
  color,
  sortable,
  direction,
  onSortToggle,
  minWidth,
  width: initialWidth,
  onResize,
}: Props) => {
  const [width, setWidth] = React.useState(initialWidth);
  const [dragging, setDragging] = React.useState(false);

  return (
    <div className={ColumnStyle(color, width)}>
      <span className={TitleStyle}>{title}</span>
      {sortable && (
        <button type="button" className={SortButtonStyle(!!direction)} onClick={onSortToggle}>
          <Icon icon={direction === 'ASCENDING' ? 'SORT_ASC' : 'SORT_DESC'} />
        </button>
      )}
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
