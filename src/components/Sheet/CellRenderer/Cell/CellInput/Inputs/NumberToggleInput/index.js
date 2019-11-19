// @flow
import * as React from 'react';
import BaseNumberInput from 'components/Inputs/NumberInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import ComputableInput from 'components/Sheet/CellRenderer/Cell/CellInput/Common/ComputableInput';
import { InputStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';

const NumberToggleInput = (props: InputProps<{ value: ?number, auto: boolean }, number>) => (
  <ComputableInput
    {...props}
    input={({ onChange, value, readonly }) => (
      <BaseNumberInput
        value={value === null ? '' : value}
        className={InputStyle}
        onChange={e => onChange(e.target.value)}
        disabled={readonly}
      />
    )}
  />
);

export default NumberToggleInput;
