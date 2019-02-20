// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label } from 'components/Form';
import Icon from 'components/Icon';
import messages from 'modules/relationMap/messages';
import * as style from './style';

type Props = {
  disable: {
    disabledSplit: boolean,
    disabledMoveToShipment: boolean,
    disabledMoveToOrder: boolean,
  },
};
const ConstrainPanel = ({ disable }: Props) => {
  const { disabledSplit, disabledMoveToOrder, disabledMoveToShipment } = disable;
  if (!disabledSplit && !disabledMoveToOrder && !disabledMoveToShipment) {
    return null;
  }
  return (
    <div className={style.ContainerWrapper}>
      {disabledSplit && (
        <Label className={style.LabelStyle} align="center">
          <FormattedMessage {...messages.split} />{' '}
          <FormattedMessage {...messages.actionAvailable} /> 1 <Icon icon="BATCH" />{' '}
        </Label>
      )}
      {disabledMoveToOrder && (
        <Label className={style.LabelStyle} align="center">
          <FormattedMessage {...messages.moveTo} /> <FormattedMessage {...messages.order} />{' '}
          <FormattedMessage {...messages.actionAvailable} /> <Icon icon="ORDER_ITEM" />{' '}
          <FormattedMessage {...messages.expressionAndOr} /> <Icon icon="BATCH" />{' '}
          <FormattedMessage {...messages.shareSameExport} />
        </Label>
      )}
      {disabledMoveToShipment && (
        <Label className={style.LabelStyle} align="center">
          <FormattedMessage {...messages.moveTo} /> <FormattedMessage {...messages.shipment} />{' '}
          <FormattedMessage {...messages.actionAvailable} />{' '}
          <FormattedMessage {...messages.atLeast} /> 1 <Icon icon="ORDER_ITEM" />{' '}
          <FormattedMessage {...messages.expressionAnd} /> 0 <Icon icon="BATCH" />
        </Label>
      )}
    </div>
  );
};

export default ConstrainPanel;
