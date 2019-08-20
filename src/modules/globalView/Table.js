// @flow
import * as React from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import { isEqual } from 'lodash';
import loadMore from 'utils/loadMore';
import Draggable from 'react-draggable';
import { getByPathWithDefault } from 'utils/fp';
import TextInput from './components/TextInput';
import {
  HeaderStyle,
  HeaderItemStyle,
  CellStyle,
  DragHandleIconStyle,
  EmptyCellStyle,
} from './style';

const ViewContext = React.createContext<{
  focused: ?boolean,
  focusedId: ?string,
  editingId: ?string,
  setFocused: Function,
  setFocusedId: Function,
  setEditingId: Function,
  focusedXY: Array<number>,
  setFocusedXY: Function,
}>({
  focused: false,
  focusedId: undefined,
  editingId: undefined,
  setFocused: () => {},
  setFocusedId: () => {},
  setEditingId: () => {},
  focusedXY: [],
  setFocusedXY: () => {},
});

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
  const item = getByPathWithDefault({}, `${rowIndex}.${columnIndex}`, data);
  const { value, start, lines } = item;

  const key = item.key || `empty.${rowIndex}.${columnIndex}`;

  const cellRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const {
    focused,
    setFocused,
    focusedId,
    setFocusedId,
    editingId,
    setEditingId,
    focusedXY,
    setFocusedXY,
  } = React.useContext(ViewContext);

  // focus first cell
  React.useEffect(() => {
    if (cellRef && cellRef.current) {
      if (lines === 1 && isEqual(focusedXY, [rowIndex, columnIndex])) {
        cellRef.current.focus();
        setFocused(true);
      }
      if (
        !focused &&
        focusedId &&
        (focusedId === key || focusedId === cellRef.current.getAttribute('name'))
      ) {
        cellRef.current.focus();
        setFocused(true);
      }
    }
  }, [focused, focusedId, key, setFocused, focusedXY, rowIndex, columnIndex, lines]);

  // focus input
  React.useEffect(() => {
    if (
      inputRef &&
      inputRef.current &&
      editingId &&
      editingId === key &&
      isEqual(focusedXY, [rowIndex, columnIndex])
    ) {
      inputRef.current.focus();
    }
  }, [inputRef, editingId, key, focusedXY, rowIndex, columnIndex]);

  // change cell style
  React.useEffect(() => {
    if (cellRef && cellRef.current) {
      if (editingId === key) {
        cellRef.current.style.pointerEvents = 'none';
      } else {
        cellRef.current.style.pointerEvents = '';
      }
    }
  }, [editingId, key]);

  const handleInputBlur = () => {
    setFocusedXY([]);
    setEditingId(undefined);
    setFocused(false);
  };

  const navigateNextCell = (position: Array<number>) => {
    if (inputRef && inputRef.current) {
      inputRef.current.blur();
    }
    const [row, column] = position;
    const next = `${row}.${column}`;

    const cellName = getByPathWithDefault(`empty.${next}`, `${next}.key`, data);
    setFocusedId(cellName);
    setFocusedXY(position);
    setFocused(false);
  };

  const handleCellKeyDown = e => {
    e.preventDefault();
    e.stopPropagation();
    switch (e.key) {
      case 'Enter': {
        setEditingId(key);
        break;
      }
      case 'ArrowUp': {
        const position =
          start === undefined ? [rowIndex - 1, columnIndex] : [start - 1, columnIndex];
        navigateNextCell(position);
        break;
      }
      case 'Tab': {
        if (e.shiftKey) {
          const position =
            start === undefined ? [rowIndex, columnIndex - 1] : [start, columnIndex - 1];
          navigateNextCell(position);
        } else {
          const position =
            start === undefined ? [rowIndex, columnIndex + 1] : [start, columnIndex + 1];
          navigateNextCell(position);
        }
        break;
      }
      case 'ArrowRight': {
        const position =
          start === undefined ? [rowIndex, columnIndex + 1] : [start, columnIndex + 1];
        navigateNextCell(position);
        break;
      }
      case 'ArrowDown': {
        const position =
          start === undefined ? [rowIndex + 1, columnIndex] : [start + lines, columnIndex];
        navigateNextCell(position);
        break;
      }
      case 'ArrowLeft': {
        const position =
          start === undefined ? [rowIndex, columnIndex - 1] : [start, columnIndex - 1];
        navigateNextCell(position);
        break;
      }
      default:
        break;
    }
  };

  const handleInputKeyDown = e => {
    e.stopPropagation();
    switch (e.key) {
      case 'Enter': {
        if (e.shiftKey) {
          const position =
            start === undefined ? [rowIndex - 1, columnIndex] : [start - 1, columnIndex];
          navigateNextCell(position);
        } else {
          const position =
            start === undefined ? [rowIndex + 1, columnIndex] : [start + lines, columnIndex];
          navigateNextCell(position);
        }
        break;
      }
      case 'Tab': {
        if (e.shiftKey) {
          e.preventDefault();
          const position =
            start === undefined ? [rowIndex, columnIndex - 1] : [start, columnIndex - 1];
          navigateNextCell(position);
        } else {
          const position =
            start === undefined ? [rowIndex, columnIndex + 1] : [start, columnIndex + 1];
          navigateNextCell(position);
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div style={style}>
      <div
        name={key}
        tabIndex="-1"
        // $FlowFixMe: Cannot create div element because a call signature declaring the expected parameter / return type is missing in object type [1] but exists in function type [2] in property ref.
        ref={cellRef}
        role="presentation"
        className={
          item.key === undefined
            ? EmptyCellStyle({
                width: style.width,
                height: style.height,
                focused: focusedId === key,
              })
            : CellStyle({
                width: style.width,
                height: style.height,
                topBorder: rowIndex === start,
                rightBorder: start <= rowIndex && rowIndex <= start + lines,
                bottomBorder: rowIndex === start + lines - 1,
                leftBorder: start <= rowIndex && rowIndex <= start + lines,
                isEmptyCell: item.key === undefined,
                focused: isEqual(focusedXY, [rowIndex, columnIndex]),
                wrapped: focusedId === key,
              })
        }
        onClick={e => {
          e.preventDefault();
          setFocusedId(key);
          setFocusedXY(start === undefined ? [rowIndex, columnIndex] : [start, columnIndex]);
          setFocused(false);
        }}
        onDoubleClick={e => {
          e.preventDefault();
          if (inputRef && inputRef.current) {
            inputRef.current.focus();
          }
          setFocusedXY(start === undefined ? [rowIndex, columnIndex] : [start, columnIndex]);
          setEditingId(key);
        }}
        onKeyDown={handleCellKeyDown}
      />
      {start === rowIndex && (
        <TextInput
          inputRef={inputRef}
          width={`${style.width}px`}
          height={`${style.height}px`}
          name={key}
          value={value}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
        />
      )}
    </div>
  );
};

const Table = ({
  columnWidths,
  keys,
  originalData,
  rows,
  loading,
  hasMore,
  fetchMore,
}: {
  columnWidths: Array<number>,
  keys: Array<string>,
  originalData: Object,
  rows: Array<Object>,
  loading: boolean,
  hasMore: boolean,
  fetchMore: Function,
}) => {
  const headerRef = React.useRef(null);
  const bodyRef = React.useRef(null);
  const gridRef = React.useRef(null);
  const [widths, setWidths] = React.useState(columnWidths);
  const [focused, setFocused] = React.useState(false);
  const [focusedId, setFocusedId] = React.useState();
  const [focusedXY, setFocusedXY] = React.useState([]);
  const [editingId, setEditingId] = React.useState();

  const handleScroll = ({ scrollLeft }: Object) => {
    if (bodyRef.current && headerRef.current) {
      headerRef.current.scrollLeft = scrollLeft;
    }
  };

  const itemCount = hasMore ? rows.length + 1 : rows.length;
  const loadMoreItems = loading
    ? () => {}
    : () => loadMore({ fetchMore, data: originalData }, {}, 'orders');
  const isItemLoaded = index => !hasMore || index < rows.length;

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
              if (gridRef && gridRef.current) {
                gridRef.current.resetAfterColumnIndex(index);
              }
            }}
          />
          <ViewContext.Provider
            value={{
              focused,
              setFocused,
              focusedId,
              setFocusedId,
              editingId,
              setEditingId,
              focusedXY,
              setFocusedXY,
            }}
          >
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={loadMoreItems}
            >
              {({ onItemsRendered, ref }) => {
                const itemsRendered = gridData => {
                  const {
                    visibleRowStartIndex,
                    visibleRowStopIndex,
                    visibleColumnStopIndex,
                    overscanRowStartIndex,
                    overscanRowStopIndex,
                    overscanColumnStopIndex,
                  } = gridData;

                  const endCol = (loading ? overscanColumnStopIndex : visibleColumnStopIndex) + 1;
                  const startRow = loading ? overscanRowStartIndex : visibleRowStartIndex;
                  const endRow = loading ? overscanRowStopIndex : visibleRowStopIndex;

                  const visibleStartIndex = startRow * endCol;
                  const visibleStopIndex = endRow * endCol;

                  return onItemsRendered({
                    visibleStartIndex,
                    visibleStopIndex,
                  });
                };
                return (
                  <Grid
                    // $FlowFixMe: expected object, but exist function, because we use hooks. it should be supported by library.
                    // ref={gridRef}
                    ref={ref}
                    innerRef={bodyRef}
                    itemData={rows}
                    columnCount={keys.length}
                    columnWidth={index => widths[index]}
                    width={width}
                    height={height}
                    rowCount={itemCount}
                    rowHeight={() => 50}
                    onScroll={handleScroll}
                    onItemsRendered={itemsRendered}
                  >
                    {Cell}
                  </Grid>
                );
              }}
            </InfiniteLoader>
          </ViewContext.Provider>
        </>
      )}
    </AutoSizer>
  );
};

const defaultProps = {
  rows: [],
};

Table.defaultProps = defaultProps;

export default Table;
