// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { MessageInputWrapper, InputStyle, SendButtonStyle } from './style';

type Props = {
  name: string,
  value: ?string,
  disabled?: boolean,
  readOnly?: boolean,
  onChange: Function,
  onBlur: Function,
  onSubmit: Function,
  hideBorder?: boolean,
};

class MessageInput extends React.Component<Props> {
  static defaultProps = {
    hideBorder: false,
    disabled: false,
    readOnly: false,
  };

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
    const { name, value, disabled, readOnly, onBlur, onSubmit, hideBorder } = this.props;

    return (
      <div className={MessageInputWrapper}>
        <textarea
          ref={this.setMessageRef}
          name={name || ''}
          value={value || ''}
          onKeyPress={this.inputBehavior}
          onChange={this.expandInput}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          rows={1}
          tabIndex={readOnly ? -1 : 0}
          className={InputStyle(!!hideBorder)}
        />
        <button type="button" onClick={onSubmit} className={SendButtonStyle(!!value)}>
          <Icon icon="PAPER_PLANE" />
        </button>
      </div>
    );
  }
}

export default MessageInput;
