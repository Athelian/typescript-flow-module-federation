// @flow
import * as React from 'react';
import Downshift from 'downshift';
import { isEquals } from 'utils/fp';
import { ResetNativeStyle } from './style';

type Props = {
  renderSelect: ({
    input: React.Node,
    isOpen: boolean,
    clearSelection: () => void,
    toggle: () => void,
    selectedItem: any,
  }) => React.Node,
  value: any,
  onChange?: any => void,
  items: Array<any>,
  itemToValue: any => any,
  itemToString: any => string,
  renderOption: ({ value: any, onHover: boolean, selected: boolean }) => React.Node,
  styles?: { input: any, options: any },
  disabled?: boolean,
  required?: boolean,
  placeholder?: string,
  defaultSelectedItem?: any,
};

type State = {
  selectedItem: any,
};

class SelectInput extends React.Component<Props, State> {
  static defaultProps = {
    onChange: () => {},
    disabled: false,
    required: false,
    placeholder: '',
    styles: { input: '', options: '' },
    defaultSelectedItem: null,
  };

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
    const {
      renderSelect,
      items,
      itemToValue,
      itemToString,
      renderOption,
      styles,
      defaultSelectedItem,
      disabled,
      required,
      placeholder,
    } = this.props;

    const { selectedItem } = this.state;

    return (
      <Downshift
        defaultSelectedItem={defaultSelectedItem}
        onChange={this.handleChange}
        itemToString={itemToString}
        itemToValue={itemToValue}
      >
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
                <input
                  className={styles && styles.input}
                  onClick={toggleMenu}
                  {...getInputProps({
                    value: placeholder,
                    spellCheck: false,
                    disabled,
                    required,
                    readOnly: true,
                  })}
                />
              ),
              isOpen,
              clearSelection,
              selectedItem,
              toggle: toggleMenu,
            })}
            {isOpen && (
              <ul className={styles && styles.options}>
                {items.map((item, index) => (
                  <li key={itemToValue(item)} {...getItemProps({ item })}>
                    {renderOption({
                      value: item,
                      onHover: highlightedIndex === index,
                      selected: itemToValue(selectedItem) === itemToValue(item),
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

export default SelectInput;
