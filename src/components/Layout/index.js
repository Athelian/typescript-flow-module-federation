// @flow
import * as React from 'react';
import Raven from 'raven-js';
import { isDevEnvironment } from 'utils/env';
import InternalError from 'components/InternalError';
import { DesktopWrapperStyle } from 'styles/main';
import { WrapperStyle, ContentWrapperStyle } from './style';

type Props = {
  children: React.Node,
  isSideBarExpanded: boolean,
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
    const { children, navBar, isSideBarExpanded } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return <InternalError onReportError={this.onReportError} />;
    }

    return (
      <div className={DesktopWrapperStyle(isSideBarExpanded)}>
        <div className={WrapperStyle}>
          {navBar}
          <div className={ContentWrapperStyle}>{children}</div>
        </div>
      </div>
    );
  }
}
