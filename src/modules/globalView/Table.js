// @flow
import * as React from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Draggable from 'react-draggable';
import { getByPathWithDefault } from 'utils/fp';
import TextInput from './components/TextInput';
import { HeaderStyle, HeaderItemStyle, CellStyle, DragHandleIconStyle } from './style';

const ViewContext = React.createContext<{
  focusedId: ?string,
  editingId: ?string,
  setFocusedId: Function,
  setEditingId: Function,
}>({
  focusedId: undefined,
  editingId: undefined,
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
  const { focusedId, setFocusedId, editingId, setEditingId } = React.useContext(ViewContext);

  React.useEffect(() => {
    if (inputRef && inputRef.current) {
      if (editingId === key) {
        if (
          !document.activeElement ||
          (document.activeElement && document.activeElement.tagName !== 'INPUT')
        ) {
          inputRef.current.focus();
        }
      } else {
        inputRef.current.blur();
      }
    }
  }, [inputRef, editingId, key]);

  React.useEffect(() => {
    if (cellRef && cellRef.current) {
      if (editingId === key) {
        cellRef.current.style.pointerEvents = 'none';
      } else {
        cellRef.current.style.pointerEvents = '';
      }
    }
  }, [editingId, key]);

  const onBlur = () => {
    setEditingId(undefined);
  };

  return (
    <div style={style}>
      <div
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
        onClick={() => {
          setFocusedId(key);
        }}
        onDoubleClick={() => {
          if (inputRef && inputRef.current) {
            inputRef.current.focus();
          }
          setEditingId(key);
        }}
        onKeyDown={e => {
          e.preventDefault();
          e.stopPropagation();
          if (e.key === 'Enter') {
            if (inputRef && inputRef.current) {
              inputRef.current.focus();
            }
            setEditingId(key);
          }
        }}
      />
      {value && (
        <TextInput
          inputRef={inputRef}
          width={`${style.width}px`}
          height={`${style.height}px`}
          name={key}
          value={value}
          onBlur={onBlur}
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
