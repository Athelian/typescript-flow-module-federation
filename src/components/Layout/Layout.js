// @flow
import * as React from 'react';
import * as Sentry from '@sentry/browser';
import { isDevEnvironment } from 'utils/env';
import InternalError from 'components/InternalError';
import UserNavbar from 'modules/userNavbar';
import { DesktopWrapperStyle } from 'styles/main';
import { LayoutWrapperStyle, NavBarWrapperStyle, NavBarStyle } from './style';

type Props = {
  isSideBarExpanded?: boolean,
  children: React.Node,
};

type State = {
  hasError: boolean,
};

export default class Layout extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Object) {
    if (!isDevEnvironment) {
      Sentry.captureException(error);
    }
    return { hasError: true };
  }

  componentDidCatch(error: Object) {
    this.setState({ hasError: true });
    if (!isDevEnvironment) {
      Sentry.captureException(error);
    }
  }

  onReportError = () => {
    if (Sentry.lastEventId() && !isDevEnvironment) {
      Sentry.showReportDialog();
    }
  };

  render() {
    const { isSideBarExpanded, children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return <InternalError onReportError={this.onReportError} />;
    }

    return (
      <div className={DesktopWrapperStyle(isSideBarExpanded)}>
        <div className={LayoutWrapperStyle}>
          <div className={NavBarWrapperStyle}>
            <div id="navbar-root" className={NavBarStyle} />
            <UserNavbar />
          </div>

          <div>{children}</div>
        </div>
      </div>
    );
  }
}
