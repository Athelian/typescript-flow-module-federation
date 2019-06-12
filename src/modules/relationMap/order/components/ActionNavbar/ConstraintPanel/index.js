// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label } from 'components/Form';
import Icon from 'components/Icon';
import messages from 'modules/relationMap/messages';
import { ConstraintPanelWrapperStyle } from './style';

type Props = {
  disable: {
    disabledSplit: boolean,
    disableAutoFillBatch: boolean,
    disabledMoveToShipment: boolean,
    disabledMoveToOrder: boolean,
    disabledCloneOrder: boolean,
  },
};

const ConstraintPanel = ({ disable }: Props) => {
  const {
    disabledSplit,
    disabledMoveToOrder,
    disabledMoveToShipment,
    disableAutoFillBatch,
    disabledCloneOrder,
  } = disable;
  if (
    !disabledSplit &&
    !disabledMoveToOrder &&
    !disabledMoveToShipment &&
    !disableAutoFillBatch &&
    !disabledCloneOrder
  ) {
    return null;
  }
  return (
    <div className={ConstraintPanelWrapperStyle}>
      {disabledCloneOrder && (
        <Label align="center">
          <FormattedMessage {...messages.clone} />{' '}
          <FormattedMessage {...messages.actionNotAvailable} /> <Icon icon="ORDER" />{' '}
        </Label>
      )}
      {disabledSplit && (
        <Label align="center">
          <FormattedMessage {...messages.split} />{' '}
          <FormattedMessage {...messages.actionAvailable} /> 1 <Icon icon="BATCH" />{' '}
        </Label>
      )}
      {disableAutoFillBatch && (
        <Label align="center">
          <FormattedMessage {...messages.autoFillBatch} />{' '}
          <FormattedMessage
            id="modules.RelationMaps.action.actionAutoFillBatchAvailable"
            defaultMessage="is only available for a selection containing"
          />{' '}
          <Icon icon="ORDER_ITEM" />{' '}
        </Label>
      )}
      {disabledMoveToOrder && (
        <Label align="center">
          <FormattedMessage {...messages.moveTo} /> <FormattedMessage {...messages.order} />{' '}
          <FormattedMessage {...messages.actionAvailable} /> <Icon icon="ORDER_ITEM" />{' '}
          <FormattedMessage {...messages.expressionAndOr} /> <Icon icon="BATCH" />{' '}
          <FormattedMessage {...messages.shareSameExport} />
        </Label>
      )}
      {disabledMoveToShipment && (
        <Label align="center">
          <FormattedMessage {...messages.moveTo} /> <FormattedMessage {...messages.shipment} />{' '}
          <FormattedMessage {...messages.actionAvailable} />{' '}
          <FormattedMessage {...messages.atLeast} /> 1 <Icon icon="BATCH" />{' '}
          <FormattedMessage {...messages.expressionAnd} /> 0 <Icon icon="SHIPMENT" />{' '}
          <FormattedMessage {...messages.needToBeSameImporter} />
        </Label>
      )}
    </div>
  );
};

export default ConstraintPanel;
