// @flow
import * as React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import Layout from 'components/Layout';

import NotificationList from './list';

type Props = {
  intl: intlShape,
};

type State = {
  viewType: string,
  page: number,
  perPage: number,
};

class NotificaionListModule extends React.Component<Props, State> {
  state = {
    viewType: 'grid',
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

export default injectIntl(NotificaionListModule);
