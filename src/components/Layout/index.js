import * as React from 'react';
// @flow
import Raven from 'raven-js';
import { isDevEnvironment } from 'utils/env';
import InternalError from 'components/InternalError';
import Authorized from 'components/Authorized';

type Props = {
  children: React.Node,
};

type State = {
  hasError: boolean,
};

export default class Layout extends React.PureComponent<Props, State> {
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
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return <InternalError onReportError={this.onReportError} />;
    }

    return <Authorized>{children}</Authorized>;
  }
}
