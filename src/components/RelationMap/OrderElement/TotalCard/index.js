// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import messages from 'modules/relationMap/messages';
import { TotalCardWrapperStyle } from './style';

type Props = {
  quantity: number,
  name: string,
  intl: IntlShape,
};
class TotalCard extends React.PureComponent<Props> {
  render() {
    const { quantity, name, intl } = this.props;

    return (
      <div className={TotalCardWrapperStyle}>
        <span>{intl.formatMessage(messages.total, { number: quantity, name })}</span>
        <span>{intl.formatMessage(messages.all)}</span>
      </div>
    );
  }
}
export default injectIntl(TotalCard);
