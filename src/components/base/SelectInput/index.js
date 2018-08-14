// @flow
import * as React from 'react';
import Downshift from 'downshift';
import { ResetNativeStyle } from './style';

type Props = {
  renderSelect: ({
    input: React.Node,
    isOpen: boolean,
    clearSelection: () => void,
    toggle: () => void,
    selectedItem: any,
  }) => React.Node,
  onChange?: any => void,
  items: Array<any>,
  itemToValue: any => any,
  itemToString: any => string,
  renderOption: ({ value: any, onHover: boolean, selected: boolean }) => React.Node,
  wrapperStyle?: { options: any },
  disabled?: boolean,
  required?: boolean,
  placeholder?: string,
};

const defaultProps = {
  onChange: () => {},
  disabled: false,
  required: false,
  placeholder: '',
  wrapperStyle: { options: '' },
};

function SelectInput({
  renderSelect,
  onChange,
  items,
  itemToValue,
  itemToString,
  renderOption,
  wrapperStyle = { select: '', options: '' },
  disabled,
  required,
  placeholder,
}: Props) {
  return (
    <Downshift onChange={onChange} itemToString={itemToString} itemToValue={itemToValue}>
      {({
        getItemProps,
        isOpen,
        toggleMenu,
        selectedItem,
        highlightedIndex,
        clearSelection,
        getInputProps,
      }) => (
        <div className={ResetNativeStyle}>
          {renderSelect({
            input: (
              <div onClick={toggleMenu} role="presentation">
                <input
                  readOnly
                  type="text"
                  {...getInputProps({
                    placeholder,
                    spellCheck: false,
                    disabled,
                    required,
                  })}
                />
              </div>
            ),
            isOpen,
            clearSelection,
            selectedItem,
            toggle: toggleMenu,
          })}
          {isOpen && (
            <ul className={wrapperStyle && wrapperStyle.options}>
              {items.map((item, index) => (
                <li key={itemToValue(item)} {...getItemProps({ item })}>
                  {renderOption({
                    value: item,
                    onHover: highlightedIndex === index,
                    selected: itemToValue(selectedItem) === itemToValue(item),
                  })}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Downshift>
  );
}

SelectInput.defaultProps = defaultProps;

export default SelectInput;
