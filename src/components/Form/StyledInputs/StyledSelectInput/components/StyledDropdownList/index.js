// @flow
import React from 'react';
import { OptionWrapperStyle, OptionStyle } from './style';

type Props = {
  items: Array<any>,
  itemToValue: any => any,
  itemToString: any => string,
  getItemProps: Function,
  selectedItem: any,
  highlightedIndex: number,
};

function StyledDropDownList({
  items,
  itemToValue,
  itemToString,
  getItemProps,
  selectedItem,
  highlightedIndex,
}: Props) {
  return (
    <div className={OptionWrapperStyle}>
      {items.map((item, index) => (
        <div
          key={itemToValue(item)}
          className={OptionStyle(highlightedIndex === index, selectedItem === item)}
          {...getItemProps({ item })}
        >
          {itemToString(item)}
        </div>
      ))}
    </div>
  );
}

export default StyledDropDownList;
