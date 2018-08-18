// @flow
import * as React from 'react';
import Editable from 'components/common/Editable';
import Label from 'components/Label';
import { TAB_KEY } from 'constants/keyCode';
import { TextInput as DebounceTextInput } from 'components/base';
import type { TextInputProps as Props } from './type.js.flow';
import { InputStyle } from './style';

const ALLOW_KEY_CODES = [TAB_KEY];

export default class BaseTextInput extends React.PureComponent<Props> {
  static defaultProps = {
    formatter: (value: number | string) => value,
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

  handleChange = (e: any) => {
    const { value } = e.target;
    const { name, onChange } = this.props;
    if (onChange) onChange(name, value);
  };

  isReadOnly = (isWrite?: boolean, isEditable: boolean) => !isWrite || !isEditable;

  render() {
    const {
      isRead,
      isWrite,
      editable,
      errorMessage,
      id,
      value,
      hasHoverStyle,
      formatter,
      width,
      align = 'right',
      ...rest
    } = this.props;
    if (!isRead) return null;
    return (
      <Editable editable={!!editable}>
        {(isEditable, onToggleEditMode) => (
          <Label htmlFor={id} {...rest}>
            <DebounceTextInput
              {...rest}
              onChange={this.handleChange}
              id={id}
              readOnly={this.isReadOnly(isWrite, isEditable)}
              value={this.isReadOnly(isWrite, isEditable) ? formatter && formatter(value) : value}
              className={InputStyle(!!errorMessage, !!hasHoverStyle && !value, width, align)}
              onKeyDown={evt => this.onKeyDown(evt, onToggleEditMode)}
            />
          </Label>
        )}
      </Editable>
    );
  }
}
