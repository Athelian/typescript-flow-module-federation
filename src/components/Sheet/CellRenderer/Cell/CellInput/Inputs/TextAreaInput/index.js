// @flow
import React from 'react';
import { useIntl } from 'react-intl';
import InputWrapper from '../InputWrapper';
import TextAreaInputDialog from './TextAreaInputDialog';

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
      <InputWrapper focus={focus}>
        {({ ref }) => (
          <input
            ref={ref}
            readOnly
            spellCheck={false}
            value={value || ''}
            onClick={() => {
              if (!readonly) {
                onFocus();
              }
            }}
            placeholder={intl.formatMessage({
              id: 'components.sheet.textarea.placeholder',
              defaultMessage: 'Please enter a value',
            })}
          />
        )}
      </InputWrapper>

      <TextAreaInputDialog value={value || ''} onChange={onChange} focus={focus} onBlur={onBlur} />
    </>
  );
};

export default TextInput;
