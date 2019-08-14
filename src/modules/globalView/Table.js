// @flow
import * as React from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Draggable from 'react-draggable';
import { getByPathWithDefault } from 'utils/fp';
import TextInput from './components/TextInput';
import { HeaderStyle, HeaderItemStyle, CellStyle, DragHandleIconStyle } from './style';

const ViewContext = React.createContext<{
  focused: ?boolean,
  focusedId: ?string,
  editingId: ?string,
  setFocused: Function,
  setFocusedId: Function,
  setEditingId: Function,
}>({
  focused: false,
  focusedId: undefined,
  editingId: undefined,
  setFocused: () => {},
  setFocusedId: () => {},
  setEditingId: () => {},
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
  const { key, value, start, lines } = item;

  const cellRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const {
    focused,
    setFocused,
    focusedId,
    setFocusedId,
    editingId,
    setEditingId,
  } = React.useContext(ViewContext);

  // focus first cell
  React.useEffect(() => {
    if (!focused && focusedId && focusedId === key) {
      if (cellRef && cellRef.current) {
        cellRef.current.focus();
        setFocused(true);
      }
    }
  }, [focused, focusedId, key, setFocused]);

  // focus input
  React.useEffect(() => {
    if (inputRef && inputRef.current && editingId && editingId === key) {
      inputRef.current.focus();
    }
  }, [inputRef, editingId, key]);

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
    setEditingId(undefined);
    setFocused(false);
  };

  const handleCellKeyDown = e => {
    let newKey = '';

    switch (e.key) {
      case 'Enter': {
        setEditingId(key);
        break;
      }
      case 'ArrowUp': {
        newKey = getByPathWithDefault('', `${start - 1}.${columnIndex}.key`, data);
        setFocusedId(newKey);
        setFocused(false);
        break;
      }
      case 'Tab': {
        if (e.shiftKey) {
          newKey = getByPathWithDefault('', `${start}.${columnIndex - 1}.key`, data);
          setFocusedId(newKey);
          setFocused(false);
        } else {
          newKey = getByPathWithDefault('', `${start}.${columnIndex + 1}.key`, data);
          setFocusedId(newKey);
          setFocused(false);
        }
        break;
      }
      case 'ArrowRight': {
        newKey = getByPathWithDefault('', `${start}.${columnIndex + 1}.key`, data);
        setFocusedId(newKey);
        setFocused(false);
        break;
      }
      case 'ArrowDown': {
        newKey = getByPathWithDefault('', `${start + lines}.${columnIndex}.key`, data);
        setFocusedId(newKey);
        setFocused(false);
        break;
      }
      case 'ArrowLeft': {
        newKey = getByPathWithDefault('', `${start}.${columnIndex - 1}.key`, data);
        setFocusedId(newKey);
        setFocused(false);
        break;
      }
      default:
    }
  };

  const handleInputKeyDown = e => {
    e.stopPropagation();
    if (e.key === 'Enter' || e.key === 'Tab') {
      if (inputRef && inputRef.current) {
        inputRef.current.blur();
        handleInputBlur();
        setFocused(false);
      }
    }
  };

  return (
    <div style={style}>
      <div
        name={key}
        tabIndex="-1"
        ref={cellRef}
        role="presentation"
        className={CellStyle({
          width: style.width,
          height: style.height,
          topBorder: rowIndex === start,
          rightBorder: start <= rowIndex && rowIndex <= start + lines,
          bottomBorder: rowIndex === start + lines - 1,
          leftBorder: start <= rowIndex && rowIndex <= start + lines,
          focused: focusedId === key || editingId === key,
        })}
        onClick={e => {
          e.preventDefault();
          setFocusedId(key);
          setFocused(false);
        }}
        onDoubleClick={e => {
          e.preventDefault();
          if (inputRef && inputRef.current) {
            inputRef.current.focus();
          }
          setEditingId(key);
        }}
        onKeyDown={handleCellKeyDown}
      />
      {value && (
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
  const [focused, setFocused] = React.useState(false);
  const [focusedId, setFocusedId] = React.useState();
  const [editingId, setEditingId] = React.useState();

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
          <ViewContext.Provider
            value={{
              focused,
              setFocused,
              focusedId,
              setFocusedId,
              editingId,
              setEditingId,
            }}
          >
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
              rowHeight={() => 50}
              onScroll={handleScroll}
            >
              {Cell}
            </Grid>
          </ViewContext.Provider>
        </>
      )}
    </AutoSizer>
  );
};

export default Table;
