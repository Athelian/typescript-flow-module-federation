// @flow
import React from 'react';
import { type RenderOptionsProps } from 'components/Form/PureInputs/PureSelectInput/type';
import { OptionWrapperStyle, OptionStyle } from './style';

type Props = RenderOptionsProps & {
  items: Array<any>,
  itemToValue: any => any,
  itemToString: any => string,
};

function StandardOptions({
  items,
  itemToValue,
  itemToString,
  highlightedIndex,
  selectedItem,
  getItemProps,
}: Props) {
  return (
    <div className={OptionWrapperStyle}>
      {items.map((item, index) => (
        <div
          key={itemToValue(item) || item.id || `option-${index}`}
          className={OptionStyle(highlightedIndex === index, selectedItem === item)}
          {...getItemProps({ item })}
        >
          {itemToString(item)}
        </div>
      ))}
    </div>
  );
}

export default StandardOptions;
