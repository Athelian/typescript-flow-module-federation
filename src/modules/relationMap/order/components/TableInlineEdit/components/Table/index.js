// @flow
import * as React from 'react';
import memoize from 'memoize-one';
import AutoSizer from 'react-virtualized-auto-sizer';
// $FlowFixMe: not have flow type yet
import { FixedSizeGrid as Grid } from 'react-window';
import { getByPath } from 'utils/fp';
import {
  generateEmptyContainerShipmentsData,
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
    ...generateEmptyContainerShipmentsData({
      columns,
      editData,
      mappingObjects,
      targetIds,
      ...ids,
    }),
    ...generateOrdersData({ columns, editData, mappingObjects, targetIds, ...ids }),
  ]
    .filter(rows => rows.values && rows.values.length > 0)
    .map(item => item.values)
    .reduce((result, rows) => result.concat(rows), []);

  return data;
});

export default function Table({
  customColumns,
  showAllColumn,
  lines,
  itemData,
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
  console.warn({
    renderOptions,
  });
  const data = createItemData(itemData);
  return (
    <>
      <StickyHeader
        {...renderOptions}
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
