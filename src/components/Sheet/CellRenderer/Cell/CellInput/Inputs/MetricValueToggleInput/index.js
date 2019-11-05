// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { ToggleInput } from 'components/Form';
import type { MetricValue } from 'types';
import type { InputProps } from '../../types';
import MetricValueInput from '../MetricValueInput';
import { WrapperStyle, CalculatorIconStyle } from './style';

type Props = {
  ...InputProps<{ value: ?MetricValue, auto: boolean }, MetricValue>,
  input: (props: InputProps<MetricValue>) => React.Node,
};

const MetricValueToggleInputImpl = ({
  value,
  context,
  onChange,
  focus,
  onFocus,
  onBlur,
  readonly,
  onKeyDown,
  input,
}: Props) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const handleBlur = e => {
    if (ref.current && !ref.current.contains(e.relatedTarget)) {
      onBlur();
    }
  };

  return (
    <div
      ref={ref}
      onFocus={onFocus}
      onBlur={handleBlur}
      className={WrapperStyle(value?.auto ?? false)}
    >
      {input({
        value: value?.value ?? null,
        context: null,
        extra: null,
        onChange: metricValue => onChange({ ...(value || { auto: false }), value: metricValue }),
        readonly: readonly || (value?.auto ?? false),
        focus,
        onFocus: () => {},
        onBlur: () => {},
        onKeyDown: e => {
          if (e.key === 'Tab' && !e.shiftKey) {
            e.stopPropagation();
          } else if (onKeyDown) {
            onKeyDown(e);
          }
        },
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

const MetricValueToggleInput = (input: (InputProps<MetricValue>) => React.Node) => (
  inputProps: InputProps<{ value: ?MetricValue, auto: boolean }, MetricValue>
) => {
  return <MetricValueToggleInputImpl input={input} {...inputProps} />;
};

export default {
  Volume: MetricValueToggleInput(MetricValueInput.Volume),
  Area: MetricValueToggleInput(MetricValueInput.Area),
  Length: MetricValueToggleInput(MetricValueInput.Length),
  Mass: MetricValueToggleInput(MetricValueInput.Mass),
};
