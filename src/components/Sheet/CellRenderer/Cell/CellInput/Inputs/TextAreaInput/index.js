// @flow
import React from 'react';
import { useIntl } from 'react-intl';
import Dialog from 'components/Dialog';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  CellDisplayWrapperStyle,
  DisplayContentStyle,
} from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
import {
  TextAreaInputButtonStyle,
  TextAreaInputDialogWrapperStyle,
  TextAreaInputStyle,
  TextAreaPlaceholderStyle,
} from './style';

const TextAreaInput = ({
  value,
  focus,
  onChange,
  forceFocus,
  forceBlur,
  readonly,
}: InputProps<string>) => {
  const intl = useIntl();
  const [textValue, setTextValue] = React.useState(value);

  React.useEffect(() => setTextValue(value), [value]);

  const handleBlur = (e: SyntheticFocusEvent<HTMLElement>) => {
    if (focus) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div onBlur={handleBlur}>
      <button
        disabled={readonly}
        onClick={forceFocus}
        type="button"
        className={TextAreaInputButtonStyle}
      >
        <div className={CellDisplayWrapperStyle}>
          {value === null || value === undefined || value === '' ? (
            <span className={TextAreaPlaceholderStyle}>
              {intl.formatMessage({
                id: 'components.sheet.textarea.placeholder',
                defaultMessage: 'Please enter a value',
              })}
            </span>
          ) : (
            <span className={DisplayContentStyle}>{value}</span>
          )}
        </div>
      </button>

      <Dialog
        isOpen={focus}
        noRefocus
        onRequestClose={() => {
          onChange(textValue, true);
          forceBlur();
        }}
      >
        <div className={TextAreaInputDialogWrapperStyle}>
          <textarea
            data-focus-first
            className={TextAreaInputStyle}
            value={textValue}
            placeholder={intl.formatMessage({
              id: 'components.sheet.textarea.placeholder',
              defaultMessage: 'Please enter a value',
            })}
            spellCheck={false}
            onChange={event => setTextValue(event.target.value)}
            onKeyDown={event => {
              if (event.key !== 'Escape') {
                event.stopPropagation();
              }
              if (event.key === 'Tab') {
                event.preventDefault();
              }
            }}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default TextAreaInput;
