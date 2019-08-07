// @flow
import * as React from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Draggable from 'react-draggable';
import { getByPath } from 'utils/fp';
import TextInput from './components/TextInput';
import { HeaderStyle, HeaderItemStyle, ColumnStyle, DragHandleIconStyle } from './style';

const HeaderItem = ({ index, item, width, handleDrag }: Object) => {
  return (
    <div className={HeaderItemStyle(width)}>
      {item}
      <Draggable
        axis="x"
        position={{ x: 0, y: 0 }}
        onStop={(event, { lastX }) => {
          handleDrag(index, width + lastX);
        }}
      >
        <span className={DragHandleIconStyle} />
      </Draggable>
    </div>
  );
};

const Header = ({
  innerRef,
  width,
  columnWidths,
  items,
  resizeColumnWidth,
}: {
  innerRef: React.Ref<any>,
  width: number,
  columnWidths: Array<number>,
  items: Array<string>,
  resizeColumnWidth: Function,
}) => {
  return (
    <div ref={innerRef} className={HeaderStyle(width)}>
      {items.map((item, index) => (
        <HeaderItem
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          index={index}
          item={item}
          width={columnWidths[index]}
          handleDrag={resizeColumnWidth}
        />
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
      {contentValue && <TextInput name={contentKey} value={contentValue} />}
    </div>
  );
};

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
    <AutoSizer>
      {({ height, width }) => (
        <>
          <Header
            columnWidths={widths}
            innerRef={headerRef}
            items={keys}
            width={width}
            resizeColumnWidth={(index, newWidth) => {
              setWidths(prevWidths => {
                const newWidths = [...prevWidths];
                newWidths[index] = newWidth;
                return newWidths;
              });
              if (gridRef.current) {
                gridRef.current.resetAfterColumnIndex(index);
              }
            }}
          />
          <Grid
            // $FlowFixMe: expected object, but exist function, because we use hooks. it should be supported by library.
            ref={gridRef}
            innerRef={bodyRef}
            itemData={data}
            columnCount={keys.length}
            columnWidth={index => widths[index]}
            width={width}
            height={height}
            rowCount={data.length}
            rowHeight={() => 35}
            onScroll={handleScroll}
          >
            {Cell}
          </Grid>
        </>
      )}
    </AutoSizer>
  );
};

export default Table;
