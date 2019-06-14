// @flow
import * as React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
// $FlowFixMe: not have flow type yet
import { FixedSizeGrid as Grid } from 'react-window';
import { RowStyle, TableWrapperStyle } from './style';
import { StickyHeader } from './StickyHeader';
import { Lines } from './Lines';

const GUTTER_SIZE = 5;
type Props = {
  columnCount: number,
  columnWidth: number,
  rowCount: number,
  rowHeight: number,
  showAllColumn: boolean,
  customColumns: Object,
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
}: {
  style: Object,
  position: {
    columnIndex: number,
    rowIndex: number,
  },
}) => (
  <div
    id={JSON.stringify(position)}
    className={RowStyle(position.columnIndex % 2 === 0)}
    style={style}
  >
    Row [{position.rowIndex},{position.columnIndex}]
  </div>
);

const ItemWrapper = ({
  style,
  columnIndex,
  rowIndex,
}: {
  style: Object,
  columnIndex: number,
  rowIndex: number,
}) => {
  return <ItemRenderer position={{ columnIndex, rowIndex }} style={style} />;
};

export default function Table({ customColumns, showAllColumn, lines, ...renderOptions }: Props) {
  const headerRef = React.useRef();
  const sidebarRef = React.useRef();
  const bodyRef = React.useRef();

  const handleScroll = () => {};

  return (
    <>
      <StickyHeader
        {...renderOptions}
        showAllColumn={showAllColumn}
        customColumns={customColumns}
        innerRef={headerRef}
      />
      <Lines innerRef={sidebarRef} {...lines} />
      <AutoSizer>
        {({ width, height }) => (
          <Grid
            {...renderOptions}
            innerRef={bodyRef}
            onScroll={handleScroll}
            width={width - 30}
            height={height - 50}
            innerElementType={innerElementType}
            className={TableWrapperStyle}
          >
            {ItemWrapper}
          </Grid>
        )}
      </AutoSizer>
    </>
  );
}
