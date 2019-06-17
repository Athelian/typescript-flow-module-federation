// @flow
import * as React from 'react';
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

const GUTTER_SIZE = 5;
type Props = {
  columnCount: number,
  columnWidth: number,
  rowCount: number,
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
    <div
      ref={ref}
      style={{
        ...style,
        paddingLeft: GUTTER_SIZE,
        paddingTop: GUTTER_SIZE,
      }}
      {...rest}
    >
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
      <TableDisableCell />
    ) : (
      <Cell id={`${position.columnIndex}-${position.rowIndex}`} {...cell} />
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
  console.warn({
    data,
    cell,
    columnIndex,
    rowIndex,
  });
  return <ItemRenderer cell={cell} position={{ columnIndex, rowIndex }} style={style} />;
};

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
