// @flow
import * as React from 'react';
import { css } from 'emotion';
import Downshift from 'downshift';
import { isEquals } from 'utils/fp';
import { ResetNativeStyle, ResetOptionWrapperStyle, ResetOptionStyle } from './style';
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
    const {
      renderSelect,
      items,
      itemToValue,
      itemToString,
      renderOption,
      styles,
      placeholder,
      align,
    } = this.props;

    const { selectedItem } = this.state;

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
                <input
                  readOnly
                  spellCheck={false}
                  className={styles && styles.input}
                  onClick={toggleMenu}
                  {...getInputProps({
                    value: itemToString(selectedItem) || placeholder,
                  })}
                  style={{ textAlign: align }}
                />
              ),
              isOpen,
              clearSelection,
              selectedItem,
              toggle: toggleMenu,
            })}
            {isOpen && (
              <ul
                className={css`
                  ${ResetOptionWrapperStyle} ${styles && styles.options};
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
