// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import BaseNumberInput from 'components/Inputs/NumberInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  CellInputWrapperStyle,
  InputStyle,
} from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import { DayStyle } from './style';

const DayInput = ({ value, onChange, readonly }: InputProps<number>) => (
  <div className={CellInputWrapperStyle}>
    <BaseNumberInput
      className={InputStyle}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      disabled={readonly}
    />
    <span className={DayStyle}>
      <FormattedMessage id="components.inputs.days" defaultMessage="Days" />
    </span>
  </div>
);

export default DayInput;
