// @flow
import React from 'react';
import { useIntl } from 'react-intl';
import DisplayWrapper from 'components/Sheet/CellRenderer/Cell/CellDisplay/Displays/DisplayWrapper';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import Dialog from 'components/Dialog';
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
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [textValue, setTextValue] = React.useState(value);

  React.useEffect(() => setTextValue(value), [value]);
  React.useEffect(() => {
    if (!focus) {
      return () => {};
    }
    const handler = setTimeout(() => inputRef.current && inputRef.current.select(), 200);
    return () => clearTimeout(handler);
  }, [focus]);

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
        {value === null || value === undefined || value === '' ? (
          <span className={TextAreaPlaceholderStyle}>
            {intl.formatMessage({
              id: 'components.sheet.textarea.placeholder',
              defaultMessage: 'Please enter a value',
            })}
          </span>
        ) : (
          <DisplayWrapper>
            <span>{value}</span>
          </DisplayWrapper>
        )}
      </button>

      <Dialog
        isOpen={focus}
        onRequestClose={() => {
          onChange(textValue, true);
          forceBlur();
        }}
      >
        <div className={TextAreaInputDialogWrapperStyle}>
          <textarea
            ref={inputRef}
            className={TextAreaInputStyle}
            value={textValue}
            placeholder={intl.formatMessage({
              id: 'components.sheet.textarea.placeholder',
              defaultMessage: 'Please enter a value',
            })}
            spellCheck={false}
            onChange={event => setTextValue(event.target.value)}
            onKeyDown={event => {
              switch (event.key) {
                case 'Tab':
                  event.preventDefault();
                  event.stopPropagation();
                  break;
                case 'Enter':
                  event.stopPropagation();
                  break;
                default:
                  break;
              }
            }}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default TextAreaInput;
