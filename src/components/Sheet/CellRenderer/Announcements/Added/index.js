// @flow
import * as React from 'react';
import { useSheetColumns } from 'components/Sheet/SheetColumns';
import { AddedStyle, LabelStyle } from './style';

type Props = {
  start: number,
  end: number,
  onClear: () => void,
};

const Added = ({ start, end, onClear }: Props) => {
  const { columns } = useSheetColumns();

  React.useEffect(() => {
    const handler = setTimeout(onClear, 5000);

    return () => clearTimeout(handler);
  }, [onClear]);

  const height = Math.max(1, end + 1 - start) * 30;
  const width = columns.reduce((total, col) => total + col.width, 0);

  return (
    <div className={AddedStyle(height, width)}>
      <span className={LabelStyle}>Added</span>
    </div>
  );
};

export default Added;
