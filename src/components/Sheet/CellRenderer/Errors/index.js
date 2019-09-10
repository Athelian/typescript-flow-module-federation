// @flow
import * as React from 'react';
import { ErrorStyle, WrapperStyle } from './style';

type Props = {
  isFirstRow: boolean,
  size: number,
  errors: Array<string>,
};

const Errors = ({ isFirstRow, size, errors }: Props) => {
  return (
    <div className={WrapperStyle(isFirstRow, size)}>
      {errors.map(error => (
        <span key={error} className={ErrorStyle}>
          {error}
        </span>
      ))}
    </div>
  );
};

export default Errors;
