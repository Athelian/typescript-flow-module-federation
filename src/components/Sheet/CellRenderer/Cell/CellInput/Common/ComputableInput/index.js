// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { ToggleInput } from 'components/Form';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { WrapperStyle, CalculatorIconStyle } from './style';

type Props<T> = {
  ...InputProps<{ value: ?T, auto: boolean }, T>,
  input: (props: InputProps<T>) => React.Node,
};

const ComputableInput = <T>({
  value,
  focus,
  context,
  onChange,
  readonly,
  forceFocus,
  forceBlur,
  input,
}: Props<T>) => {
  return (
    <div className={WrapperStyle(value?.auto ?? false)}>
      {input({
        value: value?.auto ?? false ? context : value?.value ?? null,
        context: null,
        extra: null,
        focus,
        onChange: newValue => onChange({ ...(value || { auto: false }), value: newValue }),
        readonly: readonly || (value?.auto ?? false),
        forceFocus,
        forceBlur,
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
};

export default ComputableInput;
