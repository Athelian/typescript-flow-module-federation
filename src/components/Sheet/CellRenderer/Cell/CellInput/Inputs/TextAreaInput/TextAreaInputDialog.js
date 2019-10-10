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
  const wrapperRef = React.useRef();
  React.useEffect(() => {
    const node = wrapperRef.current;
    const focus = () => inputRef.current.focus();
    node.addEventListener('transitionend', focus);

    return () => {
      node.removeEventListener('transitionend', focus);
    };
  });

  return (
    <div ref={wrapperRef} className={DialogStyle}>
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
