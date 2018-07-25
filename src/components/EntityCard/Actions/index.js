// @flow
import * as React from 'react';
import { WrapperStyle, FadeInStyle, FadeOutStyle, DefaultStyle } from './style';

type Action = {
  id: string,
  node: React.Node,
};

type Props = {
  actions: ?Array<Action>,
  visible: boolean,
  onClick: () => void,
};

type State = {
  shouldApplyAnimation: boolean,
};

class Actions extends React.Component<Props, State> {
  state = {
    shouldApplyAnimation: false,
  };

  componentDidUpdate() {
    const { shouldApplyAnimation } = this.state;
    if (!shouldApplyAnimation) {
      setTimeout(() => this.setState({ shouldApplyAnimation: true }), 1);
    }
  }

  animationStyle = (index: number) => {
    const { shouldApplyAnimation } = this.state;
    const { visible } = this.props;
    if (!shouldApplyAnimation) return DefaultStyle;
    return visible ? FadeInStyle(index) : FadeOutStyle(index);
  };

  render() {
    const { actions, onClick } = this.props;

    return (
      <div className={WrapperStyle} onClick={onClick} role="presentation">
        {actions &&
          actions.map((action, index) => (
            <div key={action.id} className={this.animationStyle(index)}>
              {action.node}
            </div>
          ))}
      </div>
    );
  }
}

export default Actions;
