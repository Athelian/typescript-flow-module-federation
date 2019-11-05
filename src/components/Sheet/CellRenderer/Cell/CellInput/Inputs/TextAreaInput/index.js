// @flow
import React from 'react';
import { useIntl } from 'react-intl';
import DisplayWrapper from 'components/Sheet/CellRenderer/Cell/CellDisplay/Displays/DisplayWrapper';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import TextAreaInputDialog from './TextAreaInputDialog';
import { TextAreaInputButtonStyle, TextAreaPlaceholderStyle } from './style';

const TextAreaInput = ({
  value,
  focus,
  onChange,
  forceFocus,
  forceBlur,
  readonly,
}: InputProps<string>) => {
  const intl = useIntl();
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

      <TextAreaInputDialog
        value={value || ''}
        onChange={onChange}
        focus={focus}
        onBlur={forceBlur}
      />
    </div>
  );
};

export default TextAreaInput;
