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
  myGridRef,
}: {
  innerRef: React.Ref<any>,
  columnWidths: Array<number>,
  items: Array<string>,
  resizeColumnWidth: Function,
  myGridRef: React.Ref<any>,
}) => {
  return (
    <div ref={innerRef} className={HeaderStyle}>
      {items.map((item, index) => (
        <div className={HeaderItemStyle({ width: columnWidths[index] })}>
          {item}
          <Draggable
            axis="x"
            onDrag={(event, { deltaX }) => {
              resizeColumnWidth({ index, deltaX, myGridRef });
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
  const headerRef = React.useRef();
  const bodyRef = React.createRef();
  const gridRef = React.createRef();
  const [widths, setWidths] = React.useState(columnWidths);

  const handleScroll = ({ scrollLeft }: Object) => {
    if (bodyRef.current) {
      if (headerRef.current) {
        headerRef.current.scrollLeft = scrollLeft;
      }
    }
  };

  return (
    <div>
      <Header
        columnWidths={widths}
        innerRef={headerRef}
        items={keys}
        myGridRef={gridRef}
        resizeColumnWidth={({ index, deltaX, myGridRef }) => {
          setWidths(prevWidths => {
            const newWidths = [...prevWidths];
            newWidths[index] = prevWidths[index] + parseInt(deltaX, 10);

            return newWidths;
          });
          console.warn(myGridRef);
          if (myGridRef.current) {
            myGridRef.current.resetAfterColumnIndex(index);
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
