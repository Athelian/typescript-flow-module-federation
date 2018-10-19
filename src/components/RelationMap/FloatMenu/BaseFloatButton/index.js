// @flow
import * as React from 'react';
import { cx } from 'react-emotion';

import { ButtonStyle, ButtonContentWrapperStyle } from './style';
import FloatButtonIcon from './FloatButtonIcon';

type OptionalProps = {
  actions: Array<React.Node>,
  allowToggle: boolean,
  disabled: boolean,
  onClick: Function,
  wrapperClassName: string | Function,
};

type Props = OptionalProps & {
  icon: string,
  color: string,
  children: React.Node,
};

type State = {
  showLabel: boolean,
};

const defaultProps = {
  actions: [],
  allowToggle: true,
  disabled: false,
  onClick: () => {},
  wrapperClassName: '',
};

export default class BaseFloatButton extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  constructor(props: Props) {
    super(props);
    this.state = {
      showLabel: false,
    };

    this.icon = React.createRef();
  }

  toggleExpand = () => {
    const { showLabel } = this.state;

    this.setState({ showLabel: !showLabel });
  };

  doExpand = () => {
    this.setState({ showLabel: true });
  };

  doCollapse = () => {
    this.setState({ showLabel: false });
  };

  icon: { current: ?HTMLButtonElement };

  render() {
    const {
      icon,
      color,
      allowToggle,
      disabled,
      wrapperClassName,
      children,
      onClick,
      ...rest
    } = this.props;

    const { showLabel } = this.state;

    const style = ButtonStyle({ disabled, color });
    return (
      <div
        role="presentation"
        className={cx(style, wrapperClassName)}
        onMouseOver={() => {
          if (allowToggle) {
            this.doExpand();
          }
        }}
        onFocus={() => {
          if (allowToggle) {
            this.doExpand();
          }
        }}
        onMouseOut={() => {
          if (allowToggle) {
            this.doCollapse();
          }
        }}
        onBlur={() => {
          if (allowToggle) {
            this.doCollapse();
          }
        }}
        onClick={onClick}
        {...rest}
      >
        {icon &&
          icon.length && (
            <FloatButtonIcon
              ref={this.icon}
              icon={icon}
              color={color}
              disabled={disabled}
              onClick={this.toggleExpand}
            />
          )}

        <div className={ButtonContentWrapperStyle(showLabel)}>{children}</div>
      </div>
    );
  }
}
