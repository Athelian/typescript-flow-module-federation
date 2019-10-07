// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { OrderFocused } from 'modules/relationMapV2/store';
import { BaseButton } from 'components/Buttons';
import ActionDialog, {
  BatchLabelIcon,
  ContainerLabelIcon,
  ShipmentLabelIcon,
} from '../ActionDialog';
import { removeBatchMutation } from './mutation';

type Props = {|
  onSuccess: (batchId: string) => void,
|};

export default function RemoveBatchConfirm({ onSuccess }: Props) {
  const [removeBatch] = useMutation(removeBatchMutation);
  const { dispatch, state } = OrderFocused.useContainer();
  const {
    isProcessing,
    isOpen,
    type,
    detail: { entity, from },
  } = state.batchActions;
  const isRemoveBatch = type === 'removeBatch';

  const onCancel = () => {
    dispatch({
      type: 'REMOVE_BATCH_CLOSE',
      payload: {},
    });
  };

  const onConfirm = () => {
    dispatch({
      type: 'REMOVE_BATCH_START',
      payload: {},
    });
    removeBatch({
      variables: {
        id: entity.id,
        input:
          from?.type === 'CONTAINER'
            ? {
                containerId: null,
              }
            : {
                shipmentId: null,
              },
      },
    })
      .then(() => {
        onSuccess(entity.id);
      })
      .catch(() => {
        dispatch({
          type: 'REMOVE_BATCH_CLOSE',
          payload: {},
        });
      });
  };

  let dialogMessage = null;
  let parentLabel = null;

  switch (from?.type) {
    case 'CONTAINER':
      parentLabel = <ContainerLabelIcon />;
      break;
    case 'SHIPMENT':
      parentLabel = <ShipmentLabelIcon />;
      break;
    default:
      break;
  }

  if (isProcessing) {
    // Is currently removing
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.removeBatch.removing"
        defaultMessage="Removing {batchLabel} from its {parentLabel} ..."
        values={{ batchLabel: <BatchLabelIcon />, parentLabel }}
      />
    );
  } else {
    // Has permission to remove
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.removeBatch.message1"
        defaultMessage="Are you sure you want to remove this {batchLabel} from its {parentLabel}"
        values={{ batchLabel: <BatchLabelIcon />, parentLabel }}
      />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen && isRemoveBatch}
      isProcessing={isProcessing}
      onCancel={onCancel}
      title={<FormattedMessage id="modules.RelationMap.label.remove" defaultMessage="REMOVE" />}
      dialogMessage={dialogMessage}
      buttons={
        <BaseButton
          label={<FormattedMessage id="modules.RelationMap.label.remove" defaultMessage="REMOVE" />}
          icon="REMOVE"
          onClick={onConfirm}
          textColor="RED"
          hoverTextColor="WHITE"
          backgroundColor="GRAY_SUPER_LIGHT"
          hoverBackgroundColor="RED"
        />
      }
    />
  );
}
