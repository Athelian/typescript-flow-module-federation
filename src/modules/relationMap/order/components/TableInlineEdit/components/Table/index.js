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
  const [row, column] = position;
  switch (type) {
    default:
      return position;
    case 'TAB':
    case 'RIGHT':
      return [Number(row), Number(column) + 1];
    case 'REVERSE_TAB':
    case 'LEFT':
      return [Number(row), Number(column) - 1];
    case 'UP':
      return [Number(row) - 1, column];
    case 'DOWN':
      return [Number(row) + 1, column];
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
        Number(columnIndex) >= 0 &&
        Number(columnIndex) < columnCount &&
        Number(rowIndex) >= 0 &&
        Number(rowIndex) < rowCount;
      if (isValidNavigate && gridRef.current) {
        gridRef.current.scrollToItem({
          columnIndex,
          rowIndex,
        });
        requestAnimationFrame(() => {
          const cell = document.getElementById(`input-${Number(rowIndex)}-${Number(columnIndex)}`);
          if (cell) {
            if (cell.hasAttribute('disabled')) {
              emitter.emit('NAVIGATE', calculatePosition([rowIndex, columnIndex], type), type);
            } else {
              cell.focus();
            }
          } else {
            emitter.emit('NAVIGATE', calculatePosition([rowIndex, columnIndex], type), type);
          }
        });
      }
    });
    return () => {
      listener.remove();
    };
  }, [columnCount, gridRef, renderOptions, rowCount]);
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
