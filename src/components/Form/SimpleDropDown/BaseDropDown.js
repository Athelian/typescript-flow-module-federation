// @flow
import * as React from 'react';
import HoverWrapper from 'components/common/HoverWrapper';
import Editable from 'components/common/Editable';
import Label from 'components/Label';
import { ErrorTooltip, WarningTooltip, InfoTooltip } from 'components/Tooltips';
import { TAB_KEY } from 'constants/keyCode';
import { HoverStyle } from 'components/common/HoverWrapper/style';
import type { SimpleDropDownProps } from './type.js.flow';
import { BaseWrapperStyle, WrapperStyle, SimpleDropDownStyle } from './style';

const ALLOW_KEY_CODES = [TAB_KEY];

export default class SimpleDropDown extends React.PureComponent<SimpleDropDownProps> {
  selectRef: { current: null | HTMLSelectElement } = React.createRef();

  static defaultProps = {
    isRead: false,
    isWrite: false,
    errorMessage: '',
    label: '',
    placeholder: '...',
    onChange: () => {},
  };

  onKeyDown = (evt: KeyboardEvent, onToggleEditMode: Function) => {
    const { keyCode } = evt;
    if (ALLOW_KEY_CODES.includes(keyCode)) {
      switch (keyCode) {
        case TAB_KEY:
          onToggleEditMode(false);

          break;
        default:
          break;
      }
    }
  };

  handleChange = (evt: Event) => {
    const { onChange, multiple } = this.props;
    if (!(evt.target instanceof HTMLSelectElement)) {
      return;
    }
    if (onChange) {
      if (multiple) {
        const { selectedOptions } = evt.target;
        const { map } = Array.prototype;
        onChange(map.call(selectedOptions, item => item.value));
      } else {
        const { value } = evt.target;
        onChange(value);
      }
    }
  };

  isReadOnly = (isWrite?: boolean, isEditable: boolean) => !isWrite || !isEditable;

  render() {
    const {
      isRead,
      isWrite,
      editable,
      errorMessage,
      infoMessage,
      warningMessage,
      id,
      required,
      name,
      label,
      placeholder,
      value,
      options,
      ...rest
    } = this.props;
    if (!isRead) return null;
    return (
      <Editable editable={!!editable}>
        {(isEditable, onToggleEditMode) => (
          <HoverWrapper>
            {isHover => (
              <div className={HoverStyle(isHover && isWrite)}>
                <div className={BaseWrapperStyle}>
                  <Label htmlFor={id}>
                    {infoMessage && <InfoTooltip info={infoMessage} />}
                    {label}
                    {required && ' * '}
                    <div className={WrapperStyle}>
                      {
                        <select
                          required={required}
                          name={name}
                          ref={this.selectRef}
                          disabled={!isWrite}
                          readOnly={this.isReadOnly(isWrite, isEditable)}
                          onKeyDown={evt => this.onKeyDown(evt, onToggleEditMode)}
                          onChange={this.handleChange}
                          value={value}
                          className={SimpleDropDownStyle(!!errorMessage)}
                          {...rest}
                        >
                          <option hidden key={placeholder}>
                            {placeholder}
                          </option>
                          {options.map(item => (
                            <option value={item.value} key={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      }
                    </div>
                  </Label>
                  {errorMessage && <ErrorTooltip error={errorMessage} />}
                  {warningMessage && <WarningTooltip warning={warningMessage} />}
                </div>
              </div>
            )}
          </HoverWrapper>
        )}
      </Editable>
    );
  }
}
