// @flow
import React from 'react';
import VirtualList from 'react-tiny-virtual-list';
import { type RenderOptionsProps } from 'components/Form/Inputs/SelectInput/type';
import { OptionWrapperStyle, OptionStyle } from './style';

type OptionalProps = {
  type: 'standard' | 'label',
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
  type: 'standard',
  align: 'right',
  width: '100%',
  height: '200px',
};

const removePx = (size: string) => {
  if (size.indexOf('px')) return size.replace('px', '');
  return size;
};

function DefaultOptions({
  type,
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
      {items.length > 0 ? (
        <VirtualList
          width={removePx(width)}
          scrollToIndex={highlightedIndex || 0}
          scrollToAlignment="auto"
          height={removePx(height)}
          itemCount={items.length}
          itemSize={30}
          renderItem={({ index, style }) => {
            const item = items[index];
            if (!item) return null;
            return (
              <div
                key={`option-${itemToValue(item)}-${itemToString(item)}`}
                className={OptionStyle({
                  onHover: highlightedIndex === index,
                  selected: selectedItem === item,
                  align,
                  type,
                })}
                {...getItemProps({ item, style })}
              >
                {itemToString(item)}
              </div>
            );
          }}
        />
      ) : null}
    </div>
  );
}

DefaultOptions.defaultProps = defaultProps;

export default DefaultOptions;
