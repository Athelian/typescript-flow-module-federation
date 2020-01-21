// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FixedSizeList } from 'react-window';
import Downshift from 'downshift';
import { equals } from 'ramda';
import usePortalSlot from 'hooks/usePortalSlot';
import { DownshiftStyle, OptionsWrapperStyle, DefaultOptionStyle } from './style';

export type RenderInputProps = {
  isOpen: boolean,
  required?: boolean,
  selectedItem: any,
  clearSelection: Function,
  getInputProps: Function,
  getToggleButtonProps: Function,
  itemToString: any => string,
};

export type RenderOptionProps = {
  item: any,
  selected: boolean,
  highlighted: boolean,
  itemToString: any => string,
};

type Props = {
  value: any,
  disabled?: boolean,
  required?: boolean,
  onChange: any => void,
  onFocus?: (SyntheticFocusEvent<any>) => void,
  onBlur?: (SyntheticFocusEvent<any>) => void,
  items: Array<any>,
  filterItems?: (query: string, items: Array<any>) => Array<any>,
  itemToString: any => string,
  itemToValue: any => any,
  optionWidth?: number,
  optionHeight?: number,
  inputRef?: { current: any },
  toggleRef?: { current: any },
  renderInput: RenderInputProps => React.Node,
  renderOption: RenderOptionProps => React.Node,
};

const defaultProps = {
  filterItems: (query, items) => items,
  optionWidth: 200,
  optionHeight: 30,
};

type OptionsProps = {
  inputValue: ?string,
  highlightedIndex: ?number,
  selectedItem: any,
  items: Array<any>,
  filterItems: (query: string, items: Array<any>) => Array<any>,
  itemToString: any => string,
  isOpen: boolean,
  closeMenu: () => any,
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
    itemToString: any => string,
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
        itemToString: data.itemToString,
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
  itemToString,
  isOpen,
  closeMenu,
  optionWidth,
  optionHeight,
  renderOption,
  getItemProps,
  getMenuProps,
}: OptionsProps) => {
  const slot = usePortalSlot();
  const companionRef = React.useRef<HTMLDivElement | null>(null);
  const optionsRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!isOpen || !companionRef.current || !optionsRef.current) {
      return;
    }

    const viewportOffset: ClientRect = companionRef.current.getBoundingClientRect();
    // $FlowFixMe
    optionsRef.current.style.top = `${viewportOffset.top + viewportOffset.height}px`;
    // $FlowFixMe
    optionsRef.current.style.left = `${viewportOffset.left}px`;
  }, [companionRef, optionsRef, isOpen]);

  React.useEffect(() => {
    const opts = { capture: false, passive: true };
    const listener: WheelEventHandler = e => {
      // $FlowFixMe
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener('wheel', listener, opts);
    return () => document.removeEventListener('wheel', listener, opts);
  }, [closeMenu]);

  const availableItems = React.useMemo(() => {
    const query = (inputValue || '').trim();
    return query === '' ? items : filterItems(query, items);
  }, [inputValue, items, filterItems]);
  const height = Math.min(availableItems.length * optionHeight, 200);

  return (
    <>
      <div ref={companionRef} />
      {ReactDOM.createPortal(
        <div
          className={OptionsWrapperStyle(optionWidth, height)}
          {...getMenuProps({
            ref: ref => {
              optionsRef.current = ref;
            },
          })}
        >
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
              itemToString,
              renderOption,
            }}
          >
            {OptionRenderer}
          </FixedSizeList>
        </div>,
        slot
      )}
    </>
  );
};

const DefaultRenderSelectOption = ({
  selected,
  highlighted,
  item,
  itemToString,
}: RenderOptionProps) => (
  <div className={DefaultOptionStyle(highlighted, selected)}>
    <span>{itemToString(item)}</span>
  </div>
);

const SelectInput = (props: Props) => {
  const {
    value,
    disabled,
    required,
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
  } = {
    ...defaultProps,
    ...props,
  };

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
        inputValue,
        openMenu,
        closeMenu,
        clearSelection,
        isOpen,
      }) => (
        <div className={DownshiftStyle}>
          {React.createElement(renderInput, {
            isOpen,
            required,
            selectedItem,
            itemToString,
            clearSelection,
            getInputProps: inputProps =>
              getInputProps({
                ...inputProps,
                ref: ref => {
                  if (inputRef) {
                    // eslint-disable-next-line no-param-reassign
                    inputRef.current = ref;
                  }
                },
                onClick: () => {
                  if (!isOpen) {
                    openMenu();
                  }
                },
                onFocus: e => {
                  if (e.target.select) {
                    e.target.select();
                  }
                  if (onFocus) {
                    onFocus(e);
                  }
                  if (!isOpen) {
                    openMenu();
                  }
                },
                onBlur,
                disabled,
              }),
            getToggleButtonProps: buttonProps =>
              getToggleButtonProps({
                ...buttonProps,
                ref: ref => {
                  if (toggleRef) {
                    // eslint-disable-next-line no-param-reassign
                    toggleRef.current = ref;
                  }
                },
                onFocus: () => {
                  if (!isOpen) {
                    setTimeout(() => openMenu(), 100);
                  }
                },
                disabled,
              }),
          })}
          {isOpen && (
            <SelectOptions
              inputValue={inputValue}
              highlightedIndex={highlightedIndex}
              selectedItem={selectedItem}
              items={items}
              filterItems={filterItems}
              itemToString={itemToString}
              isOpen={isOpen}
              closeMenu={closeMenu}
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

SelectInput.DefaultRenderSelectOption = DefaultRenderSelectOption;

export default SelectInput;
