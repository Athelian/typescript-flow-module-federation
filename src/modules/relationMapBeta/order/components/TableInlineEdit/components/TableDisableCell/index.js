// @flow
import * as React from 'react';
import { DisabledCellStyle } from './style';

type Props = {
  id?: string,
};
const TableDisabledCell = ({ id }: Props) => (
  <div {...(id ? { id } : {})} className={DisabledCellStyle} />
);

export default TableDisabledCell;
