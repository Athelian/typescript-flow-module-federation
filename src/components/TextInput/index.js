// @flow
import * as React from 'react';
import Label from 'components/Label';
import { InputStyle } from './style';

type Props = {
  title?: string | React.Node,
  name?: string,
  value?: ?string,
  disabled?: boolean,
  readOnly?: boolean,
  required?: boolean,
  info?: string | React.Node,
  error?: string | React.Node,
  warning?: string | React.Node,
  hideLabel?: boolean,
  onChange: Function,
  onBlur: Function,
};

const TextInput = (props: Props) => {
  const {
    name,
    value,
    title,
    required,
    disabled,
    readOnly,
    onChange,
    onBlur,
    error,
    info,
    warning,
    hideLabel,
    ...rest
  } = props;
  const inputProps = onChange ? { onChange, value: value || '' } : { defaultValue: value || '' };

  return (
    <Label
      title={title}
      required={required}
      error={error}
      info={info}
      warning={warning}
      hideLabel={hideLabel}
    >
      <input
        name={name || ''}
        className={InputStyle(!!error)}
        type="text"
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        onBlur={onBlur}
        {...inputProps}
        {...rest}
      />
    </Label>
  );
};

TextInput.defaultProps = {
  hideLabel: false,
  title: '',
  info: '',
  warning: '',
  error: '',
  name: '',
  value: '',
  disabled: false,
  readOnly: false,
  required: false,
};

export default TextInput;
