// @flow
import React from 'react';
import { useIntl } from 'react-intl';
import { TextAreaInputDialogWrapperStyle, TextAreaInputStyle } from './style';

type Props = {
  inputRef: Object,
  value: string,
};

const TextAreaInputDialog = ({ inputRef, value }: Props) => {
  const [content, setContent] = React.useState(value || '');
  const intl = useIntl();

  return (
    <div className={TextAreaInputDialogWrapperStyle}>
      <textarea
        ref={inputRef}
        className={TextAreaInputStyle}
        value={content}
        placeholder={intl.formatMessage({
          id: 'components.sheet.textarea.placeholder',
          defaultMessage: 'Please enter a value',
        })}
        spellCheck={false}
        onChange={e => setContent(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Tab') {
            e.preventDefault();
          }
          e.stopPropagation();
        }}
      />
    </div>
  );
};

export default TextAreaInputDialog;
