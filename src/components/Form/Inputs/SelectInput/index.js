// @flow
import * as React from 'react';
import Downshift from 'downshift';
import { Display } from 'components/Form';
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

  static getDerivedStateFromProps(props: Props, state: State) {
    const { value, items, itemToValue } = props;
    if (value !== state.selectedItem) {
      return {
        selectedItem: value ? (items || []).find(item => isEquals(itemToValue(item), value)) : null,
      };
    }
    return null;
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

  handleClear = (clearSelection: Function) => {
    clearSelection();
    this.handleChange(null);
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
      value,
      itemToString,
      itemToValue,
      renderSelect,
      renderOptions,
      items,
      name,
      readOnly,
      readOnlyWidth,
      readOnlyHeight,
      readOnlyAlign,
    } = this.props;
    const { selectedItem } = this.state;

    return readOnly ? (
      <Display style={{ textAlign: readOnlyAlign }} width={readOnlyWidth} height={readOnlyHeight}>
        {itemToString(value)}
      </Display>
    ) : (
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
              clearSelection: () => this.handleClear(clearSelection),
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
