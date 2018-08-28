// @flow
import * as React from 'react';
import { css } from 'emotion';
import Downshift from 'downshift';
import {
  ResetNativeStyle,
  ResetOptionWrapperStyle,
  ResetOptionStyle,
} from 'components/Form/PureInputs/PureSelectInput/style';
import { isEquals } from 'utils/fp';
import DebounceInput from 'react-debounce-input';
import {
  type PureSearchSelectInputProps as Props,
  defaultPureSearchSelectInputProps,
} from './type';

type State = {
  inputValue: string,
  selectedItem: any,
};

class SearchSelectInput extends React.Component<Props, State> {
  static defaultProps = defaultPureSearchSelectInputProps;

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
      items,
      itemToValue,
      itemToString,
      renderSelect,
      renderOption,
      styles = { input: '', options: '' },
      align,
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
                  onClick={toggleMenu}
                  debounceTimeout={500}
                  spellCheck={false}
                  {...getInputProps({
                    value: inputValue,
                    onBlur: this.handleBlur,
                    onChange: this.handleChangeQuery,
                  })}
                  style={{ textAlign: align }}
                />
              ),
              isOpen,
              toggle: toggleMenu,
              selectedItem,
              clearSelection,
            })}
            {isOpen && (
              <ul
                className={css`
                  ${ResetOptionWrapperStyle} ${styles.options};
                `}
              >
                {items.map((item, index) => (
                  <li
                    className={ResetOptionStyle}
                    key={itemToValue(item)}
                    {...getItemProps({ item })}
                  >
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
