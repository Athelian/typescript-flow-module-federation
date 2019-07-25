// @flow
import * as React from 'react';
import memoize from 'memoize-one';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid as Grid } from 'react-window';
import { getByPath } from 'utils/fp';
import emitter from 'utils/emitter';
import {
  generateEmptyShipmentsData,
  generateOrdersData,
} from 'modules/relationMap/order/components/TableInlineEdit/tableRenders';
import { CellStyle, TableWrapperStyle } from './style';
import { StickyHeader } from './StickyHeader';
import { Lines } from './Lines';
import TableDisableCell from '../TableDisableCell';
import Cell from './Cell';

type Props = {
  columnCount: number,
  columnWidth: number,
  rowHeight: number,
  showAllColumn: boolean,
  customColumns: Object,
  templateColumns: Array<string>,
  onToggle: Function,
  lines: Object,
  itemData: Object,
};

const innerElementType = React.forwardRef(
  ({ style, children, ...rest }: { style: Object, children: React.Node }, ref) => (
    <div ref={ref} style={{ ...style, position: 'relative' }} {...rest}>
      {children}
    </div>
  )
);

const ItemRenderer = ({
  position,
  style,
  cell,
}: {
  style: Object,
  cell: ?Object,
  position: {
    columnIndex: number,
    rowIndex: number,
  },
}) => (
  <div className={CellStyle} style={style}>
    {!cell ? (
      <TableDisableCell id={`${position.rowIndex}-${position.columnIndex}`} />
    ) : (
      <Cell inputId={`${position.rowIndex}-${position.columnIndex}`} {...cell} />
    )}
  </div>
);

const ItemWrapper = ({
  style,
  data,
  columnIndex,
  rowIndex,
}: {
  style: Object,
  data: Object,
  columnIndex: number,
  rowIndex: number,
}) => {
  const cell = getByPath(`${rowIndex}.${columnIndex}`, data);
  return <ItemRenderer cell={cell} position={{ columnIndex, rowIndex }} style={style} />;
};

// refer this example for how to to optimize rendering with memoize https://react-window.now.sh/#/examples/list/memoized-list-items
const createItemData = memoize((itemData: Object) => {
  const { ids, columns, targetIds, editData, mappingObjects } = itemData;
  const data = [
    ...generateEmptyShipmentsData({ columns, editData, mappingObjects, targetIds, ...ids }),
    ...generateOrdersData({ columns, editData, mappingObjects, targetIds, ...ids }),
  ]
    .filter(rows => rows.values && rows.values.length > 0)
    .map(item => item.values)
    .reduce((result, rows) => result.concat(rows), []);

  return data;
});

const calculatePosition = (position: [number, number], type: mixed): [number, number] => {
  const [baseRow = -1, baseColumn = -1] = position;
  const row = Number(baseRow);
  const column = Number(baseColumn);
  switch (type) {
    case 'TAB':
    case 'RIGHT':
      return [row, column + 1];
    case 'REVERSE_TAB':
    case 'LEFT':
      return [row, column - 1];
    case 'UP':
      return [row - 1, column];
    case 'DOWN':
      return [row + 1, column];
    default:
      return [row, column];
  }
};

export default function Table({
  customColumns,
  showAllColumn,
  lines,
  itemData,
  onToggle,
  templateColumns,
  ...renderOptions
}: Props) {
  const headerRef = React.useRef();
  const sidebarRef = React.useRef();
  const bodyRef = React.useRef();

  const handleScroll = ({ scrollLeft, scrollTop }: { scrollLeft: number, scrollTop: number }) => {
    if (bodyRef.current) {
      if (headerRef.current) headerRef.current.scrollLeft = scrollLeft;
      if (sidebarRef.current) sidebarRef.current.scrollTop = scrollTop;
    }
  };
  const data = createItemData(itemData);
  const rowCount = data.length;
  const { columnCount } = renderOptions;
  const gridRef = React.createRef();
  React.useEffect(() => {
    const listener = emitter.addListener('NAVIGATE', (position: mixed, type: mixed) => {
      // $FlowIgnore position is the tuples
      const [rowIndex, columnIndex] = calculatePosition(position, type);
      const isValidNavigate =
        columnIndex >= 0 && columnIndex < columnCount && rowIndex >= 0 && rowIndex < rowCount;
      const allowTags = ['input', 'button'];
      if (isValidNavigate && gridRef.current) {
        gridRef.current.scrollToItem({
          columnIndex,
          rowIndex,
        });
        requestAnimationFrame(() => {
          const cell = document.getElementById(`input-${rowIndex}-${columnIndex}`);
          if (cell) {
            const tagName = cell.tagName.toLowerCase();
            if (cell.hasAttribute('disabled') || !allowTags.includes(tagName)) {
              emitter.emit('NAVIGATE', [rowIndex, columnIndex], type);
            } else {
              console.warn('focus', cell);
              cell.focus();
            }
          } else {
            emitter.emit('NAVIGATE', [rowIndex, columnIndex], type);
          }
        });
      }
    });
    return () => {
      listener.remove();
    };
  }, [columnCount, gridRef, rowCount]);
  return (
    <>
      <StickyHeader
        {...renderOptions}
        onToggle={onToggle}
        templateColumns={templateColumns}
        itemData={data}
        showAllColumn={showAllColumn}
        customColumns={customColumns}
        innerRef={headerRef}
      />
      <Lines innerRef={sidebarRef} {...lines} />
      <AutoSizer>
        {({ width, height }) => (
          <Grid
            {...renderOptions}
            // $FlowIgnore this is the error when sending the new ref to legacy ref type
            ref={gridRef}
            itemData={data}
            rowCount={data.length}
            innerRef={bodyRef}
            width={width - 30}
            height={height - 50}
            innerElementType={innerElementType}
            className={TableWrapperStyle}
            onScroll={handleScroll}
          >
            {ItemWrapper}
          </Grid>
        )}
      </AutoSizer>
    </>
  );
}
