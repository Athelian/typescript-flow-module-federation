// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { MessageInputWrapper, InputStyle, SendButtonStyle } from './style';

type Props = {
  name: string,
  value: ?string,
  onChange: Function,
  onBlur?: Function,
  onSubmit: Function,
};

class MessageInput extends React.Component<Props> {
  componentDidMount() {
    if (this.messageRef) {
      this.messageRef.style.height = 'auto';
      this.messageRef.style.height = `${this.messageRef.scrollHeight}px`;
    }
  }

  setMessageRef = (node: ?HTMLTextAreaElement) => {
    this.messageRef = node;
  };

  inputBehavior = (event: Object) => {
    const { onSubmit } = this.props;
    if (event.which === 13 && !event.shiftKey) {
      event.preventDefault();
      onSubmit(event);
    }
  };

  expandInput = (event: Object) => {
    const { onChange } = this.props;
    if (this.messageRef) {
      this.messageRef.style.height = 'auto';
      this.messageRef.style.height = `${this.messageRef.scrollHeight}px`;
    }
    onChange(event);
  };

  messageRef: ?HTMLTextAreaElement;

  render() {
    const { name, value, onBlur, onSubmit } = this.props;

    return (
      <div className={MessageInputWrapper}>
        <textarea
          ref={this.setMessageRef}
          name={name || ''}
          value={value || ''}
          onKeyPress={this.inputBehavior}
          onChange={this.expandInput}
          onBlur={onBlur}
          rows={1}
          className={InputStyle}
        />
        <button type="button" onClick={onSubmit} className={SendButtonStyle(!!value)}>
          <Icon icon="PAPER_PLANE" />
        </button>
      </div>
    );
  }
}

export default MessageInput;
