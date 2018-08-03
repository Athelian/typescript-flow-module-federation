// @flow
import * as React from 'react';

type Props = {
  children: React.Node,
  isChildrenVisible?: boolean,
};

type State = {
  shouldApplyAnimation: boolean,
};

export default class PreventInitialAnimation extends React.Component<Props, State> {
  static defaultProps = {
    isChildrenVisible: false,
  };

  state = {
    shouldApplyAnimation: false,
  };

  componentDidUpdate() {
    const { shouldApplyAnimation } = this.state;
    const { isChildrenVisible } = this.props;
    if (shouldApplyAnimation || !isChildrenVisible) return;
    setTimeout(() => this.setState({ shouldApplyAnimation: true }), 1);
  }

  render() {
    const { children } = this.props;
    const { shouldApplyAnimation } = this.state;
    return <div>{shouldApplyAnimation && children}</div>;
  }
}
