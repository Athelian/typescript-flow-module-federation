// @flow
import * as React from 'react';
import { isString } from 'lodash';
import Downshift from 'downshift';
import { Display } from 'components/Form';
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
      itemToString,
      itemToValue,
      inputValue,
      renderSelect,
      renderOptions,
      items,
      name,
      afterClearSelection,
      id,
      readOnly,
      readOnlyWidth,
      readOnlyHeight,
      align,
    } = this.props;
    const { selectedItem } = this.state;

    return readOnly ? (
      <Display align={align} width={readOnlyWidth} height={readOnlyHeight}>
        {itemToString(selectedItem)}
      </Display>
    ) : (
      <Downshift
        initialInputValue={isString(inputValue) ? inputValue : ''}
        initialSelectedItem={selectedItem}
        onChange={this.handleChange}
        itemToString={itemToString}
        labelId={`${name}SearchSelectInput`}
        id={id}
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
              itemToString,
              align,
            })}
            {isOpen &&
              renderOptions({
                items,
                highlightedIndex,
                selectedItem,
                getItemProps,
                itemToString,
                itemToValue,
                align,
              })}
          </div>
        )}
      </Downshift>
    );
  }
}

export default SearchSelectInput;
