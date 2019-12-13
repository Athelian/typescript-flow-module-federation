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
import BaseMetricValueInput from 'components/Inputs/MetricValueInput';
import NumberInput from 'components/Inputs/NumberInput';
import SelectInput from 'components/Inputs/SelectInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import MetricSelectInput from 'components/Sheet/CellRenderer/Cell/CellInput/Common/MetricValueInput';
import {
  CellInputWrapperStyle,
  InputStyle,
} from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import { SelectStyle } from './style';

const MetricValueInput = (
  metrics: Array<string>,
  defaultMetric: string,
  valueConverter: (value: number, from: any, to: any) => number
) => ({ value, onChange, readonly }: InputProps<MetricValue>) => (
  <div className={CellInputWrapperStyle}>
    <BaseMetricValueInput
      value={value}
      disabled={readonly}
      onChange={onChange}
      defaultMetric={defaultMetric}
      valueConverter={valueConverter}
      metrics={metrics}
      renderInput={inputProps => <NumberInput {...inputProps} className={InputStyle} />}
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
  </div>
);

export default {
  Volume: MetricValueInput(volumeMetrics, defaultVolumeMetric, convertVolume),
  Area: MetricValueInput(areaMetrics, defaultAreaMetric, convertArea),
  Length: MetricValueInput(distanceMetrics, defaultDistanceMetric, convertDistance),
  Mass: MetricValueInput(weightMetrics, defaultWeightMetric, convertWeight),
};
