// @flow
import * as React from 'react';
import { WrapperStyle, EmptyItemStyle } from './style';

type OptionalProps = {
  columnNo: number,
};
type Props = OptionalProps & {
  rowNo: number,
  fields: Array<{
    id?: string,
    name: string,
    type: string,
    meta?: Object,
  }>,
};
const defaultProps = {
  columnNo: 0,
};
function TableEmptyItem({ fields, rowNo, columnNo }: Props) {
  return (
    <div className={WrapperStyle}>
      {fields.map(({ name, type, id }, fieldCounter) => (
        <div
          key={`${name}-${type || id || ''}`}
          className={EmptyItemStyle}
          id={`input-${rowNo}-${fieldCounter + columnNo + 1}`}
          disabled
        />
      ))}
    </div>
  );
}
TableEmptyItem.defaultProps = defaultProps;
export default TableEmptyItem;
