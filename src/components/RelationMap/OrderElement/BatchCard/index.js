// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import { BatchInfoStyle } from '../Card/style';
import { CardWrapperStyle, BatchCardVisualizeStyle, CardTitleStyle } from '../style';
import messages from './messages';

type Props = {
  batch: {
    no: string | React.Node,
    batchedQuantity: number,
    volumeLabel: number,
    metric: string,
    deliveredAt: ?string,
  },
};

const quantityTitle = <FormattedMessage {...messages.quantityTitle} />;
const volumeTitle = <FormattedMessage {...messages.volumeTitle} />;
export default class BatchCard extends React.PureComponent<Props> {
  render() {
    const {
      batch: { no, batchedQuantity: quantity, volumeLabel, deliveredAt, metric },
    } = this.props;
    return (
      <div className={CardWrapperStyle}>
        <div className={CardTitleStyle}>
          <div>{no}</div>
          <div>
            <FormattedDate value={deliveredAt} />
          </div>
        </div>

        <div className={BatchCardVisualizeStyle}>
          <div className={BatchInfoStyle}>
            <div>{quantityTitle}</div>
            <div>
              <FormattedNumber value={quantity} />
            </div>
          </div>
          <div className={BatchInfoStyle}>
            <div>{volumeTitle} </div>
            <div>
              <FormattedNumber value={volumeLabel} />
              {metric}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
