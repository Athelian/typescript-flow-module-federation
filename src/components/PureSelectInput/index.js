// @flow
import * as React from 'react';
import Downshift from 'downshift';
import { ResetNativeStyle } from './style';

type Props = {
  value: ?any,
  optionWrapperStyle: any,
  onChange?: ({ title: string, value: string }) => void,
  onBlur?: (string, boolean) => void,
  items: Array<any>,
  itemToValue: any => any,
  itemToString: any => string,
  children: React.Node,
  renderItem: ({ value: any, isActive: boolean, selected: boolean }) => React.Node,
};

const defaultProps = {
  onChange: () => {},
  onBlur: () => {},
};

function PureSelectInput({
  onChange,
  renderItem,
  items,
  itemToValue,
  itemToString,
  children,
  optionWrapperStyle,
}: Props) {
  return (
    <Downshift onChange={onChange} itemToString={itemToString} itemToValue={itemToValue}>
      {({
        getInputProps,
        getMenuProps,
        getItemProps,
        isOpen,
        toggleMenu,
        selectedItem,
        highlightedIndex,
      }) => (
        <div className={ResetNativeStyle}>
          <div onClick={toggleMenu} role="presentation">
            {children}
          </div>
          {isOpen && (
            <ul className={optionWrapperStyle} {...getInputProps} {...getMenuProps()}>
              {items.map((item, index) => (
                <li {...getItemProps({ item })}>
                  {renderItem({
                    value: item,
                    isActive: highlightedIndex === index,
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

PureSelectInput.defaultProps = defaultProps;

export default PureSelectInput;
