// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Label } from 'components/Form';
import Icon from 'components/Icon';
import { BaseButton, NewButton } from 'components/Buttons';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import messages from 'modules/relationMap/messages';
import DisconnectConfirmMessage from './DisconnectConfirmMessage';
import ApplyPanel from './ApplyPanel';
import {
  MoveToShipmentPanelWrapperStyle,
  MoveToShipmentLabelAndMessageWrapperStyle,
  MoveToShipmentLabelWrapperStyle,
  MoveToShipmentMessageWrapperStyle,
  MoveToNewShipmentWrapperStyle,
  MoveToShipmentButtonsWrapperStyle,
} from './style';

type Props = {
  onMoveToNewShipment: Function,
  onMoveToExistShipment: Function,
  onClearSelectShipment: Function,
  onDisconnect: Function,
  hasSelectedShipment: boolean,
};

const MoveToShipmentPanel = ({
  hasSelectedShipment,
  onMoveToNewShipment,
  onMoveToExistShipment,
  onDisconnect,
  onClearSelectShipment,
}: Props) => {
  if (hasSelectedShipment)
    return <ApplyPanel onConfirm={onMoveToExistShipment} onReset={onClearSelectShipment} />;

  return (
    <div className={MoveToShipmentPanelWrapperStyle}>
      <div className={MoveToShipmentLabelAndMessageWrapperStyle}>
        <div className={MoveToShipmentLabelWrapperStyle}>
          <Icon icon="EXCHANGE" />
          <Label color="TEAL_DARK">
            <FormattedMessage {...messages.moveTo} />
          </Label>
          <Icon icon="SHIPMENT" />
        </div>

        <div className={MoveToShipmentMessageWrapperStyle}>
          <Label color="TEAL_DARK" align="center">
            <FormattedMessage {...messages.select} /> <Icon icon="SHIPMENT" />{' '}
            <FormattedMessage
              id="modules.RelationMaps.label.moveToShipmentMessage"
              defaultMessage="SHIPMENT TO MOVE TO ON THE LIST"
            />
          </Label>
        </div>
      </div>

      <div className={MoveToNewShipmentWrapperStyle}>
        <Label color="TEAL_DARK">
          <FormattedMessage {...messages.moveTo} />
        </Label>
        <NewButton
          label={<FormattedMessage {...messages.newShipment} />}
          onClick={onMoveToNewShipment}
        />
      </div>

      <BooleanValue>
        {({ value: isOpen, set: dialogToggle }) => (
          <>
            <div className={MoveToShipmentButtonsWrapperStyle}>
              <BaseButton
                icon="CLEAR"
                label={<FormattedMessage {...messages.disconnect} />}
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
              message={<DisconnectConfirmMessage />}
              onConfirm={() => {
                dialogToggle(false);
                onDisconnect();
              }}
            />
          </>
        )}
      </BooleanValue>
    </div>
  );
};

export default MoveToShipmentPanel;
