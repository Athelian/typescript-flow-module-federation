// @flow
import * as React from 'react';
import { CONTAINER_TYPE_ITEMS } from 'modules/container/constants';
import type { InputProps } from '../../types';
import SelectInput from '../SelectInput';

const SelectEnumInput = (items: Array<{ value: any, label: string }>, required: boolean) => (
  props: InputProps<string>
) => {
  const itemToStringFunc = item => (item ? item.label : '');
  const itemToValueFunc = item => (item ? item.value : '');

  return (
    <SelectInput
      {...props}
      required={required}
      items={items}
      itemToString={itemToStringFunc}
      itemToValue={itemToValueFunc}
    />
  );
};

export default {
  ContainerType: SelectEnumInput(CONTAINER_TYPE_ITEMS, false),
};
