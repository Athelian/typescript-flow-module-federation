// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { ToggleInput } from 'components/Form';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { ComputableInputWrapperStyle, CalculatorIconStyle } from './style';

type Props<T> = {
  ...InputProps<{ value: ?T, auto: boolean }, T>,
  input: ({ value: ?T, onChange: T => void, readonly: boolean, auto: boolean }) => React.Node,
};

const ComputableInput = <T>({ value, context, onChange, readonly, input }: Props<T>) => (
  <div className={ComputableInputWrapperStyle}>
    {input({
      value: value?.auto ?? false ? context : value?.value ?? null,
      onChange: newValue => onChange({ ...(value || { auto: false }), value: newValue }),
      readonly,
      auto: value?.auto ?? false,
    })}

    <div className={CalculatorIconStyle}>
      <Icon icon="CALCULATOR" />
    </div>

    <ToggleInput
      editable={!readonly}
      toggled={value?.auto ?? false}
      onToggle={() => onChange({ value: context, auto: !(value?.auto ?? false) }, true)}
    />
  </div>
);

export default ComputableInput;
