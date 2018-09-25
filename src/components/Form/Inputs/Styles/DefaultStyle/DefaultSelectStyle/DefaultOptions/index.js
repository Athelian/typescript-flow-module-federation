// @flow
import React from 'react';
import { type RenderOptionsProps } from 'components/Form/Inputs/SelectInput/type';
import { OptionWrapperStyle, OptionStyle } from './style';

type OptionalProps = {
  align: 'left' | 'right' | 'center',
  width: string,
  height: string,
};

type Props = OptionalProps &
  RenderOptionsProps & {
    items: Array<any>,
    itemToValue: any => any,
    itemToString: any => string,
  };

const defaultProps = {
  align: 'right',
  width: '100%',
  height: '200px',
};

function DefaultOptions({
  items,
  itemToValue,
  itemToString,
  highlightedIndex,
  selectedItem,
  getItemProps,
  align,
  width,
  height,
}: Props) {
  return (
    <div className={OptionWrapperStyle(width, height)}>
      {items.map((item, index) => (
        <div
          key={`option-${itemToValue(item)}-${itemToString(item)}`}
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
