// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { prepareParsedContainerInput } from 'modules/container/form/mutation';
import { generateContainer } from 'utils/container';
import { getLatestDate } from 'utils/shipment';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import ActionDialog, { ContainerLabelIcon } from 'components/Dialog/ActionDialog';
import { createContainerMutation } from './mutation';

type Props = {|
  onSuccess: (shipmentId: string) => void,
|};

export default function InlineCreateContainer({ onSuccess }: Props) {
  const { mapping, onSetBadges } = Entities.useContainer();
  const { dispatch, state } = FocusedView.useContainer();
  const {
    isOpen,
    isProcessing,
    type,
    detail: { entity },
  } = state.containerActions;
  const [createContainer, containerResult] = useMutation(createContainerMutation);
  const shipmentId = entity.id;
  const isContainerCreation = type === 'createContainer';
  const shipment = mapping.entities?.shipments?.[shipmentId];
  const totalContainers = shipment?.containerCount ?? 0;
  const voyages = shipment?.voyages ?? [];
  const shipmentIsArchived = shipment?.archived ?? false;

  const input = {
    shipmentId,
    ...prepareParsedContainerInput({
      originalValues: {},
      existingBatches: [],
      newValues: {
        ...generateContainer(),
        no: `container no ${totalContainers + 1}`,
        freeTimeStartDate:
          voyages.length === 0 ? null : getLatestDate(voyages[voyages.length - 1].arrival),
        archived: shipmentIsArchived,
      },
      location: {
        inShipmentForm: false,
        inContainerForm: true,
      },
    }),
  };

  React.useEffect(() => {
    if (isOpen && isContainerCreation && !isProcessing && !containerResult.loading) {
      dispatch({
        type: 'CREATE_CONTAINER_START',
        payload: {},
      });
      createContainer({
        variables: {
          input,
        },
      });
    }
  }, [
    createContainer,
    dispatch,
    containerResult,
    input,
    isContainerCreation,
    isOpen,
    isProcessing,
  ]);

  React.useEffect(() => {
    if (isProcessing && isOpen && isContainerCreation) {
      if (containerResult.data) {
        dispatch({
          type: 'CREATE_CONTAINER_END',
          payload: {
            container: containerResult.data?.containerCreate ?? {},
          },
        });
        onSuccess(containerResult.data?.containerCreate?.shipment?.id);
        onSetBadges([
          { entity: 'container', id: containerResult.data?.containerCreate?.id, type: 'newItem' },
        ]);
      } else if (containerResult.error) {
        dispatch({
          type: 'CREATE_CONTAINER_END',
          payload: {
            error: containerResult.error,
          },
        });
      }
    }
  }, [
    dispatch,
    containerResult,
    isContainerCreation,
    isOpen,
    isProcessing,
    onSetBadges,
    onSuccess,
  ]);

  return (
    <ActionDialog
      isOpen={isOpen && isContainerCreation}
      isProcessing
      onCancel={() => {}}
      title={
        <FormattedMessage
          id="modules.RelationMap.label.createContainer"
          defaultMessage="CREATE CONTAINER"
        />
      }
      dialogMessage={
        <FormattedMessage
          id="modules.RelationMap.createContainer.creating"
          defaultMessage="Creating {containerLabel} ..."
          values={{ containerLabel: <ContainerLabelIcon /> }}
        />
      }
      buttons={null}
    />
  );
}
