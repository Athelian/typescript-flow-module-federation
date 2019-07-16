// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import { Layout } from 'components/Layout';

import NotificationList from './list';

type Props = {
  intl: IntlShape,
};

type State = {
  page: number,
  perPage: number,
};

class NotificationListModule extends React.Component<Props, State> {
  state = {
    page: 1,
    perPage: 10,
  };

  render() {
    return (
      <UIConsumer>
        {uiState => (
          <Layout {...uiState} navBar={<NavBar>{null}</NavBar>}>
            <NotificationList {...this.state} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(NotificationListModule);
