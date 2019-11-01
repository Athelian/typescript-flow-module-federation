// @flow
import * as React from 'react';
import { CONTAINER_TYPE_ITEMS } from 'modules/container/constants';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import SelectInput from '../SelectInput';

const SelectCustomInput = (items: Array<{ value: any, label: string }>, required: boolean) => (
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
  ContainerType: SelectCustomInput(CONTAINER_TYPE_ITEMS, false),
};
