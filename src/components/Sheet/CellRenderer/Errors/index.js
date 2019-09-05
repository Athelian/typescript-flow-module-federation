// @flow
import * as React from 'react';
import { ErrorStyle, WrapperStyle } from './style';

type Props = {
  isFirstRow: boolean,
  extended: number,
  errors: Array<string>,
};

const Errors = ({ isFirstRow, extended, errors }: Props) => {
  return (
    <div className={WrapperStyle(isFirstRow, extended)}>
      {errors.map(error => (
        <span key={error} className={ErrorStyle}>
          {error}
        </span>
      ))}
    </div>
  );
};

export default Errors;
