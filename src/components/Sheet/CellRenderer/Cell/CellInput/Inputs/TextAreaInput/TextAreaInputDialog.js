// @flow
import React from 'react';
import { useIntl } from 'react-intl';
import { SaveButton } from 'components/Buttons';
import { DialogStyle, ContentStyle, TextAreaStyle, FooterStyle } from './style';

type Props = {
  inputRef: Object,
  value: string,
  onSave: Function,
};

const TextAreaInputDialog = ({ inputRef, value, onSave }: Props) => {
  const [content, setContent] = React.useState(value || '');
  const intl = useIntl();

  return (
    <div className={DialogStyle}>
      <div className={ContentStyle}>
        <textarea
          ref={inputRef}
          className={TextAreaStyle}
          value={content}
          placeholder={intl.formatMessage({
            id: 'components.sheet.textarea.placeholder',
            defaultMessage: 'Please enter a value',
          })}
          spellCheck={false}
          onChange={e => setContent(e.target.value)}
          onKeyDown={e => e.stopPropagation()}
        />
      </div>
      <div className={FooterStyle}>
        <SaveButton
          onClick={() => {
            onSave(content);
          }}
        />
      </div>
    </div>
  );
};

export default TextAreaInputDialog;
