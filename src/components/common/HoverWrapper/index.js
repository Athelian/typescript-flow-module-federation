// @flow
import * as React from 'react';
import type { DefaultHTMLProps } from 'components/common/type.js.flow';

type Props = DefaultHTMLProps & {
  children: Function,
};

type State = {
  isHover: boolean,
};

export default class HoverWrapper extends React.PureComponent<Props, State> {
  state = {
    isHover: false,
  };

  onMouseEnter = () => {
    this.setState(() => ({ isHover: true }));
  };

  onMouseLeave = () => {
    this.setState(() => ({ isHover: false }));
  };

  render() {
    const { children, ...rest } = this.props;
    const { isHover } = this.state;
    return (
      <div {...rest} onMouseLeave={this.onMouseLeave} onMouseEnter={this.onMouseEnter}>
        {children(isHover)}
      </div>
    );
  }
}
