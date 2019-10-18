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
  onFocus?: (SyntheticFocusEvent<any>) => void,
  onBlur?: (SyntheticFocusEvent<any>) => void,
};

export type RenderOptionProps = {
  item: any,
  selected: boolean,
  highlighted: boolean,
};

type Props = {
  value: any,
  onChange: any => void,
  onFocus?: (SyntheticFocusEvent<any>) => void,
  onBlur?: (SyntheticFocusEvent<any>) => void,
  items: Array<any>,
  filterItems: (query: string, items: Array<any>) => Array<any>,
  itemToString: any => string,
  itemToValue: any => any,
  optionWidth: number,
  optionHeight: number,
  inputRef?: { current: any },
  toggleRef?: { current: any },
  renderInput: RenderInputProps => React.Node,
  renderOption: RenderOptionProps => React.Node,
};

type OptionsProps = {
  inputValue: ?string,
  highlightedIndex: ?number,
  selectedItem: any,
  items: Array<any>,
  filterItems: (query: string, items: Array<any>) => Array<any>,
  optionWidth: number,
  optionHeight: number,
  renderOption: RenderOptionProps => React.Node,
  getMenuProps: Function,
  getItemProps: Function,
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

const SelectOptions = ({
  inputValue,
  highlightedIndex,
  selectedItem,
  items,
  filterItems,
  optionWidth,
  optionHeight,
  renderOption,
  getItemProps,
  getMenuProps,
}: OptionsProps) => {
  const availableItems = React.useMemo(() => {
    const query = (inputValue || '').trim();
    return query === '' ? items : filterItems(query, items);
  }, [inputValue, items, filterItems]);
  const height = Math.min(availableItems.length * optionHeight, 200);

  return (
    <div className={OptionsWrapperStyle(optionWidth, height)} {...getMenuProps()}>
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
  );
};

const SelectInput = ({
  value,
  onChange,
  onFocus,
  onBlur,
  items,
  filterItems,
  itemToString,
  itemToValue,
  optionWidth,
  optionHeight,
  inputRef,
  toggleRef,
  renderInput,
  renderOption,
}: Props) => {
  const internalInputRef = React.useRef<HTMLInputElement | null>(null);
  const handleChange = React.useCallback(item => onChange(itemToValue(item)), [
    onChange,
    itemToValue,
  ]);
  const itemValues = React.useMemo<Array<any>>(() => items.map(itemToValue), [items, itemToValue]);
  const selectedItem = React.useMemo<any>(() => {
    if (!value) {
      return null;
    }

    const index = itemValues.findIndex(itemValue => equals(itemValue, value));
    if (index === -1) {
      return null;
    }

    return items[index];
  }, [itemValues, items, value]);

  return (
    <Downshift
      selectedItem={selectedItem}
      onChange={handleChange}
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
      }) => (
        <div className={WrapperStyle}>
          {React.createElement(renderInput, {
            isOpen,
            selectedItem,
            getInputProps: props =>
              getInputProps({
                ...props,
                ref: ref => {
                  if (inputRef) {
                    // eslint-disable-next-line no-param-reassign
                    inputRef.current = ref;
                  }
                  internalInputRef.current = ref;
                },
                onClick: e => {
                  e.target.select();
                  openMenu();
                },
                onFocus,
                onBlur,
              }),
            getToggleButtonProps: props =>
              getToggleButtonProps({
                ...props,
                ref: ref => {
                  if (toggleRef) {
                    // eslint-disable-next-line no-param-reassign
                    toggleRef.current = ref;
                  }
                },
                onClick: () => {
                  if (internalInputRef.current) {
                    internalInputRef.current.focus();
                  }
                },
                onFocus,
                onBlur,
              }),
          })}
          {isOpen && (
            <SelectOptions
              inputValue={inputValue}
              highlightedIndex={highlightedIndex}
              selectedItem={selectedItem}
              items={items}
              filterItems={filterItems}
              optionWidth={optionWidth}
              optionHeight={optionHeight}
              renderOption={renderOption}
              getItemProps={getItemProps}
              getMenuProps={getMenuProps}
            />
          )}
        </div>
      )}
    </Downshift>
  );
};

export default SelectInput;
