// @flow
import * as React from 'react';
import Downshift from 'downshift';
import Icon from 'components/Icon';
import { ResetNativeStyle, ArrowDownStyle } from './style';

type Props = {
  renderSelect: (?React.Node) => React.Node,
  onChange?: any => void,
  items: Array<any>,
  itemToValue: any => any,
  itemToString: any => string,
  renderOption: ({ value: any, onHover: boolean, selected: boolean }) => React.Node,
  wrapperStyle: { select: any, options: any },
  disabled?: boolean,
  required?: boolean,
  placeholder?: string,
};

const defaultProps = {
  onChange: () => {},
  disabled: false,
  required: false,
  placeholder: '',
};

function SelectInput({
  renderSelect,
  onChange,
  items,
  itemToValue,
  itemToString,
  renderOption,
  wrapperStyle,
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
          <div className={wrapperStyle.select}>
            {renderSelect(
              <React.Fragment>
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
                {selectedItem &&
                  !required && (
                    <button type="button" onClick={clearSelection}>
                      <Icon icon="CLEAR" />
                    </button>
                  )}
                <button type="button" onClick={toggleMenu} className={ArrowDownStyle(isOpen)}>
                  <Icon icon="CHEVRON_DOWN" />
                </button>
              </React.Fragment>
            )}
          </div>
          {isOpen && (
            <ul className={wrapperStyle.options}>
              {items.map((item, index) => (
                <li key={item.value} {...getItemProps({ item })}>
                  {renderOption({
                    value: item,
                    onHover: highlightedIndex === index,
                    selected: selectedItem === item,
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
