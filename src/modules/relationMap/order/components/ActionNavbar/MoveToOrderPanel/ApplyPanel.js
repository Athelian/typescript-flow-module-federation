// @flow
import React from 'react';
import { BooleanValue } from 'react-values';
import { Label } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { CancelButton, YesButton } from 'components/Buttons';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import messages from 'modules/relationMap/messages';
import ConfirmMessage from './ConfirmMessage';
import {
  MoveToOrderPanelWrapperStyle,
  MoveToOrderLabelWrapperStyle,
  MoveToOrderMessageWrapperStyle,
  MoveToOrderButtonsWrapperStyle,
} from './style';

type Props = {
  hasSelectedAllBatches: boolean,
  hasSelectedOrderItem: boolean,
  currencies: Array<string>,
  onReset: Function,
  onConfirm: Function,
};

const ApplyPanel = ({
  onReset,
  onConfirm,
  hasSelectedAllBatches,
  hasSelectedOrderItem,
  currencies,
}: Props) => {
  return (
    <div className={MoveToOrderPanelWrapperStyle}>
      <div className={MoveToOrderLabelWrapperStyle}>
        <Icon icon="EXCHANGE" />
        <Label color="TEAL_DARK">
          <FormattedMessage {...messages.connect} />
        </Label>
        <Icon icon="ORDER" />
      </div>

      <div className={MoveToOrderMessageWrapperStyle}>
        <Label color="TEAL_DARK" align="CENTER">
          <FormattedMessage {...messages.askConnectToOrder} />
        </Label>
      </div>

      <div className={MoveToOrderButtonsWrapperStyle}>
        <CancelButton onClick={onReset} />

        <BooleanValue>
          {({ value: isOpen, set: dialogToggle }) => (
            <>
              <YesButton onClick={() => dialogToggle(true)} />
              <ConfirmDialog
                isOpen={isOpen}
                onRequestClose={() => dialogToggle(false)}
                onCancel={() => dialogToggle(false)}
                message={
                  <ConfirmMessage
                    selectAllBatch={hasSelectedAllBatches}
                    hasSelectedOrderItem={hasSelectedOrderItem}
                    totalDiff={currencies.length - 1}
                    hasDiffCurrency={currencies.length > 1}
                    baseCurrency={currencies[0]}
                    diffCurrency={currencies.length > 1 ? currencies[1] : ''}
                  />
                }
                onConfirm={() => {
                  dialogToggle(false);
                  onConfirm({
                    hasSelectedAllBatches,
                    currencies,
                  });
                }}
              />
            </>
          )}
        </BooleanValue>
      </div>
    </div>
  );
};

export default ApplyPanel;
