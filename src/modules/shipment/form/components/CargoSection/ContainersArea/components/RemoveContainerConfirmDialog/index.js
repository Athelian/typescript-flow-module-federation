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

type OptionalProps = {
  permission: {
    removeContainer: boolean,
    removeShipmentBatch: boolean,
  },
};

type Props = OptionalProps & {
  isOpen: boolean,
  onRequestClose: Function,
  onCancel: Function,
  onToBatchesPool: Function,
  onRemove: Function,
};

const defaultProps = {
  permission: {
    removeContainer: false,
    removeShipmentBatch: false,
  },
};

function RemoveContainerConfirmDialog({
  isOpen,
  permission,
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
              id="modules.Shipments.containerHasBatches"
              defaultMessage="This {Container} contains some {Batches}."
              values={{
                Container: spanWithColor(
                  <FormattedMessage id="modules.Shipments.container" defaultMessage="Container" />,
                  'CONTAINER'
                ),
                Batches: spanWithColor(
                  <FormattedMessage id="modules.Shipments.batches" defaultMessage="Batches" />,
                  'BATCH'
                ),
              }}
            />
          </div>
          <div>
            {permission.removeContainer && permission.removeShipmentBatch && (
              <FormattedMessage
                id="modules.Shipments.moveToBatchesPoolOrRemove"
                defaultMessage="Would you like these {Batches} to be placed in the {BatchesPool} or to be {REMOVED}?"
                values={{
                  Batches: spanWithColor(
                    <FormattedMessage id="modules.Shipments.Batches" defaultMessage="Batches" />,
                    'BATCH'
                  ),
                  BatchesPool: spanWithColor(
                    <FormattedMessage
                      id="modules.Shipments.BatchesPool"
                      defaultMessage="Batches Pool"
                    />,
                    'BATCH'
                  ),
                  REMOVED: spanWithColor(
                    <FormattedMessage id="modules.Shipments.REMOVED" defaultMessage="REMOVED" />,
                    'RED'
                  ),
                }}
              />
            )}
            {permission.removeContainer && !permission.removeShipmentBatch && (
              <FormattedMessage
                id="modules.Shipments.moveToBatchesPool"
                defaultMessage="Would you like these {Batches} to be placed in the {BatchesPool}?"
                values={{
                  Batches: spanWithColor(
                    <FormattedMessage id="modules.Shipments.Batches" defaultMessage="Batches" />,
                    'BATCH'
                  ),
                  BatchesPool: spanWithColor(
                    <FormattedMessage
                      id="modules.Shipments.BatchesPool"
                      defaultMessage="Batches Pool"
                    />,
                    'BATCH'
                  ),
                }}
              />
            )}
          </div>
        </div>
        <div className={ButtonsStyle}>
          {permission.removeContainer && (
            <BaseButton
              label={
                <FormattedMessage
                  id="modules.Shipments.toBatchesPool"
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
          )}
          {permission.removeContainer && permission.removeShipmentBatch && (
            <BaseButton
              label={<FormattedMessage id="modules.Shipments.remove" defaultMessage="REMOVE" />}
              icon="CLEAR"
              textColor="WHITE"
              hoverTextColor="WHITE"
              backgroundColor="RED"
              hoverBackgroundColor="RED_DARK"
              onClick={onRemove}
            />
          )}
        </div>
      </div>
    </Dialog>
  );
}

RemoveContainerConfirmDialog.defaultProps = defaultProps;

export default RemoveContainerConfirmDialog;
