// @flow
import React from 'react';
import { useIntl } from 'react-intl';
import DisplayWrapper from 'components/Sheet/CellRenderer/Cell/CellDisplay/Displays/DisplayWrapper';
import TextAreaInputDialog from './TextAreaInputDialog';
import { TextAreaInputButtonStyle, TextAreaPlaceholderStyle } from './style';

type Props = {
  value: string,
  focus: boolean,
  readonly: boolean,
  onChange: string => void,
  onFocus: () => void,
  onBlur: () => void,
};

const TextInput = ({ value, focus, onChange, onFocus, onBlur, readonly }: Props) => {
  const intl = useIntl();

  return (
    <>
      <button
        tabIndex="-1"
        onClick={() => {
          if (!readonly) {
            onFocus();
          }
        }}
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

      <TextAreaInputDialog value={value || ''} onChange={onChange} focus={focus} onBlur={onBlur} />
    </>
  );
};

export default TextInput;
