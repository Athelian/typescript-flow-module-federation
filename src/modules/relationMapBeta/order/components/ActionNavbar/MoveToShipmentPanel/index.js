// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Label } from 'components/Form';
import Icon from 'components/Icon';
import { BaseButton } from 'components/Buttons';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import messages from 'modules/relationMap/messages';
import DisconnectConfirmMessage from './DisconnectConfirmMessage';
import ApplyPanel from './ApplyPanel';
import SuccessPanel from './SuccessPanel';
import * as style from './style';

const { MoveToShipmentPanelWrapper } = style;

type Props = {
  onMoveToNewShipment: Function,
  onMoveToExistShipment: Function,
  onClearSelectShipment: Function,
  onClear: Function,
  onDisconnect: Function,
  hasSelectedShipment: boolean,
  status: boolean,
};

const MoveToShipmentPanel = ({
  status,
  hasSelectedShipment,
  onMoveToNewShipment,
  onMoveToExistShipment,
  onDisconnect,
  onClearSelectShipment,
  onClear,
}: Props) => {
  if (status) return <SuccessPanel onClick={onClear} />;
  return (
    <MoveToShipmentPanelWrapper>
      {(() => {
        if (hasSelectedShipment)
          return (
            <ApplyPanel
              hasSelectedShipment={hasSelectedShipment}
              onConfirm={onMoveToExistShipment}
              onReset={onClearSelectShipment}
            />
          );
        return (
          <>
            <div className={style.SubPanel}>
              <Label className={style.LabelConnectStyle}>
                <FormattedMessage {...messages.connect} />
                <Icon icon="CONNECT" />
              </Label>
              <Label className={style.GroupLabelButtonLeftStyle}>
                <FormattedMessage {...messages.select} />
                <Label color="SHIPMENT" className={style.GroupLabelButtonStyle}>
                  <Icon icon="SHIPMENT" />
                  <FormattedMessage {...messages.shipmentsTab} />
                </Label>
                <FormattedMessage {...messages.toConnectToTheList} />
              </Label>
            </div>
            <div className={style.SubPanel}>
              <Label className={style.GroupLabelButtonStyle}>
                <FormattedMessage {...messages.connectTo} />
                <BaseButton
                  icon="ADD"
                  label={
                    <FormattedMessage
                      {...messages.newShipment}
                      className={style.PanelButtonStyle}
                    />
                  }
                  onClick={onMoveToNewShipment}
                />
              </Label>
            </div>
            <BooleanValue>
              {({ value: isOpen, set: dialogToggle }) => (
                <>
                  <Label className={style.GroupLabelButtonStyle}>
                    <BaseButton
                      icon="CLEAR"
                      label={<FormattedMessage {...messages.disconnect} />}
                      className={style.PanelButtonStyle}
                      onClick={() => dialogToggle(true)}
                    />
                  </Label>
                  <ConfirmDialog
                    onRequestClose={() => dialogToggle(false)}
                    onCancel={() => dialogToggle(false)}
                    isOpen={isOpen}
                    message={<DisconnectConfirmMessage />}
                    onConfirm={() => {
                      dialogToggle(false);
                      onDisconnect();
                    }}
                  />
                </>
              )}
            </BooleanValue>
          </>
        );
      })()}
    </MoveToShipmentPanelWrapper>
  );
};

export default MoveToShipmentPanel;
