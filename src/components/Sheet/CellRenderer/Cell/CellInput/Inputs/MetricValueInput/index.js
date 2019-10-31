// @flow
import * as React from 'react';
import BaseMetricValueInput from 'components/Inputs/MetricValueInput';
import NumberInput from 'components/Form/Inputs/NumberInput';
import SelectInput from 'components/Inputs/SelectInput';
import type { RenderInputProps, RenderOptionProps } from 'components/Inputs/SelectInput';
import { areaMetrics, distanceMetrics, volumeMetrics, weightMetrics } from 'utils/metric';
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

const MetricValueInput = (metrics: Array<string>) => ({
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
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      defaultMetric={metrics[0]}
      metrics={metrics}
      renderInput={inputProps => (
        <InputWrapper focus={focus}>
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
  Volume: MetricValueInput(volumeMetrics),
  Area: MetricValueInput(areaMetrics),
  Length: MetricValueInput(distanceMetrics),
  Mass: MetricValueInput(weightMetrics),
};
