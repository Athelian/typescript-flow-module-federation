// @flow
import * as React from 'react';
import { useSheetColumns } from 'components/Sheet/SheetColumns';
import type { Area } from 'components/Sheet/SheetState/types';
import { DeletedStyle, LabelStyle } from './style';

type Props = {
  area: Area,
};

const Deleted = ({ area }: Props) => {
  const { columns } = useSheetColumns();

  const height = Math.max(1, area.to.x + 1 - area.from.x) * 30;
  const width = columns.slice(area.from.y).reduce((total, col) => total + col.width, 0);

  return (
    <div className={DeletedStyle(height, width)}>
      <span className={LabelStyle}>Deleted</span>
    </div>
  );
};

export default Deleted;
