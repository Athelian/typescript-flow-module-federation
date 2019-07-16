// @flow
import * as React from 'react';
import * as Sentry from '@sentry/browser';
import { isDevEnvironment } from 'utils/env';
import InternalError from 'components/InternalError';
import UserNavbar from 'modules/userNavbar';
import { DesktopWrapperStyle } from 'styles/main';
import { LayoutWrapperStyle, NavBarStyle, ChildrenWrapperStyle } from './layoutStyle';

type Props = {
  isSideBarExpanded?: boolean,
  children: React.Node,
};

type State = {
  hasError: boolean,
};

export default class Layout extends React.Component<Props, State> {
  state: State = { hasError: false };

  onReportError = () => {
    if (Sentry.lastEventId() && !isDevEnvironment) {
      Sentry.showReportDialog();
    }
  };

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

  render() {
    const { isSideBarExpanded, children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return <InternalError onReportError={this.onReportError} />;
    }

    return (
      <div className={DesktopWrapperStyle(isSideBarExpanded)}>
        <div className={LayoutWrapperStyle}>
          <div className={NavBarStyle}>
            <div id="navbar-root" className={ChildrenWrapperStyle} />
            <UserNavbar />
          </div>

          <div>{children}</div>
        </div>
      </div>
    );
  }
}
