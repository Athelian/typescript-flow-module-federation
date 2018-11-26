// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedDate from 'components/FormattedDate';
import { BatchInfoStyle } from '../Card/style';
import { CardWrapperStyle, BatchCardVisualizeStyle, CardTitleStyle } from '../style';
import messages from './messages';

type Props = {
  batch: {
    no: string | React.Node,
    batchedQuantity: number,
    volumeLabel: number,
    deliveredAt: ?string,
  },
};

const quantityTitle = <FormattedMessage {...messages.quantityTitle} />;
const volumeTitle = <FormattedMessage {...messages.volumeTitle} />;
export default class BatchCard extends React.PureComponent<Props> {
  render() {
    const {
      batch: { no, batchedQuantity: quantity, volumeLabel, deliveredAt },
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
            <div>{quantity}</div>
          </div>
          <div className={BatchInfoStyle}>
            <div>{volumeTitle}</div>
            <div>{volumeLabel}</div>
          </div>
        </div>
      </div>
    );
  }
}
