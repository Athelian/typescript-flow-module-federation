// @flow
import * as React from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { getByPath } from 'utils/fp';
import InlineTextInput from './components/InlineTextInput';
import { HeaderStyle, HeaderItemStyle, ColumnStyle } from './style';

const Header = ({ innerRef, items }: { innerRef: React.Ref<any>, items: string[] }) => {
  return (
    <div ref={innerRef} className={HeaderStyle}>
      {items.map(item => (
        <div className={HeaderItemStyle({ width: 200 })}>{item}</div>
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
  const contentKey = getByPath(`${rowIndex}.${columnIndex}.key`, data);
  const contentValue = getByPath(`${rowIndex}.${columnIndex}.value`, data);

  return (
    <div style={style} className={ColumnStyle}>
      {contentValue && <InlineTextInput name={contentKey} value={contentValue} />}
    </div>
  );
};

const Table = ({ keys, data }: { keys: Array<string>, data: any }) => {
  const headerRef = React.useRef();
  const bodyRef = React.createRef();

  const handleScroll = ({ scrollLeft }: Object) => {
    if (bodyRef.current) {
      if (headerRef.current) {
        headerRef.current.scrollLeft = scrollLeft;
      }
    }
  };

  return (
    <div>
      <Header innerRef={headerRef} items={keys} />
      <Grid
        innerRef={bodyRef}
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
