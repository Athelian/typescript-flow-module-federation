// @flow
import * as React from 'react';
import Downshift from 'downshift';
import { isEquals } from 'utils/fp';
import { type SearchSelectInputProps as Props, defaultSearchSelectInputProps } from './type';

type State = {
  inputValue: string,
  selectedItem: any,
};

class SearchSelectInput extends React.Component<Props, State> {
  static defaultProps = defaultSearchSelectInputProps;

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

  handleChange = (selectedItem: any) => {
    const { onChange, itemToString } = this.props;
    this.setState({ selectedItem, inputValue: itemToString(selectedItem) });
    if (onChange) onChange(selectedItem);
  };

  render() {
    const { itemToValue, itemToString, renderSelect, renderOptions } = this.props;

    const { inputValue, selectedItem } = this.state;

    return (
      <Downshift onChange={this.handleChange} itemToString={itemToString} itemToValue={itemToValue}>
        {({
          getInputProps,
          getItemProps,
          isOpen,
          toggleMenu: toggle,
          highlightedIndex,
          clearSelection,
        }) => (
          <div>
            {renderSelect({
              value: inputValue,
              handleQueryChange: this.handleChangeQuery,
              isOpen,
              toggle,
              selectedItem,
              clearSelection,
              getInputProps,
            })}
            {isOpen &&
              renderOptions({
                highlightedIndex,
                selectedItem,
                getItemProps,
              })}
          </div>
        )}
      </Downshift>
    );
  }
}

export default SearchSelectInput;
