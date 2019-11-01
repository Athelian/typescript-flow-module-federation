// @flow
import * as React from 'react';
import BaseMetricValueInput from 'components/Inputs/MetricValueInput';
import NumberInput from 'components/Form/Inputs/NumberInput';
import SelectInput from 'components/Inputs/SelectInput';
import type { RenderInputProps, RenderOptionProps } from 'components/Inputs/SelectInput';
import {
  areaMetrics,
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

const MetricValueInput = (metrics: Array<string>, defaultMetric: string) => ({
  value,
  onChange,
  focus,
  onFocus,
  onBlur,
  readonly,
  onKeyDown,
}: InputProps<{ value: number, metric: string }>) => {
  return (
    <BaseMetricValueInput
      /* $FlowFixMe This comment suppresses an error found when upgrading Flow
       * to v0.111.0. To view the error, delete this comment and run Flow. */
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      defaultMetric={defaultMetric}
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
  Volume: MetricValueInput(volumeMetrics, defaultVolumeMetric),
  Area: MetricValueInput(areaMetrics, defaultAreaMetric),
  Length: MetricValueInput(distanceMetrics, defaultDistanceMetric),
  Mass: MetricValueInput(weightMetrics, defaultWeightMetric),
};
