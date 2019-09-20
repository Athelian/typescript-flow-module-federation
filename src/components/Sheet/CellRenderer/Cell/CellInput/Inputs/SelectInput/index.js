// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import BaseSelectInput from 'components/Form/Inputs/SelectInput';
import type { RenderSelectProps } from 'components/Form/Inputs/SelectInput/type';
import DefaultOptions from 'components/Form/Inputs/Styles/DefaultStyle/DefaultSelectStyle/DefaultOptions';
import InputWrapper from '../InputWrapper';
import { ArrowDownStyle, ClearButtonStyle, SelectInputStyle } from './style';

type Props = {
  value: any | null,
  onChange: any => void,
  onFocus: () => void,
  onBlur: () => void,
  items: Array<any>,
  itemToString: any => string,
  itemToValue: any => any,
  focus: boolean,
  readonly: boolean,
  required: boolean,
};

type SelectProps = {
  focus: boolean,
  required: boolean,
};

const Select = ({ required, focus }: SelectProps) => {
  return ({
    getInputProps,
    toggle,
    itemToString,
    selectedItem,
    clearSelection,
    isOpen,
  }: RenderSelectProps) => {
    return (
      <InputWrapper preselect={false} focus={focus}>
        {({ ref }) => (
          <>
            <input
              ref={ref}
              readOnly
              spellCheck={false}
              onClick={toggle}
              className={SelectInputStyle}
              {...getInputProps({
                value: itemToString(selectedItem) || '',
              })}
            />
            {!required && !!selectedItem && (
              <button type="button" onClick={clearSelection} className={ClearButtonStyle}>
                <Icon icon="CLEAR" />
              </button>
            )}
            <button type="button" onClick={toggle} className={ArrowDownStyle(isOpen)}>
              <Icon icon="CHEVRON_DOWN" />
            </button>
          </>
        )}
      </InputWrapper>
    );
  };
};

const SelectInput = ({
  value,
  onChange,
  onFocus,
  onBlur,
  items,
  itemToString,
  itemToValue,
  focus,
  readonly,
  required,
}: Props) => {
  return (
    <BaseSelectInput
      value={value}
      onChange={item => onChange(item ? itemToValue(item) : null)}
      afterClearSelection={() => onChange(null)}
      onFocus={onFocus}
      onBlur={onBlur}
      readOnly={readonly}
      name="value"
      items={items}
      itemToString={itemToString}
      itemToValue={itemToValue}
      renderSelect={Select({ required, focus })}
      renderOptions={optionsProps => <DefaultOptions {...optionsProps} width="200px" />}
    />
  );
};

export default SelectInput;
