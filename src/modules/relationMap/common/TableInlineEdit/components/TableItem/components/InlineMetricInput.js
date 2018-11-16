// @flow
import * as React from 'react';
import DefaultMetricStyle from 'components/Form/Inputs/MetricInput/DefaultMetricStyle';
import MetricInput from 'components/Form/Inputs/MetricInput';
import { useMetricInput } from 'modules/relationMap/common/TableInlineEdit/hooks';
import emitter from 'utils/emitter';

type OptionalProps = {
  isRequired: boolean,
};

type Props = OptionalProps & {
  name: string,
  value: ?{ value: number, metric: string },
  metrics: Array<string>,
  convert: Function,
};

const defaultProps = {
  isRequired: false,
};

export default function InlineMetricInput({ name, value, isRequired, metrics, convert }: Props) {
  const { hasError, isFocused, ...inputHandlers } = useMetricInput(value, { isRequired });
  return (
    <DefaultMetricStyle isFocused={isFocused} hasError={hasError} forceHoverStyle>
      <MetricInput
        {...inputHandlers}
        name={name}
        onBlur={() => {
          inputHandlers.onBlur();
          emitter.emit('INLINE_CHANGE', {
            name,
            hasError,
            value: inputHandlers.value,
          });
        }}
        metrics={metrics}
        convert={convert}
      />
    </DefaultMetricStyle>
  );
}

InlineMetricInput.defaultProps = defaultProps;
