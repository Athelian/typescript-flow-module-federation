// @flow
import * as React from 'react';
import { VariableSizeGrid } from 'react-window';
import Draggable from 'react-draggable';
import { getByPath } from 'utils/fp';
import InlineTextInput from './components/InlineTextInput';
import { HeaderStyle, HeaderItemStyle, ColumnStyle, DragHandleIconStyle } from './style';

const Header = ({
  innerRef,
  columnWidths,
  items,
  resizeColumnWidth,
}: {
  innerRef: React.Ref<any>,
  columnWidths: Array<number>,
  items: Array<string>,
  resizeColumnWidth: Function,
}) => {
  return (
    <div ref={innerRef} className={HeaderStyle}>
      {items.map((item, index) => (
        <div className={HeaderItemStyle(columnWidths[index])}>
          {item}
          <Draggable
            axis="x"
            position={{ x: 0, y: 0 }}
            onStop={(event, data) => {
              resizeColumnWidth(index, columnWidths[index] + data.lastX);
            }}
          >
            <span className={DragHandleIconStyle} />
          </Draggable>
        </div>
      ))}
    </div>
  );
};

const Cell = ({
  data,
  columnIndex,
  rowIndex,
  style,
}: {
  data: any,
  columnIndex: number,
  rowIndex: number,
  style: Object,
}) => {
  const contentKey = getByPath(`${rowIndex}.${columnIndex}.key`, data);
  const contentValue = getByPath(`${rowIndex}.${columnIndex}.value`, data);

  return (
    <div style={style} className={ColumnStyle}>
      {contentValue && <InlineTextInput name={contentKey} value={contentValue} />}
    </div>
  );
};

const Grid = React.forwardRef(
  (
    props: {
      bodyRef: React.Ref<any>,
      data: any,
      keys: Array<string>,
      widths: Array<number>,
      handleScroll: Function,
    },
    ref
  ) => (
    <VariableSizeGrid
      ref={ref}
      innerRef={props.bodyRef}
      itemData={props.data}
      columnCount={props.keys.length}
      columnWidth={index => props.widths[index]}
      width={800}
      height={150}
      rowCount={props.data.length}
      rowHeight={() => 35}
      onScroll={props.handleScroll}
    >
      {Cell}
    </VariableSizeGrid>
  )
);

const Table = ({
  columnWidths,
  keys,
  data,
}: {
  columnWidths: Array<number>,
  keys: Array<string>,
  data: any,
}) => {
  const headerRef = React.useRef(null);
  const bodyRef = React.useRef(null);
  const gridRef = React.useRef(null);
  const [widths, setWidths] = React.useState(columnWidths);

  const handleScroll = ({ scrollLeft }: Object) => {
    if (bodyRef.current && headerRef.current) {
      headerRef.current.scrollLeft = scrollLeft;
    }
  };

  return (
    <div>
      <Header
        columnWidths={widths}
        innerRef={headerRef}
        items={keys}
        resizeColumnWidth={(index, width) => {
          setWidths(prevWidths => {
            const newWidths = [...prevWidths];
            newWidths[index] = width;

            return newWidths;
          });
          if (gridRef.current) {
            gridRef.current.resetAfterColumnIndex(index);
          }
        }}
      />
      <Grid
        ref={gridRef}
        bodyRef={bodyRef}
        data={data}
        keys={keys}
        widths={widths}
        handleScroll={handleScroll}
      />
    </div>
  );
};

export default Table;
