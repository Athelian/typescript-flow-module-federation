// @flow
import React from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { getByPath } from 'utils/fp';
import InlineTextInput from './components/InlineTextInput';
import { ColumnStyle } from './style';

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
  const contentType = getByPath(`${rowIndex}.${columnIndex}.type`, data);
  const contentKey = getByPath(`${rowIndex}.${columnIndex}.key`, data);
  const contentValue = getByPath(`${rowIndex}.${columnIndex}.value`, data);

  return contentType === 'header' ? (
    <div style={style} className={ColumnStyle}>
      {contentValue}
    </div>
  ) : (
    <div style={style} className={ColumnStyle}>
      {contentValue && <InlineTextInput name={contentKey} value={contentValue} />}
    </div>
  );
};

const Table = ({ keys, data }: { keys: Array<string>, data: any }) => {
  return (
    <div>
      <Grid
        itemData={[keys.map(item => ({ type: 'header', key: 'any', value: item })), ...data]}
        columnCount={keys.length}
        columnWidth={200}
        width={800}
        height={150}
        rowCount={data.length + 1}
        rowHeight={35}
      >
        {Cell}
      </Grid>
    </div>
  );
};

export default Table;
