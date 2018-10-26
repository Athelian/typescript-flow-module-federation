// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { FieldItem, Label, Tooltip } from 'components/Form';
import DefaultMetricStyle from 'components/Form/Inputs/MetricInput/DefaultMetricStyle';
import MetricInput from 'components/Form/Inputs/MetricInput';

import { CalculatorButtonStyle } from '../numberInput/style';
import { type MetricInputProps } from './type';

type Props = MetricInputProps & {
  metrics: Array<string>,
  convert: Function,
};

const metricInputFactory = ({
  required = false,
  width = '200px',
  height = '30px',
  calculate,
  isNew,
  label,
  inputHandlers,
  originalValue,
  metrics,
  convert,
  metricSelectWidth,
  metricOptionWidth,
}: Props) => {
  const { isTouched, errorMessage, isFocused, ...inputHandler } = inputHandlers;
  return (
    <FieldItem
      label={
        label && (
          <Label required={required} width={width}>
            {label}
          </Label>
        )
      }
      tooltip={
        <Tooltip
          isNew={isNew}
          errorMessage={isTouched && errorMessage}
          changedValues={{
            oldValue: `${originalValue.value} ${originalValue.metric}`,
            newValue: `${inputHandlers.value.value} ${inputHandlers.value.metric}`,
          }}
        />
      }
      input={
        <>
          <DefaultMetricStyle
            isFocused={isFocused}
            hasError={isTouched && !!errorMessage}
            forceHoverStyle={isNew}
            width={width}
            height={height}
          >
            <MetricInput
              {...inputHandler}
              metricSelectWidth={metricSelectWidth}
              metricOptionWidth={metricOptionWidth}
              metrics={metrics}
              convert={convert}
            />
          </DefaultMetricStyle>
          {calculate &&
            !isFocused && (
              <button className={CalculatorButtonStyle} type="button" onClick={calculate}>
                <Icon icon="CALCULATOR" />
              </button>
            )}
        </>
      }
    />
  );
};

export default metricInputFactory;
