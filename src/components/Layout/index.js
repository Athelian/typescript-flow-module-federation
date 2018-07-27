// @flow
import * as React from 'react';

type Props = {
  children: React.Node,
  navBar?: React.Node,
};

export default class Layout extends React.PureComponent<Props> {
  static defaultProps = {
    navBar: null,
  };

  render() {
    const { navBar, children } = this.props;
    return (
      <div>
        {navBar}
        {children}
      </div>
    );
  }
}
