// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BatchInfoStyle } from '../Card/style';
import { CardWrapperStyle, CardVisualizeStyle, CardTitleStyle } from '../style';
import messages from './messages';

type Props = {
  title: string | React.Node,
  quantity: number,
  volume: number,
};

export default function BatchCard({ title, quantity, volume }: Props) {
  const quantityTitle = <FormattedMessage {...messages.quantityTitle} />;
  const volumeTitle = <FormattedMessage {...messages.volumeTitle} />;

  return (
    <div className={CardWrapperStyle}>
      <div className={CardTitleStyle}>{title}</div>
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
