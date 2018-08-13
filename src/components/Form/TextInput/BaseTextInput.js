// @flow
import * as React from 'react';
import HoverWrapper from 'components/common/HoverWrapper';
import Editable from 'components/common/Editable';
import { HoverStyle } from 'components/common/HoverWrapper/style';
import Label from 'components/Label';
import { ErrorTooltip, WarningTooltip, InfoTooltip } from 'components/Tooltips';
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
      label,
      value,
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
                <Label htmlFor={id}>
                  {infoMessage && <InfoTooltip info={infoMessage} />}
                  {label}
                  {required && ' * '}
                  <DebounceTextInput
                    {...rest}
                    id={id}
                    required={required}
                    readOnly={this.isReadOnly(isWrite, isEditable)}
                    value={
                      this.isReadOnly(isWrite, isEditable) ? formatter && formatter(value) : value
                    }
                    className={InputStyle(!!errorMessage)}
                    onKeyDown={evt => this.onKeyDown(evt, onToggleEditMode)}
                  />
                  {errorMessage && <ErrorTooltip error={errorMessage} />}
                  {warningMessage && <WarningTooltip warning={warningMessage} />}
                </Label>
              </div>
            )}
          </HoverWrapper>
        )}
      </Editable>
    );
  }
}
