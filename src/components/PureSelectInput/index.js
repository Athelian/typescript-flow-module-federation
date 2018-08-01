// @flow
import * as React from 'react';
import Downshift from 'downshift';
import { ResetNativeStyle } from './style';

type Props = {
  renderSelect: (?React.Node) => React.Node,
  onChange?: ({ title: string, value: string }) => void,
  items: Array<any>,
  itemToValue: any => any,
  itemToString: any => string,
  clearIcon?: React.Node,
  renderOption: ({ value: any, onHover: boolean, selected: boolean }) => React.Node,
  styles: { select: any, options: any },
};

const defaultProps = {
  onChange: () => {},
  clearIcon: null,
};

function PureSelectInput({
  renderSelect,
  onChange,
  items,
  itemToValue,
  itemToString,
  renderOption,
  clearIcon,
  styles,
}: Props) {
  return (
    <Downshift onChange={onChange} itemToString={itemToString} itemToValue={itemToValue}>
      {({
        getMenuProps,
        getItemProps,
        isOpen,
        toggleMenu,
        selectedItem,
        highlightedIndex,
        clearSelection,
      }) => (
        <div className={ResetNativeStyle}>
          <div className={styles.select}>
            <div onClick={toggleMenu} role="presentation">
              {renderSelect(
                selectedItem && clearIcon ? (
                  <button type="button" onClick={clearSelection}>
                    {clearIcon}
                  </button>
                ) : null
              )}
            </div>
          </div>
          {isOpen && (
            <ul className={styles.options} {...getMenuProps()}>
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

PureSelectInput.defaultProps = defaultProps;

export default PureSelectInput;
