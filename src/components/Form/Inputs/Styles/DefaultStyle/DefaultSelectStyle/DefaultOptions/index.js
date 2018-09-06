// @flow
import React from 'react';
import { type RenderOptionsProps } from 'components/Form/Inputs/SelectInput/type';
import { OptionWrapperStyle, OptionStyle } from './style';

type OptionalProps = {
  align: 'left' | 'right' | 'center',
};

type Props = OptionalProps &
  RenderOptionsProps & {
    items: Array<any>,
    itemToValue: any => any,
    itemToString: any => string,
  };

const defaultProps = {
  align: 'right',
};

function DefaultOptions({
  items,
  itemToValue,
  itemToString,
  highlightedIndex,
  selectedItem,
  getItemProps,
  align,
}: Props) {
  return (
    <div className={OptionWrapperStyle}>
      {items.map((item, index) => (
        <div
          key={itemToValue(item) || item.id || `option-${index}`}
          className={OptionStyle(highlightedIndex === index, selectedItem === item, align)}
          {...getItemProps({ item })}
        >
          {itemToString(item)}
        </div>
      ))}
    </div>
  );
}

DefaultOptions.defaultProps = defaultProps;

export default DefaultOptions;
