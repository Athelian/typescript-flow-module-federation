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
import type { RenderInputProps, RenderOptionProps } from 'components/Inputs/SelectInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  CellInputWrapperStyle,
  InputStyle,
} from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import { SelectOptionStyle, SelectInputStyle, SelectStyle } from './style';

const MetricSelectInput = ({
  isOpen,
  selectedItem,
  getToggleButtonProps,
  itemToString,
}: RenderInputProps) => (
  <button
    type="button"
    className={SelectInputStyle}
    {...getToggleButtonProps({
      onKeyDown: e => {
        if (e.key === 'ArrowDown' || (isOpen && e.key === 'ArrowUp')) {
          e.stopPropagation();
        }
      },
    })}
  >
    {itemToString(selectedItem)}
  </button>
);

const MetricSelectOption = ({ item, selected, highlighted, itemToString }: RenderOptionProps) => (
  <div className={SelectOptionStyle(highlighted, selected)}>
    <span>{itemToString(item)}</span>
  </div>
);

const MetricValueInput = (
  metrics: Array<string>,
  defaultMetric: string,
  valueConverter: (value: number, from: any, to: any) => number
) => ({ value, onChange, readonly }: InputProps<MetricValue>) => (
  <div className={CellInputWrapperStyle}>
    <BaseMetricValueInput
      value={value}
      onChange={onChange}
      defaultMetric={defaultMetric}
      valueConverter={valueConverter}
      metrics={metrics}
      renderInput={inputProps => (
        <NumberInput {...inputProps} className={InputStyle} disabled={readonly} />
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
);

export default {
  Volume: MetricValueInput(volumeMetrics, defaultVolumeMetric, convertVolume),
  Area: MetricValueInput(areaMetrics, defaultAreaMetric, convertArea),
  Length: MetricValueInput(distanceMetrics, defaultDistanceMetric, convertDistance),
  Mass: MetricValueInput(weightMetrics, defaultWeightMetric, convertWeight),
};
