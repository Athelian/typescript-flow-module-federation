// @flow
import * as React from 'react';
import Downshift from 'downshift';
import { isEquals } from 'utils/fp';
import { type PureSelectInputProps as Props, defaultPureSelectInputProps } from './type';

type State = {
  selectedItem: any,
};

class SelectInput extends React.Component<Props, State> {
  static defaultProps = defaultPureSelectInputProps;

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
    this.setState({ selectedItem });
    if (onChange) onChange(selectedItem);
  };

  render() {
    const { itemToString, itemToValue, renderSelect, renderOptions } = this.props;
    const { selectedItem } = this.state;

    return (
      <Downshift onChange={this.handleChange} itemToString={itemToString} itemToValue={itemToValue}>
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

export default SelectInput;
