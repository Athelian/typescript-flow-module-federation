// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { spanWithColor } from 'utils/color';
import Dialog from 'components/Dialog';
import { BaseButton } from 'components/Buttons';

import {
  ModalStyle,
  ConfirmMessageStyle,
  ButtonsStyle,
} from 'components/Dialog/ActivateDialog/style';

type Props = {
  isOpen: boolean,
  onRequestClose: Function,
  onCancel: Function,
  onToBatchesPool: Function,
  onRemove: Function,
};
function RemoveContainerConfirmDialog({
  isOpen,
  onRequestClose,
  onCancel,
  onToBatchesPool,
  onRemove,
}: Props) {
  return (
    <Dialog
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      width="400px"
      showCancelButton
      onCancel={onCancel}
    >
      <div className={ModalStyle}>
        <div className={ConfirmMessageStyle}>
          <div>
            <FormattedMessage
              id="modules.shipment.containerHasBatches"
              defaultMessage="This {Container} contains some {Batches}."
              values={{
                Container: spanWithColor(
                  <FormattedMessage id="modules.shipment.container" defaultMessage="Container" />,
                  'CONTAINER'
                ),
                Batches: spanWithColor(
                  <FormattedMessage id="modules.shipment.batches" defaultMessage="Batches" />,
                  'BATCH'
                ),
              }}
            />
          </div>
          <div>
            <FormattedMessage
              id="modules.shipment.moveToBatchesPoolOrRemove"
              defaultMessage="Would you like these {Batches} to be placed in the {BatchesPool} or to be {REMOVED}?"
              values={{
                Batches: spanWithColor(
                  <FormattedMessage id="modules.shipment.Batches" defaultMessage="Batches" />,
                  'BATCH'
                ),
                BatchesPool: spanWithColor(
                  <FormattedMessage
                    id="modules.shipment.BatchesPool"
                    defaultMessage="Batches Pool"
                  />,
                  'BATCH'
                ),
                REMOVED: spanWithColor(
                  <FormattedMessage id="modules.shipment.REMOVED" defaultMessage="REMOVED" />,
                  'RED'
                ),
              }}
            />
          </div>
        </div>
        <div className={ButtonsStyle}>
          <BaseButton
            label={
              <FormattedMessage
                id="modules.shipment.toBatchesPool"
                defaultMessage="TO BATCHES POOL"
              />
            }
            icon="BATCH"
            textColor="WHITE"
            hoverTextColor="WHITE"
            backgroundColor="TEAL"
            hoverBackgroundColor="TEAL_DARK"
            onClick={onToBatchesPool}
          />
          <BaseButton
            label={<FormattedMessage id="modules.shipment.remove" defaultMessage="REMOVE" />}
            icon="CLEAR"
            textColor="WHITE"
            hoverTextColor="WHITE"
            backgroundColor="RED"
            hoverBackgroundColor="RED_DARK"
            onClick={onRemove}
          />
        </div>
      </div>
    </Dialog>
  );
}

export default RemoveContainerConfirmDialog;
