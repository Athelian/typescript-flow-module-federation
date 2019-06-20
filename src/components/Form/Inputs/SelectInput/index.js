// @flow
import * as React from 'react';
import Downshift from 'downshift';
import { Display } from 'components/Form';
import { isEquals } from 'utils/fp';
import { SelectInputRelativeStyle } from './style';
import { type SelectInputProps as Props, defaultSelectInputProps } from './type';

type State = {
  selectedItem: any,
};

class SelectInput extends React.Component<Props, State> {
  static defaultProps = defaultSelectInputProps;

  state = {
    selectedItem: null,
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const { value, items, itemToValue } = props;
    const { selectedItem } = state;

    if (itemToValue && !isEquals(itemToValue(selectedItem), value)) {
      return {
        selectedItem: value ? (items || []).find(item => isEquals(itemToValue(item), value)) : null,
      };
    }
    return { selectedItem };
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
    const {
      itemToString,
      itemToValue,
      renderSelect,
      renderOptions,
      items,
      name,
      afterClearSelection,
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
        labelId={`${name}SelectInput`}
        onChange={this.handleChange}
        itemToString={itemToString}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          toggleMenu: toggle,
          highlightedIndex,
          clearSelection,
        }) => (
          <div className={SelectInputRelativeStyle}>
            {renderSelect({
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

export default SelectInput;
