// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Label } from 'components/Form';
import Icon from 'components/Icon';
import { BaseButton, NewButton } from 'components/Buttons';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import messages from 'modules/relationMap/messages';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import ApplyPanel from './ApplyPanel';
import {
  MoveToOrderPanelWrapperStyle,
  MoveToOrderLabelAndMessageWrapperStyle,
  MoveToOrderLabelWrapperStyle,
  MoveToOrderMessageWrapperStyle,
  MoveToNewOrderWrapperStyle,
  MoveToOrderButtonsWrapperStyle,
} from './style';

type Props = {
  onMoveToNewOrder: Function,
  onMoveToExistOrder: Function,
  onClearSelectOrder: Function,
  onDelete: Function,
  /**
   * Have selected an order for connect
   */
  hasSelectedOrder: boolean,
  /**
   * Have targeted at least one order item
   */
  hasSelectedOrderItem: boolean,
  /**
   * Have targeted all batches inside an order item
   */
  hasSelectedAllBatches: boolean,
  allowToMoveToNew: boolean,
  currencies: Array<string>,
};

const MoveToOrderPanel = ({
  hasSelectedOrder,
  hasSelectedOrderItem,
  hasSelectedAllBatches,
  allowToMoveToNew,
  onMoveToNewOrder,
  onMoveToExistOrder,
  onDelete,
  onClearSelectOrder,
  currencies,
}: Props) => {
  if (hasSelectedOrder)
    return (
      <ApplyPanel
        hasSelectedAllBatches={hasSelectedAllBatches}
        hasSelectedOrderItem={hasSelectedOrderItem}
        onConfirm={onMoveToExistOrder}
        onReset={onClearSelectOrder}
        currencies={currencies}
      />
    );

  return (
    <div className={MoveToOrderPanelWrapperStyle}>
      <div className={MoveToOrderLabelAndMessageWrapperStyle}>
        <div className={MoveToOrderLabelWrapperStyle}>
          <Icon icon="EXCHANGE" />
          <Label color="TEAL_DARK">
            <FormattedMessage {...messages.moveTo} />
          </Label>
          <Icon icon="ORDER" />
        </div>

        <div className={MoveToOrderMessageWrapperStyle}>
          <Label color="TEAL_DARK" align="center">
            <FormattedMessage {...messages.select} /> <Icon icon="ORDER" />{' '}
            <FormattedMessage
              id="modules.RelationMaps.label.moveToOrderMessage"
              defaultMessage="ORDER TO MOVE TO ON THE LIST"
            />
          </Label>
        </div>
      </div>
      {allowToMoveToNew && (
        <div className={MoveToNewOrderWrapperStyle}>
          <Label color="TEAL_DARK">
            <FormattedMessage {...messages.moveTo} />
          </Label>
          <NewButton
            label={<FormattedMessage {...messages.newOrder} />}
            onClick={() => onMoveToNewOrder({ currencies })}
          />
        </div>
      )}

      <BooleanValue>
        {({ value: isOpen, set: dialogToggle }) => (
          <>
            <div className={MoveToOrderButtonsWrapperStyle}>
              <BaseButton
                icon="REMOVE"
                label={<FormattedMessage {...messages.delete} />}
                onClick={() => dialogToggle(true)}
                textColor="WHITE"
                hoverTextColor="WHITE"
                backgroundColor="GRAY"
                hoverBackgroundColor="RED"
              />
            </div>
            <ConfirmDialog
              onRequestClose={() => dialogToggle(false)}
              onCancel={() => dialogToggle(false)}
              isOpen={isOpen}
              message={<DeleteConfirmDialog />}
              onConfirm={() => {
                dialogToggle(false);
                onDelete(currencies);
              }}
            />
          </>
        )}
      </BooleanValue>
    </div>
  );
};

export default MoveToOrderPanel;
