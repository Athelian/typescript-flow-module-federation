// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { SearchSelectInput, DefaultSearchSelect, DefaultOptions } from 'components/Form';
// import { useTextInput } from 'modules/relationMap/common/TableInlineEdit/hooks';

import { EnumInputStyle, DeleteButtonStyle } from './style';

type Props = {
  data: Array<string>,
  value: string,
};

export default function EnumInput({ data, value }: Props) {
  // const {
  //   hasError,
  //   isFocused,
  //   ...inputHandlers
  // } = useTextInput(value, { isRequired: false });
  return (
    <div className={EnumInputStyle}>
      <SearchSelectInput
        items={data}
        itemToString={item => (item ? item.description || item.name : '')}
        itemToValue={item => (item ? item.name : '')}
        inputValue={value}
        renderSelect={({ ...rest }) => (
          <DefaultSearchSelect
            {...rest}
            forceHoverStyle
            width="200px"
            itemToString={item => (item ? item.description || item.name : '')}
            align="left"
          />
        )}
        renderOptions={({ ...rest }) => (
          <DefaultOptions
            {...rest}
            items={data}
            itemToString={item => (item ? item.description || item.name : '')}
            itemToValue={item => (item ? item.name : '')}
            width="200px"
            align="left"
          />
        )}
      />
      <button className={DeleteButtonStyle} type="button">
        <Icon icon="REMOVE" />
      </button>
    </div>
  );
}
