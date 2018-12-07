// @flow
import * as React from 'react';
import DefaultMetricStyle from 'components/Form/Inputs/MetricInput/DefaultMetricStyle';
import MetricInput from 'components/Form/Inputs/MetricInput';
import { useMetricInput } from 'modules/relationMap/common/TableInlineEdit/hooks';
import { getByPath } from 'utils/fp';
import emitter from 'utils/emitter';

type OptionalProps = {
  isRequired: boolean,
  sourcePath: string,
  destPath: string,
};

type Props = OptionalProps & {
  name: string,
  value: ?{ value: number, metric: string },
  metrics: Array<string>,
  convert: Function,
  values: Object,
};

const defaultProps = {
  isRequired: false,
  sourcePath: '',
  destPath: '',
};

export default function InlineMetricInput({
  sourcePath,
  destPath,
  name,
  value,
  values,
  isRequired,
  metrics,
  convert,
}: Props) {
  const { hasError, isFocused, ...inputHandlers } = useMetricInput(value, { isRequired });
  return (
    <DefaultMetricStyle isFocused={isFocused} hasError={hasError}>
      <MetricInput
        {...inputHandlers}
        name={name}
        onBlur={() => {
          inputHandlers.onBlur();
          if (sourcePath && sourcePath.length > 0) {
            emitter.emit('INLINE_CHANGE', {
              name: name.substr(0, name.indexOf(sourcePath) + sourcePath.length),
              hasError,
              value: { ...getByPath(sourcePath, values), [destPath]: inputHandlers.value },
            });
          } else {
            emitter.emit('INLINE_CHANGE', {
              name,
              hasError,
              value: inputHandlers.value,
            });
          }
        }}
        metrics={metrics}
        convert={convert}
        align="left"
      />
    </DefaultMetricStyle>
  );
}

InlineMetricInput.defaultProps = defaultProps;
