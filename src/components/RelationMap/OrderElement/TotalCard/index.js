// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import { Label } from 'components/Form';
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
        <Label align="center">
          <FormattedNumber value={quantity} />
          {` ${intl.formatMessage(messages[name])}`}
        </Label>
      </div>
    );
  }
}
export default injectIntl(TotalCard);
