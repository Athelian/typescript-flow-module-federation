// @flow
import * as React from 'react';
import emitter from 'utils/emitter';

type Props = {
  children: React.Node,
};
class Emitter extends React.Component<Props> {
  componentDidMount() {
    emitter.addListener('FORCE_RENDER', () => {
      console.log('XXXXXXXXXXXX');
      this.forceUpdate();
    });
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

export default Emitter;
