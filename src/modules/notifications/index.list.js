// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Content } from 'components/Layout';
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
      <Content>
        <NotificationList {...this.state} />
      </Content>
    );
  }
}

export default injectIntl(NotificationListModule);
