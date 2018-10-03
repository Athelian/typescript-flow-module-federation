// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { TextAreaInput, DefaultStyle } from 'components/Form';
import { MessageInputWrapper, SendButtonStyle } from './style';

type Props = {
  name: string,
  value: ?string,
  onChange: Function,
  onBlur?: Function,
  onSubmit: Function,
};

type State = {
  isFocused: boolean,
};

class MessageInput extends React.Component<Props, State> {
  state = {
    isFocused: false,
  };

  toggleFocus = (value: boolean) => {
    this.setState({ isFocused: value });
  };

  inputBehavior = (event: Object) => {
    const { onSubmit } = this.props;
    if (event.which === 13 && !event.shiftKey) {
      event.preventDefault();
      onSubmit(event);
    }
  };

  handleFocus = () => {
    this.setState({ isFocused: true });
  };

  handleBlur = () => {
    const { onBlur } = this.props;

    this.setState({ isFocused: false });
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const { name, value, onChange, onSubmit } = this.props;
    const { isFocused } = this.state;

    return (
      <div className={MessageInputWrapper}>
        {/* <textarea
          ref={this.setMessageRef}
          name={name}
          value={value}
          onKeyPress={this.inputBehavior}
          onChange={this.expandInput}
          onBlur={onBlur}
          rows={1}
          className={InputStyle}
        /> */}
        <DefaultStyle type="textarea" height="90px" isFocused={isFocused} forceHoverStyle>
          <TextAreaInput
            name={name}
            value={value}
            onKeyPress={this.inputBehavior}
            onChange={onChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            align="left"
          />
        </DefaultStyle>
        <button type="button" onClick={onSubmit} className={SendButtonStyle(!!value)}>
          <Icon icon="PAPER_PLANE" />
        </button>
      </div>
    );
  }
}

export default MessageInput;
