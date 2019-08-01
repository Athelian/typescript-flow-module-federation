// @flow
import React from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { getByPath } from 'utils/fp';
import InlineTextInput from './components/InlineTextInput';
import { HeaderStyle, ColumnStyle } from './style';

const HeaderItem = ({
  data,
  columnIndex,
  style,
}: {
  data: any,
  columnIndex: number,
  style: React.ref<any>,
}) => {
  return <div style={style}>{data[columnIndex]}</div>;
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
  const contentValue = getByPath(`${rowIndex}.${columnIndex}.value`, data);

  return (
    <div style={style} className={ColumnStyle}>
      {contentValue && <InlineTextInput value={contentValue} />}
    </div>
  );
};

const Table = ({ keys, data }: { keys: Array<string>, data: any }) => {
  const staticGrid = React.useRef(null);
  const handleScroll = React.useCallback(({ scrollLeft, scrollUpdateWasRequested }) => {
    if (!scrollUpdateWasRequested) {
      staticGrid.current.scrollTo({ scrollTo: 0, scrollLeft });
    }
  });

  return (
    <div>
      <Grid
        className={HeaderStyle}
        ref={staticGrid}
        itemData={keys}
        columnCount={keys.length}
        columnWidth={200}
        width={800}
        height={35}
        rowCount={1}
        rowHeight={35}
      >
        {HeaderItem}
      </Grid>
      <Grid
        itemData={data}
        columnCount={keys.length}
        columnWidth={200}
        width={800}
        height={150}
        rowCount={data.length}
        rowHeight={35}
        onScroll={handleScroll}
      >
        {Cell}
      </Grid>
    </div>
  );
};

export default Table;
