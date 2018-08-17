// @flow
import * as React from 'react';
import Downshift from 'downshift';
import { ResetNativeStyle } from 'components/base/SelectInput/style';
import { isEquals } from 'utils/fp';
import DebounceInput from 'react-debounce-input';

type Props = {
  name: string,
  value: any,
  onChange?: any => void,
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

type State = {
  inputValue: string,
  selectedItem: any,
};

class SearchSelectInput extends React.Component<Props, State> {
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

  constructor(props: Props) {
    super(props);
    const { value, items, itemToValue } = props;
    const selectedItem = value
      ? (items || []).find(item => isEquals(itemToValue(item), value))
      : null;

    this.state = {
      inputValue: '',
      selectedItem,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { value } = this.props;
    if (prevProps.value && !value) {
      this.handleChange(null);
    }
  }

  handleChangeQuery = (e: any) => {
    const { onChange, onSearch } = this.props;
    const { value: query } = e.target;

    if (!query.trim()) {
      this.setState({ inputValue: query, selectedItem: null });
      if (onChange) onChange(null);
    } else {
      this.setState({ inputValue: query });
      if (onSearch) onSearch(query);
    }
  };

  handleBlur = () => {
    const { name, onBlur } = this.props;
    if (onBlur) onBlur(name, true);
  };

  handleChange = (selectedItem: any) => {
    const { onChange, itemToString } = this.props;
    this.setState({ selectedItem, inputValue: itemToString(selectedItem) });
    if (onChange) onChange(selectedItem);
  };

  render() {
    const {
      renderSelect,
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

    const { inputValue, selectedItem } = this.state;

    return (
      <Downshift onChange={this.handleChange} itemToString={itemToString} itemToValue={itemToValue}>
        {({
          getItemProps,
          isOpen,
          toggleMenu,
          highlightedIndex,
          clearSelection,
          getInputProps,
        }) => (
          <div className={ResetNativeStyle}>
            {renderSelect({
              input: (
                <DebounceInput
                  className={styles.input}
                  placeholder={placeholder}
                  disabled={disabled}
                  required={required}
                  readOnly={readOnly}
                  onClick={toggleMenu}
                  debounceTimeout={500}
                  spellCheck={false}
                  {...getInputProps({
                    value: inputValue,
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
