// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedDate from 'components/FormattedDate';
import { BatchInfoStyle } from '../Card/style';
import { CardWrapperStyle, CardVisualizeStyle, CardTitleStyle } from '../style';
import messages from './messages';

type Props = {
  title: string | React.Node,
  quantity: number,
  volume: number,
  deliveredAt: ?string,
};

export default function BatchCard({ title, quantity, volume, deliveredAt }: Props) {
  const quantityTitle = <FormattedMessage {...messages.quantityTitle} />;
  const volumeTitle = <FormattedMessage {...messages.volumeTitle} />;

  return (
    <div className={CardWrapperStyle}>
      <div>
        <div className={CardTitleStyle}>{title}</div>
        <div className={CardTitleStyle}>
          <FormattedDate value={deliveredAt} />
        </div>
      </div>

      <div className={CardVisualizeStyle}>
        <div className={BatchInfoStyle}>
          <div>{quantityTitle}</div>
          <div>{quantity}</div>
        </div>
        <div className={BatchInfoStyle}>
          <div>{volumeTitle}</div>
          <div>{volume}</div>
        </div>
      </div>
    </div>
  );
}
