// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Label } from 'components/Form';
import Icon from 'components/Icon';
import { BaseButton } from 'components/Buttons';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import messages from 'modules/relationMap/messages';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import ApplyPanel from './ApplyPanel';
import * as style from './style';

const { MoveToOrderPanelWrapper } = style;

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
  currencies: Array<string>,
};

const MoveToOrderPanel = ({
  hasSelectedOrder,
  hasSelectedOrderItem,
  hasSelectedAllBatches,
  onMoveToNewOrder,
  onMoveToExistOrder,
  onDelete,
  onClearSelectOrder,
  currencies,
}: Props) => (
  <MoveToOrderPanelWrapper>
    {hasSelectedOrder ? (
      <ApplyPanel
        hasSelectedAllBatches={hasSelectedAllBatches}
        hasSelectedOrderItem={hasSelectedOrderItem}
        onConfirm={onMoveToExistOrder}
        onReset={onClearSelectOrder}
        currencies={currencies}
      />
    ) : (
      <>
        <div className={style.SubPanel}>
          <Label className={style.LabelConnectStyle}>
            <FormattedMessage {...messages.connect} />
            <Icon icon="CONNECT" />
          </Label>
          <Label className={style.GroupLabelButtonLeftStyle}>
            <FormattedMessage {...messages.select} />
            <Label color="ORDER" className={style.GroupLabelButtonStyle}>
              <Icon icon="ORDER" />
              <FormattedMessage {...messages.ordersTab} />
            </Label>
            <FormattedMessage {...messages.toConnectToTheList} />
          </Label>
        </div>
        <div className={style.SubPanel}>
          <Label className={style.GroupLabelButtonStyle}>
            <FormattedMessage {...messages.connectTo} />
            <BaseButton
              icon="ADD"
              label={<FormattedMessage {...messages.newOrder} className={style.PanelButtonStyle} />}
              onClick={onMoveToNewOrder}
            />
          </Label>
        </div>
        <BooleanValue>
          {({ value: isOpen, set: dialogToggle }) => (
            <>
              <Label className={style.GroupLabelButtonStyle}>
                <BaseButton
                  icon="CLEAR"
                  label={<FormattedMessage {...messages.delete} />}
                  className={style.PanelButtonStyle}
                  onClick={() => dialogToggle(true)}
                />
              </Label>
              <ConfirmDialog
                onRequestClose={() => dialogToggle(false)}
                onCancel={() => dialogToggle(false)}
                isOpen={isOpen}
                message={<DeleteConfirmDialog />}
                onConfirm={() => {
                  dialogToggle(false);
                  onDelete();
                }}
              />
            </>
          )}
        </BooleanValue>
      </>
    )}
  </MoveToOrderPanelWrapper>
);

export default MoveToOrderPanel;
