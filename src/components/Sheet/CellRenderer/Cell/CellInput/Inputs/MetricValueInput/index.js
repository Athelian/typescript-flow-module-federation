// @flow
import * as React from 'react';
import BaseMetricValueInput from 'components/Inputs/MetricValueInput';
import NumberInput from 'components/Form/Inputs/NumberInput';
import SelectInput from 'components/Inputs/SelectInput';
import type { RenderInputProps, RenderOptionProps } from 'components/Inputs/SelectInput';
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
import type { InputProps } from '../../types';
import InputWrapper from '../InputWrapper';
import { SelectOptionStyle, SelectInputStyle, InputStyle } from './style';

const MetricSelectInput = ({
  isOpen,
  selectedItem,
  getToggleButtonProps,
  itemToString,
}: RenderInputProps) => {
  return (
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
};

const MetricSelectOption = ({ item, selected, highlighted, itemToString }: RenderOptionProps) => (
  <div className={SelectOptionStyle(highlighted, selected)}>
    <span>{itemToString(item)}</span>
  </div>
);

const MetricValueInput = (
  metrics: Array<string>,
  defaultMetric: string,
  valueConverter: (value: number, from: any, to: any) => number
) => ({
  value,
  onChange,
  focus,
  onFocus,
  onBlur,
  readonly,
  onKeyDown,
}: InputProps<MetricValue>) => {
  return (
    <BaseMetricValueInput
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      defaultMetric={defaultMetric}
      valueConverter={valueConverter}
      metrics={metrics}
      renderInput={inputProps => (
        <InputWrapper focus={focus} preselect>
          {({ ref }) => (
            <NumberInput
              {...inputProps}
              className={InputStyle}
              inputRef={ref}
              onKeyDown={e => {
                if (e.key === 'Tab') {
                  e.stopPropagation();
                } else {
                  onKeyDown(e);
                }
              }}
              tabIndex="-1"
              nullable={false}
              readOnly={readonly}
              readOnlyHeight="30px"
              readOnlyWidth="100%"
            />
          )}
        </InputWrapper>
      )}
      renderSelect={selectProps => (
        <SelectInput
          {...selectProps}
          optionWidth={30}
          optionHeight={30}
          renderInput={MetricSelectInput}
          renderOption={MetricSelectOption}
        />
      )}
    />
  );
};

export default {
  Volume: MetricValueInput(volumeMetrics, defaultVolumeMetric, convertVolume),
  Area: MetricValueInput(areaMetrics, defaultAreaMetric, convertArea),
  Length: MetricValueInput(distanceMetrics, defaultDistanceMetric, convertDistance),
  Mass: MetricValueInput(weightMetrics, defaultWeightMetric, convertWeight),
};
