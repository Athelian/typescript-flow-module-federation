import * as React from 'react';
// @flow
import Raven from 'raven-js';
import { isDevEnvironment } from 'utils/env';
import InternalError from 'components/InternalError';
import SideBar from 'modules/sidebar';

type Props = {
  children: React.Node,
  navBar?: React.Node,
};

type State = {
  hasError: boolean,
};

export default class Layout extends React.PureComponent<Props, State> {
  static defaultProps = {
    navBar: '',
  };

  state: State = { hasError: false };

  onReportError = () => {
    if (Raven.lastEventId() && !isDevEnvironment) {
      Raven.showReportDialog();
    }
  };

  componentDidCatch(error: Object, info: Object) {
    this.setState({ hasError: true });
    if (!isDevEnvironment) {
      Raven.captureException(error, { info });
    }
  }

  render() {
    const { children, navBar } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return <InternalError onReportError={this.onReportError} />;
    }

    return (
      <div>
        <SideBar />
        <div>
          {navBar}
          {children}
        </div>
      </div>
    );
  }
}
