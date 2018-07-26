// @flow
import * as React from 'react';
import { HiddenStyle } from './style';

type Props = {
  children: React.Node,
};

type State = {
  shouldApplyAnimation: boolean,
};

export default class PreventInitialAnimation extends React.Component<Props, State> {
  static defaultProps: Props;

  state = {
    shouldApplyAnimation: false,
  };

  componentDidUpdate() {
    const { shouldApplyAnimation } = this.state;
    if (shouldApplyAnimation) return;
    setTimeout(() => this.setState({ shouldApplyAnimation: true }), 1);
  }

  render() {
    const { children } = this.props;
    const { shouldApplyAnimation } = this.state;
    return <div className={!shouldApplyAnimation && HiddenStyle}>{children}</div>;
  }
}
