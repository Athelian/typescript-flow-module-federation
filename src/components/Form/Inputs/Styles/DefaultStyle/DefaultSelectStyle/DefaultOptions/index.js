// @flow
import React from 'react';
import VirtualList from 'react-tiny-virtual-list';
import { type RenderOptionsProps } from 'components/Form/Inputs/SelectInput/type';
import { OptionWrapperStyle, OptionStyle } from './style';

type OptionalProps = {
  type: 'standard' | 'label',
  width: string,
  height: string,
  dropDirection: 'down' | 'up',
};

type Props = OptionalProps &
  RenderOptionsProps & {
    items: Array<any>,
    itemToValue: any => any,
    itemToString: any => string,
    align: 'left' | 'right' | 'center',
  };

const defaultProps = {
  type: 'standard',
  width: '100%',
  height: '200px',
  dropDirection: 'down',
};

const removePx = (size: string): number => {
  if (size.indexOf('px')) {
    return Number(size.replace('px', ''));
  }
  return 0;
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
  dropDirection,
}: Props) {
  const rawHeight = removePx(height);
  const numItemsInAPage = Math.ceil(rawHeight / 30);

  return (
    <div className={OptionWrapperStyle({ width, height, dropDirection })}>
      {items.length > 0 ? (
        <VirtualList
          height={items.length < numItemsInAPage ? items.length * 30 : rawHeight}
          width={removePx(width)}
          itemCount={items.length}
          itemSize={30}
          overscanCount={numItemsInAPage}
          renderItem={({ index, style }) => {
            const item = items[index];
            if (!item) return null;
            return (
              <div
                key={itemToValue(item)}
                className={OptionStyle({
                  onHover: highlightedIndex === index,
                  selected: selectedItem === item,
                  align,
                  type,
                })}
                {...getItemProps({
                  index,
                  item,
                  style,
                })}
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
