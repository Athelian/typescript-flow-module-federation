// @flow
import * as React from 'react';
import DefaultMetricStyle from 'components/Form/Inputs/MetricInput/DefaultMetricStyle';
import MetricInput from 'components/Form/Inputs/MetricInput';
import { useMetricInput } from 'modules/form/hooks';
import type { MetricValue as MetricInputType } from 'types';
import { getByPath } from 'utils/fp';
import emitter from 'utils/emitter';

type OptionalProps = {
  isRequired: boolean,
  sourcePath: string,
  destPath: string,
};

type Props = OptionalProps & {
  name: string,
  value: ?MetricInputType,
  metrics: Array<string>,
  convert: Function,
  values: Object,
  id: string,
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
  id,
}: Props) {
  const { hasError, isFocused, ...inputHandlers } = useMetricInput(value, { isRequired });
  return (
    <DefaultMetricStyle isFocused={isFocused} hasError={hasError} tabIndex="-1">
      {/* $FlowFixMe says it needs intl but really it doesnt */}
      <MetricInput
        {...inputHandlers}
        id={`input-${id}`}
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
