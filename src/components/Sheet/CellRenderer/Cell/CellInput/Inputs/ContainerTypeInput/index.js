// @flow
import * as React from 'react';
import { CONTAINER_TYPE_ITEMS } from 'modules/container/constants';
import SelectInput from '../SelectInput';
import type { InputProps } from '../../types';

const ContainerTypeInput = ({ value, focus, onChange, onFocus, onBlur }: InputProps<string>) => {
  const itemToStringFunc = item => (item ? item.label : '');
  const itemToValueFunc = item => (item ? item.value : '');

  return (
    <SelectInput
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      focus={focus}
      items={CONTAINER_TYPE_ITEMS}
      itemToString={itemToStringFunc}
      itemToValue={itemToValueFunc}
    />
  );
};

export default ContainerTypeInput;
