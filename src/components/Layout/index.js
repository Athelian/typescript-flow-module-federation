// @flow
import * as React from 'react';
import Raven from 'raven-js';
import { isDevEnvironment } from 'utils/env';
import InternalError from 'components/InternalError';
import { DesktopWrapperStyle } from 'styles/main';
import { LayoutWrapperStyle, ContentWrapperStyle } from './style';

type Props = {
  isSideBarExpanded?: boolean,
  navBar: React.Node,
  children: React.Node,
};

type State = {
  hasError: boolean,
};

const defaultProps = {
  navBar: '',
};

export default class Layout extends React.PureComponent<Props, State> {
  static defaultProps = defaultProps;

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
    const { isSideBarExpanded, navBar, children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return <InternalError onReportError={this.onReportError} />;
    }

    return (
      <div className={DesktopWrapperStyle(isSideBarExpanded)}>
        <div className={LayoutWrapperStyle}>
          {navBar}
          <div className={ContentWrapperStyle}>{children}</div>
        </div>
      </div>
    );
  }
}
