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
    disableAutoFillBatch: boolean,
    disabledMoveToShipment: boolean,
    disabledMoveToOrder: boolean,
  },
};
const ConstraintPanel = ({ disable }: Props) => {
  const {
    disabledSplit,
    disabledMoveToOrder,
    disabledMoveToShipment,
    disableAutoFillBatch,
  } = disable;
  if (!disabledSplit && !disabledMoveToOrder && !disabledMoveToShipment && !disableAutoFillBatch) {
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
      {disableAutoFillBatch && (
        <Label className={style.LabelStyle} align="center">
          <FormattedMessage {...messages.autoFillBatch} />{' '}
          <FormattedMessage
            id="modules.RelationMaps.action.actionAutoFillBatchAvailable"
            defaultMessage="is only available for a selection containing"
          />{' '}
          1 <Icon icon="ORDER_ITEM" />{' '}
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

export default ConstraintPanel;
