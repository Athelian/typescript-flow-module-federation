// @flow
import * as React from 'react';
import type { Violation } from 'types';
import FormattedViolation from 'components/FormattedViolation';
import { ErrorStyle, WrapperStyle } from './style';

type Props = {
  isFirstRow: boolean,
  size: number,
  violations: Array<Violation>,
};

const Errors = ({ isFirstRow, size, violations }: Props) => (
  <div className={WrapperStyle(isFirstRow, size)}>
    {violations.map(violation => (
      <span key={violation.error} className={ErrorStyle}>
        <FormattedViolation violation={violation} />
      </span>
    ))}
  </div>
);

export default Errors;
