// @flow
import React from 'react';
import VirtualList from 'react-tiny-virtual-list';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import { OptionWrapperStyle, OptionStyle, SelectedWrapperStyle } from './style';

type OptionalProps = {
  width: string,
  height: string,
  dropDirection: 'down' | 'up',
};

type Props = OptionalProps & {
  highlightedIndex: ?number,
  getItemProps: Function,
  items: Array<any>,
  selectedItems: Array<any>,
  itemToValue: any => any,
  itemToString: any => string,
  align: 'left' | 'right' | 'center',
};

const defaultProps = {
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

function TagSelectOptions({
  selectedItems,
  items,
  highlightedIndex,
  getItemProps,
  align,
  width,
  height,
  dropDirection,
}: Props) {
  const rawHeight = removePx(height);
  const numItemsInAPage = Math.ceil(rawHeight / 30);

  return (
    <div className={OptionWrapperStyle({ width, height, dropDirection, align })}>
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

            const isSelected = selectedItems && selectedItems.map(t => t.id).includes(item.id);

            return (
              <div
                key={item.id}
                className={OptionStyle({
                  onHover: highlightedIndex === index,
                  selected: isSelected,
                  align,
                })}
                {...getItemProps({
                  index,
                  item,
                  style,
                })}
              >
                <div className={SelectedWrapperStyle}>{isSelected && <Icon icon="CONFIRM" />}</div>
                <Tag tag={item} />
              </div>
            );
          }}
        />
      ) : null}
    </div>
  );
}

TagSelectOptions.defaultProps = defaultProps;

export default TagSelectOptions;
