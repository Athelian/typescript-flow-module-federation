// @flow
import * as React from 'react';
import Downshift from 'downshift';
import { ResetNativeStyle } from './style';

type Props = {
  children: React.Node,
  onChange?: ({ title: string, value: string }) => void,
  items: Array<any>,
  itemToValue: any => any,
  itemToString: any => string,
  optionWrapperStyle: any,
  renderItem: ({ value: any, onHover: boolean, selected: boolean }) => React.Node,
};

const defaultProps = {
  onChange: () => {},
};

function PureSelectInput({
  children,
  onChange,
  items,
  itemToValue,
  itemToString,
  optionWrapperStyle,
  renderItem,
}: Props) {
  return (
    <Downshift onChange={onChange} itemToString={itemToString} itemToValue={itemToValue}>
      {({ getMenuProps, getItemProps, isOpen, toggleMenu, selectedItem, highlightedIndex }) => (
        <div className={ResetNativeStyle}>
          <div onClick={toggleMenu} role="presentation">
            {children}
          </div>
          {isOpen && (
            <ul className={optionWrapperStyle} {...getMenuProps()}>
              {items.map((item, index) => (
                <li key={item.value} {...getItemProps({ item })}>
                  {renderItem({
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

PureSelectInput.defaultProps = defaultProps;

export default PureSelectInput;
