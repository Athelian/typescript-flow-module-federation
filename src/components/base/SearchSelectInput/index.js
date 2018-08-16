// @flow
import * as React from 'react';
import Downshift from 'downshift';
import { ResetNativeStyle } from 'components/base/SelectInput/style';

type Props = {
  name: string,
  onChange?: (name: string, value: any) => void,
  onSearch?: string => void,
  items: Array<any>,
  itemToValue: any => any,
  itemToString: any => string,
  renderSelect: ({
    input: React.Node,
    isOpen: boolean,
    clearSelection: () => void,
    toggle: () => void,
    selectedItem: any,
  }) => React.Node,
  renderOption: ({ value: any, onHover: boolean, selected: boolean }) => React.Node,
  styles: { input: any, options: any },
  disabled?: boolean,
  required?: boolean,
  readOnly?: boolean,
  placeholder?: string,
  onSearch?: Function,
  onBlur?: Function,
};

class SearchSelectInput extends React.Component<Props> {
  static defaultProps = {
    onChange: () => {},
    disabled: false,
    required: false,
    readOnly: false,
    clearable: false,
    placeholder: '',
    onSearch: () => {},
    onBlur: () => {},
  };

  handleChangeQuery = (e: any) => {
    const { onSearch } = this.props;
    const { value: query } = e.target;

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    this.timeout = setTimeout(() => {
      if (onSearch) onSearch(query);
    }, 500);
  };

  handleBlur = () => {
    const { name, onBlur } = this.props;
    if (onBlur) {
      onBlur(name, true);
    }
  };

  timeout: ?TimeoutID;

  render() {
    const {
      renderSelect,
      onChange,
      onSearch,
      items,
      itemToValue,
      itemToString,
      renderOption,
      styles = { input: '', options: '' },
      disabled,
      required,
      readOnly,
      placeholder,
    } = this.props;

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
                <input
                  className={styles.input}
                  onClick={toggleMenu}
                  onChange={onSearch}
                  type="text"
                  {...getInputProps({
                    placeholder,
                    spellCheck: false,
                    disabled,
                    required,
                    readOnly,
                    onBlur: this.handleBlur,
                    onChange: this.handleChangeQuery,
                  })}
                />
              ),
              isOpen,
              toggle: toggleMenu,
              selectedItem,
              clearSelection,
            })}
            {isOpen && (
              <ul className={styles.options}>
                {items.map((item, index) => (
                  <li key={itemToValue(item)} {...getItemProps({ item })}>
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
}

export default SearchSelectInput;
