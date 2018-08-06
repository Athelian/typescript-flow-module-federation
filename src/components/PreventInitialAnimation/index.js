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

  componentDidMount() {
    this.isMount = true;
  }

  componentDidUpdate() {
    const { shouldApplyAnimation } = this.state;
    const { isChildrenVisible } = this.props;
    if (shouldApplyAnimation || !isChildrenVisible) return;
    setTimeout(() => this.isMount && this.setState({ shouldApplyAnimation: true }), 1);
  }

  componentWillUnmount() {
    this.isMount = false;
  }

  isMount: boolean;

  render() {
    const { children } = this.props;
    const { shouldApplyAnimation } = this.state;
    return <div>{shouldApplyAnimation && children}</div>;
  }
}
