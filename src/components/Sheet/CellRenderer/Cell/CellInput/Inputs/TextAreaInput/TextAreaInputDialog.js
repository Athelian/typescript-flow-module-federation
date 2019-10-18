// @flow
import React, { useRef, useEffect } from 'react';
import { useIntl } from 'react-intl';
import usePrevious from 'hooks/usePrevious';
import Dialog from 'components/Dialog';
import { TextAreaInputDialogWrapperStyle, TextAreaInputStyle } from './style';

type Props = {
  value: string,
  onChange: string => void,
  focus: boolean,
  onBlur: () => void,
};

const TextAreaInputDialog = ({ value, onChange, focus, onBlur }: Props) => {
  const intl = useIntl();
  const inputRef = useRef(null);
  const prevFocus = usePrevious(focus);

  useEffect(() => {
    if (!prevFocus && focus) {
      setTimeout(() => {
        if (inputRef && inputRef.current) {
          inputRef.current.select();
        }
      }, 200);
    }
  }, [focus, prevFocus]);

  return (
    <Dialog
      isOpen={focus}
      onRequestClose={() => {
        onBlur();
      }}
    >
      <div className={TextAreaInputDialogWrapperStyle}>
        <textarea
          ref={inputRef}
          className={TextAreaInputStyle}
          value={value}
          placeholder={intl.formatMessage({
            id: 'components.sheet.textarea.placeholder',
            defaultMessage: 'Please enter a value',
          })}
          spellCheck={false}
          onChange={event => onChange(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Tab') {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
        />
      </div>
    </Dialog>
  );
};

export default TextAreaInputDialog;
