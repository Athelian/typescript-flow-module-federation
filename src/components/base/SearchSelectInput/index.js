// @flow
import * as React from 'react';
import Downshift from 'downshift';
import Icon from 'components/Icon';
import { ResetNativeStyle } from 'components/base/SelectInput/style';
import { ArrowDownStyle } from 'components/Form/SelectInput/style';

type Props = {
  name: string,
  value: any,
  onChange?: (name: string, value: any) => void,
  items: Array<any>,
  itemToValue: any => any,
  itemToString: any => string,
  renderSelect: (?React.Node) => React.Node,
  renderOption: ({ value: any, onHover: boolean, selected: boolean }) => React.Node,
  wrapperStyle: { select: any, options: any },
  disabled?: boolean,
  required?: boolean,
  readOnly?: boolean,
  placeholder?: string,
  onSearch?: Function,
  onBlur?: Function,
};

class SelectInput extends React.Component<Props> {
  static defaultProps = {
    onChange: () => {},
    disabled: false,
    required: false,
    readOnly: false,
    clearable: false,
    placeholder: '',
    onSearch: () => {},
    onBlur: () => {},
  };

  handleChangeQuery = (e: any) => {
    const { onSearch } = this.props;
    const { value: query } = e.target;

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    this.timeout = setTimeout(() => {
      if (onSearch) onSearch(query);
    }, 500);
  };

  handleBlur = () => {
    const { name, onBlur } = this.props;
    if (onBlur) {
      onBlur(name, true);
    }
  };

  timeout: ?TimeoutID;

  render() {
    const {
      renderSelect,
      onChange,
      items,
      itemToValue,
      itemToString,
      renderOption,
      wrapperStyle = { select: '', options: '' },
      disabled,
      required,
      readOnly,
      placeholder,
    } = this.props;

    return (
      <Downshift onChange={onChange} itemToString={itemToString} itemToValue={itemToValue}>
        {({
          getItemProps,
          isOpen,
          toggleMenu,
          selectedItem,
          highlightedIndex,
          clearSelection,
          getInputProps,
        }) => (
          <div className={ResetNativeStyle}>
            <div className={wrapperStyle.select}>
              {renderSelect(
                <React.Fragment>
                  <div onClick={toggleMenu} role="presentation">
                    <input
                      type="text"
                      {...getInputProps({
                        placeholder,
                        spellCheck: false,
                        disabled,
                        required,
                        readOnly,
                        onBlur: this.handleBlur,
                        onChange: this.handleChangeQuery,
                      })}
                    />
                  </div>
                  {selectedItem &&
                    !required && (
                      <button type="button" onClick={clearSelection}>
                        <Icon icon="CLEAR" />
                      </button>
                    )}
                  <button type="button" onClick={toggleMenu} className={ArrowDownStyle(isOpen)}>
                    <Icon icon="CHEVRON_DOWN" />
                  </button>
                </React.Fragment>
              )}
            </div>
            {isOpen && (
              <ul className={wrapperStyle.options}>
                {items.map((item, index) => (
                  <li key={item.value} {...getItemProps({ item })}>
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

export default SelectInput;
