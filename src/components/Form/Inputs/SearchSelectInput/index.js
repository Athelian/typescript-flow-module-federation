// @flow
import * as React from 'react';
import Downshift from 'downshift';
import { isEquals } from 'utils/fp';
import { type SearchSelectInputProps as Props, defaultSearchSelectInputProps } from './type';

type State = {
  selectedItem: ?Object,
};

class SearchSelectInput extends React.Component<Props, State> {
  static defaultProps = defaultSearchSelectInputProps;

  state = {
    selectedItem: null,
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const { inputValue, value, items, itemToValue } = props;
    const { selectedItem } = state;

    if (!selectedItem || (selectedItem && inputValue !== selectedItem.name)) {
      return {
        selectedItem: value ? (items || []).find(item => isEquals(itemToValue(item), value)) : null,
      };
    }
    return null;
  }

  handleChangeQuery = (e: any) => {
    const { onChange, onSearch } = this.props;
    const { value: query } = e.target;

    if (!query.trim()) {
      this.setState({ selectedItem: null }, () => {
        if (onChange) onChange(null);
      });
    } else if (onSearch) onSearch(query);
  };

  handleChange = (selectedItem: any) => {
    const { onChange } = this.props;
    this.setState({ selectedItem });
    if (onChange) onChange(selectedItem);
  };

  handleBlur = (evt: Object) => {
    const { onBlur } = this.props;
    if (onBlur) onBlur(evt);
  };

  handleFocus = (evt: Object) => {
    const { onFocus } = this.props;
    if (onFocus) onFocus(evt);
  };

  render() {
    const {
      name,
      itemToValue,
      inputValue,
      itemToString,
      renderSelect,
      renderOptions,
      afterClearSelection,
    } = this.props;

    const { selectedItem } = this.state;

    return (
      <Downshift
        initialInputValue={inputValue}
        initialSelectedItem={selectedItem}
        onChange={this.handleChange}
        itemToString={itemToString}
        itemToValue={itemToValue}
        labelId={`${name}SearchSelectInput`}
      >
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
              onBlur: this.handleBlur,
              onFocus: this.handleFocus,
              isOpen,
              toggle,
              selectedItem,
              clearSelection: () => clearSelection(afterClearSelection),
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
