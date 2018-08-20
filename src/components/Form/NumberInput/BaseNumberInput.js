// @flow
import * as React from 'react';
import HoverWrapper from 'components/common/HoverWrapper';
import Editable from 'components/common/Editable';
import Label from 'components/Label';
import { inRange } from 'utils/fp';
import {
  TAB_KEY,
  UP_KEY,
  LEFT_KEY,
  DOWN_KEY,
  RIGHT_KEY,
  ENTER_KEY,
  BACKSPACE_KEY,
} from 'constants/keyCode';
import { HoverStyle } from 'components/common/HoverWrapper/style';
import type { NumberInputProps as Props } from './type.js.flow';
import { NumberInputStyle } from './style';
import { getInputSelection, setInputSelection } from './helpers';

const NUMBERS_AND_CONTROL_KEY_CODES = [
  ...inRange(48, 58),
  ...inRange(37, 41),
  TAB_KEY,
  ENTER_KEY,
  LEFT_KEY,
  RIGHT_KEY,
  BACKSPACE_KEY,
];

export default class BaseNumberInput extends React.PureComponent<Props> {
  inputRef: { current: null | HTMLInputElement } = React.createRef();

  static defaultProps = {
    isRead: false,
    isWrite: false,
    errorMessage: '',
    label: '',
    onChange: () => {},
    onBlur: () => {},
    formatter: (value: number | string) => value,
  };

  onKeyDown = (evt: KeyboardEvent, onToggleEditMode: Function) => {
    const { keyCode, key, code } = evt;
    if (NUMBERS_AND_CONTROL_KEY_CODES.includes(keyCode)) {
      switch (keyCode) {
        case TAB_KEY:
          onToggleEditMode(false);
          if (this.inputRef.current) {
            this.handleChange(Number(this.inputRef.current.value));
          }

          break;
        case UP_KEY:
          if (this.inputRef.current) {
            this.handleChange(Number(this.inputRef.current.value) + 1);
          }

          break;
        case DOWN_KEY:
          if (this.inputRef.current) {
            this.handleChange(Number(this.inputRef.current.value) - 1);
          }

          break;
        case BACKSPACE_KEY:
          if (this.inputRef.current) {
            const currentValue = String(this.inputRef.current.value);
            const { start, end } = getInputSelection(this.inputRef.current);
            let newValue;
            if (start === end) {
              newValue = `${currentValue.substr(0, start - 1)}${currentValue.substr(end)}`;
            } else {
              newValue = `${currentValue.substr(0, start)}${currentValue.substr(end)}`;
            }
            this.handleChange(newValue);
            setTimeout(() => {
              if (this.inputRef.current && this.inputRef.current.value === newValue) {
                setInputSelection(this.inputRef.current, start - 1, start - 1);
              }
            }, 0);
          }

          break;
        default:
          if (!code && !Number.isNaN(parseInt(key, 10))) {
            const { start, end } = getInputSelection(this.inputRef.current);
            if (this.inputRef.current) {
              const currentValue = String(this.inputRef.current.value);
              if (end === currentValue.length) {
                if (start) {
                  this.handleChange(`${currentValue}${key}`);
                } else {
                  this.handleChange(key);
                }
              } else {
                const newValue = `${currentValue.substr(0, start)}${key}${currentValue.substr(
                  end
                )}`;
                this.handleChange(newValue);
                setTimeout(() => {
                  if (this.inputRef.current && this.inputRef.current.value === newValue) {
                    setInputSelection(this.inputRef.current, start + 1, start + 1);
                  }
                }, 0);
              }
            }
            break;
          }
      }
    }
  };

  isReadOnly = (isWrite?: boolean, isEditable: boolean) => !isWrite || !isEditable;

  handleBlur = () => {
    const { onBlur } = this.props;
    if (onBlur) onBlur();
  };

  handleChange = (value: number | string) => {
    const { onChange } = this.props;
    if (onChange) onChange(value);
  };

  render() {
    const {
      isRead,
      isWrite,
      editable,
      errorMessage,
      infoMessage,
      warningMessage,
      id,
      label,
      required,
      value,
      width,
      align = 'left',
      formatter,
      ...rest
    } = this.props;
    if (!isRead) return null;
    return (
      <Editable editable={!!editable}>
        {(isEditable, onToggleEditMode) => (
          <HoverWrapper>
            {isHover => (
              <div className={HoverStyle(isHover && isWrite)}>
                <Label htmlFor={id} title={label} {...rest}>
                  <input
                    id={id}
                    required={required}
                    ref={this.inputRef}
                    onKeyDown={evt => this.onKeyDown(evt, onToggleEditMode)}
                    readOnly={this.isReadOnly(isWrite, isEditable)}
                    value={
                      this.isReadOnly(isWrite, isEditable) ? formatter && formatter(value) : value
                    }
                    className={NumberInputStyle(!!errorMessage, width, align)}
                    onBlur={this.handleBlur}
                    {...rest}
                  />
                </Label>
              </div>
            )}
          </HoverWrapper>
        )}
      </Editable>
    );
  }
}
