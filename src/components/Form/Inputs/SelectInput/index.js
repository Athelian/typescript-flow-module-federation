// @flow
import * as React from 'react';
import Downshift from 'downshift';
import { isEquals } from 'utils/fp';
import { type SelectInputProps as Props, defaultSelectInputProps } from './type';

type State = {
  selectedItem: any,
};

class SelectInput extends React.Component<Props, State> {
  static defaultProps = defaultSelectInputProps;

  constructor(props: Props) {
    super(props);
    const { value, items, itemToValue } = props;
    const selectedItem = value
      ? (items || []).find(item => isEquals(itemToValue(item), value))
      : null;

    this.state = {
      selectedItem,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { value } = this.props;
    if (prevProps.value && !value) {
      this.handleChange(null);
    }
  }

  handleChange = (selectedItem: any) => {
    const { onChange } = this.props;
    this.setState({ selectedItem }, () => {
      if (onChange) onChange(selectedItem);
    });
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
    const { itemToString, itemToValue, renderSelect, renderOptions, items, name } = this.props;
    const { selectedItem } = this.state;

    return (
      <Downshift
        labelId={`${name}SelectInput`}
        onChange={this.handleChange}
        itemToString={itemToString}
        itemToValue={itemToValue}
      >
        {({
          getItemProps,
          isOpen,
          toggleMenu: toggle,
          highlightedIndex,
          clearSelection,
          getInputProps,
        }) => (
          <div>
            {renderSelect({
              onBlur: this.handleBlur,
              onFocus: this.handleFocus,
              isOpen,
              toggle,
              selectedItem,
              clearSelection,
              getInputProps,
              itemToString,
            })}
            {isOpen &&
              renderOptions({
                items,
                highlightedIndex,
                selectedItem,
                getItemProps,
                itemToString,
                itemToValue,
              })}
          </div>
        )}
      </Downshift>
    );
  }
}

export default SelectInput;
