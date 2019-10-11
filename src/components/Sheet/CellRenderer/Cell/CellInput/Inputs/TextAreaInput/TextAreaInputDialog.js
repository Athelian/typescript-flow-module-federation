// @flow
import React from 'react';
import { useIntl } from 'react-intl';

import { DialogStyle, ContentStyle, TextAreaStyle } from './style';

type Props = {
  inputRef: Object,
  value: string,
};

const TextAreaInputDialog = ({ inputRef, value }: Props) => {
  const [content, setContent] = React.useState(value || '');
  const intl = useIntl();
  const wrapperRef = React.useRef();
  React.useEffect(() => {
    const node = wrapperRef.current;
    const focus = () => inputRef.current.focus();
    if (node) {
      node.addEventListener('transitionend', focus);
    }

    return () => {
      if (node) {
        node.removeEventListener('transitionend', focus);
      }
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
    </div>
  );
};

export default TextAreaInputDialog;
