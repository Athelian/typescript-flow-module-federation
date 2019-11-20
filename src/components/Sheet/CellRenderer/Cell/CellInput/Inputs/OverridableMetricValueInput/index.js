// @flow
import * as React from 'react';
import type { MetricValue } from 'types';
import {
  areaMetrics,
  convertArea,
  convertDistance,
  convertVolume,
  convertWeight,
  defaultAreaMetric,
  defaultDistanceMetric,
  defaultVolumeMetric,
  defaultWeightMetric,
  distanceMetrics,
  volumeMetrics,
  weightMetrics,
} from 'utils/metric';
import Icon from 'components/Icon';
import { ToggleInput } from 'components/Form';
import NumberInput from 'components/Inputs/NumberInput';
import SelectInput from 'components/Inputs/SelectInput';
import BaseMetricValueInput from 'components/Inputs/MetricValueInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  CellInputWrapperStyle,
  InputStyle,
} from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import {
  MetricSelectInput,
  MetricSelectOption,
} from 'components/Sheet/CellRenderer/Cell/CellInput/Common/MetricValueInput';
import { WrapperStyle, CalculatorIconStyle, SelectStyle } from './style';

const OverridableMetricValueInput = (
  metrics: Array<string>,
  defaultMetric: string,
  valueConverter: (value: number, from: any, to: any) => number
  // eslint-disable-next-line flowtype/space-after-type-colon
) => ({
  value,
  context,
  readonly,
  onChange,
}: // eslint-disable-next-line flowtype/generic-spacing
InputProps<
  {
    value: ?MetricValue,
    auto: boolean,
    displayMetric: string,
  },
  MetricValue
>) => {
  const currentValue = value?.auto ? context : value?.value;
  const currentDisplayMetric = value?.displayMetric ?? defaultMetric;
  const displayValue = {
    value: valueConverter(
      currentValue?.value ?? 0,
      currentValue?.metric ?? currentDisplayMetric,
      currentDisplayMetric
    ),
    metric: currentDisplayMetric,
  };

  return (
    <div className={WrapperStyle(value?.auto ?? false)}>
      <div className={CellInputWrapperStyle}>
        <BaseMetricValueInput
          value={displayValue}
          disabled={readonly}
          onChange={newValue =>
            onChange({
              value: newValue,
              displayMetric: newValue.metric,
              auto: value?.auto ?? false,
            })
          }
          defaultMetric={currentDisplayMetric}
          valueConverter={valueConverter}
          metrics={metrics}
          renderInput={inputProps => (
            <NumberInput
              {...inputProps}
              className={InputStyle}
              disabled={readonly || (value?.auto ?? false)}
            />
          )}
          renderSelect={selectProps => (
            <div className={SelectStyle}>
              <SelectInput
                {...selectProps}
                optionWidth={30}
                optionHeight={30}
                renderInput={MetricSelectInput}
                renderOption={MetricSelectOption}
              />
            </div>
          )}
        />
      </div>

      <div className={CalculatorIconStyle}>
        <Icon icon="CALCULATOR" />
      </div>

      <ToggleInput
        editable={!readonly}
        toggled={value?.auto ?? false}
        onToggle={() => {
          const auto = !(value?.auto ?? false);
          onChange(
            {
              value: auto ? context : value?.value,
              displayMetric: currentDisplayMetric,
              auto,
            },
            true
          );
        }}
      />
    </div>
  );
};

export default {
  Volume: OverridableMetricValueInput(volumeMetrics, defaultVolumeMetric, convertVolume),
  Area: OverridableMetricValueInput(areaMetrics, defaultAreaMetric, convertArea),
  Length: OverridableMetricValueInput(distanceMetrics, defaultDistanceMetric, convertDistance),
  Mass: OverridableMetricValueInput(weightMetrics, defaultWeightMetric, convertWeight),
};
