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
import SelectInput from 'components/Inputs/SelectInput';
import NumberInput from 'components/Inputs/NumberInput';
import BaseMetricValueInput from 'components/Inputs/MetricValueInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  InputStyle,
  AutocalculateInputWrapperStyle,
} from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import { SelectStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Inputs/MetricValueInput/style';
import MetricSelectInput from 'components/Sheet/CellRenderer/Cell/CellInput/Common/MetricValueInput';
import ComputableInput from 'components/Sheet/CellRenderer/Cell/CellInput/Common/ComputableInput';

const MetricValueToggleInput = (
  metrics: Array<string>,
  defaultMetric: string,
  valueConverter: (value: number, from: any, to: any) => number
) => (props: InputProps<{ value: ?MetricValue, auto: boolean }, MetricValue>) => (
  <ComputableInput
    {...props}
    input={({ value, auto, readonly, onChange }) => {
      const inputValue = {
        value: valueConverter(
          value?.value ?? 0,
          value?.metric ?? defaultMetric,
          props.value?.value?.metric ?? defaultMetric
        ),
        metric: props.value?.value?.metric ?? defaultMetric,
      };

      return (
        <BaseMetricValueInput
          value={inputValue}
          disabled={readonly}
          onChange={onChange}
          defaultMetric={defaultMetric}
          valueConverter={valueConverter}
          metrics={metrics}
          renderInput={inputProps => (
            <div className={AutocalculateInputWrapperStyle(readonly || auto)}>
              <NumberInput {...inputProps} className={InputStyle} disabled={readonly || auto} />
            </div>
          )}
          renderSelect={selectProps => (
            <div className={SelectStyle}>
              <SelectInput
                {...selectProps}
                optionWidth={30}
                optionHeight={30}
                renderInput={MetricSelectInput}
                renderOption={SelectInput.DefaultRenderSelectOption}
              />
            </div>
          )}
        />
      );
    }}
  />
);

export default {
  Volume: MetricValueToggleInput(volumeMetrics, defaultVolumeMetric, convertVolume),
  Area: MetricValueToggleInput(areaMetrics, defaultAreaMetric, convertArea),
  Length: MetricValueToggleInput(distanceMetrics, defaultDistanceMetric, convertDistance),
  Mass: MetricValueToggleInput(weightMetrics, defaultWeightMetric, convertWeight),
};
