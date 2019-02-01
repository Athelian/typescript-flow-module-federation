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
  hasSelectedOrder: boolean,
  hasSelectedAllBatches: boolean,
};

const MoveToOrderPanel = ({
  hasSelectedOrder,
  hasSelectedAllBatches,
  onMoveToNewOrder,
  onMoveToExistOrder,
  onDelete,
  onClearSelectOrder,
}: Props) => (
  <MoveToOrderPanelWrapper>
    {hasSelectedOrder ? (
      <ApplyPanel
        hasSelectedAllBatches={hasSelectedAllBatches}
        onConfirm={onMoveToExistOrder}
        onReset={onClearSelectOrder}
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
