// @flow
import * as React from 'react';
import { FixedSizeList } from 'react-window';
import Downshift from 'downshift';
import { equals } from 'ramda';
import { WrapperStyle, OptionsWrapperStyle } from './style';

export type RenderInputProps = {
  isOpen: boolean,
  selectedItem: any,
  getInputProps: Function,
  getToggleButtonProps: Function,
};

export type RenderOptionProps = {
  item: any,
  selected: boolean,
  highlighted: boolean,
};

type Props = {
  value: any,
  onChange: any => void,
  items: Array<any>,
  filterItems: (query: string, items: Array<any>) => Array<any>,
  itemToString: any => string,
  itemToValue: any => any,
  optionWidth: number,
  optionHeight: number,
  renderInput: RenderInputProps => React.Node,
  renderOption: RenderOptionProps => React.Node,
};

type OptionProps = {
  index: number,
  style: Object,
  data: {
    items: Array<any>,
    getItemProps: Function,
    highlightedIndex: ?number,
    selectedItem: any,
    renderOption: RenderOptionProps => React.Node,
  },
};

const OptionRenderer = ({ index, style, data }: OptionProps) => {
  const item = data.items[index];

  return (
    <div
      {...data.getItemProps({
        index,
        item,
        style,
      })}
    >
      {data.renderOption({
        item,
        selected: data.selectedItem === item,
        highlighted: data.highlightedIndex === index,
      })}
    </div>
  );
};

const SearchSelectInput = ({
  value,
  onChange,
  items,
  filterItems,
  itemToString,
  itemToValue,
  optionWidth,
  optionHeight,
  renderInput,
  renderOption,
}: Props) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const selectedItem = (value && items.find(item => equals(itemToValue(item), value))) || null;

  return (
    <Downshift
      selectedItem={selectedItem}
      onChange={item => onChange(itemToValue(item))}
      initialInputValue={itemToString(selectedItem)}
      itemToString={itemToString}
    >
      {({
        getToggleButtonProps,
        getInputProps,
        getItemProps,
        getMenuProps,
        highlightedIndex,
        // $FlowFixMe: downshift types is broken
        inputValue,
        openMenu,
        isOpen,
      }) => {
        const availableItems = filterItems(inputValue, items);
        const height = Math.min(availableItems.length * optionHeight, 200);

        return (
          <div className={WrapperStyle}>
            {React.createElement(renderInput, {
              isOpen,
              selectedItem,
              getInputProps: props =>
                getInputProps({
                  ...props,
                  ref: inputRef,
                  onClick: e => {
                    e.target.select();
                    openMenu();
                  },
                }),
              getToggleButtonProps: props =>
                getToggleButtonProps({
                  ...props,
                  onClick: () => {
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  },
                }),
            })}
            {isOpen && (
              <div className={OptionsWrapperStyle(height)} {...getMenuProps()}>
                <FixedSizeList
                  width={optionWidth}
                  height={height}
                  itemCount={availableItems.length}
                  itemSize={optionHeight}
                  itemData={{
                    items: availableItems,
                    getItemProps,
                    highlightedIndex,
                    selectedItem,
                    renderOption,
                  }}
                >
                  {OptionRenderer}
                </FixedSizeList>
              </div>
            )}
          </div>
        );
      }}
    </Downshift>
  );
};

export default SearchSelectInput;
