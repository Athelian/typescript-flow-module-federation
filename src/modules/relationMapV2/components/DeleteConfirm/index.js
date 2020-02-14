// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useAllHasPermission } from 'contexts/Permissions';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import { targetedIds } from 'modules/relationMapV2/helpers';
import { ORDER_ITEM, CONTAINER } from 'modules/relationMapV2/constants';
import { ORDER_ITEMS_DELETE } from 'modules/permission/constants/orderItem';
import { CONTAINER_DELETE } from 'modules/permission/constants/container';
import { BaseButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import ActionDialog, {
  ItemsLabelIcon,
  ItemLabelIcon,
  ContainersLabelIcon,
  ContainerLabelIcon,
  BatchesLabelIcon,
  ShipmentLabelIcon,
} from 'components/Dialog/ActionDialog';
import DocumentsDeleteDialog from 'components/Dialog/DocumentsDeleteDialog';
import { deleteManyFileMutation } from 'modules/document/mutation';
import { itemsQuery } from '../DeleteItemConfirm/query';
import { deleteContainerMutation, deleteOrderItemMutation } from './mutation';

type Props = {|
  onSuccess: ({ orderItemIds: Array<string>, containerIds: Array<string> }) => void,
|};

export default function DeleteConfirm({ onSuccess }: Props) {
  const [step, setStep] = React.useState(1);
  const { mapping } = Entities.useContainer();
  const { dispatch, state } = FocusedView.useContainer();
  const { isProcessing, isOpen, source } = state.deleteEntities;
  const orderItemIds = targetedIds(state.targets, ORDER_ITEM);
  const containerIds = targetedIds(state.targets, CONTAINER);
  const itemsQueryResult = useQuery(itemsQuery, {
    skip: source !== ORDER_ITEM,
    variables: {
      ids: orderItemIds,
    },
  });
  const [deleteOrderItem] = useMutation(deleteOrderItemMutation);
  const [deleteItemFiles] = useMutation(deleteManyFileMutation);
  const [deleteContainer] = useMutation(deleteContainerMutation);

  const hasItemPermissions = useAllHasPermission(
    orderItemIds.map(id => mapping.entities?.orderItems?.[id]?.ownedBy).filter(Boolean)
  );
  const totalOrderItems = orderItemIds.length;
  const hasContainerPermissions = useAllHasPermission(
    containerIds.map(id => mapping.entities?.containers?.[id]?.ownedBy).filter(Boolean)
  );
  const totalContainers = containerIds.length;

  const hasPermission = (permission: string | Array<string>) => {
    switch (source) {
      case ORDER_ITEM:
        return hasItemPermissions(permission);
      case CONTAINER:
        return hasContainerPermissions(permission);
      default:
        return false;
    }
  };

  const allowToUpdate = () => {
    switch (source) {
      case ORDER_ITEM:
        return hasPermission([ORDER_ITEMS_DELETE]);
      case CONTAINER:
        return hasPermission([CONTAINER_DELETE]);
      default:
        return false;
    }
  };

  const onCancel = () => {
    dispatch({
      type: 'DELETE_CLOSE',
      payload: {},
    });
    setStep(0);
  };

  const deleteItemsHandler = React.useCallback(() => {
    Promise.all(
      orderItemIds.map(id =>
        deleteOrderItem({
          variables: {
            id,
          },
        })
      )
    )
      .then(() => {
        onSuccess({
          orderItemIds,
          containerIds: [],
        });
      })
      .catch(() => {
        dispatch({
          type: 'DELETE_CLOSE',
          payload: {},
        });
      });
  }, [deleteOrderItem, dispatch, onSuccess, orderItemIds]);

  const onConfirm = () => {
    dispatch({
      type: 'DELETE_START',
      payload: {},
    });
    if (source === ORDER_ITEM) {
      const items = itemsQueryResult.data?.orderItemsByIDs ?? [];
      const files = items.reduce((currFiles, item) => currFiles.concat(item.files), []);
      if (files.length) {
        setStep(2);
      } else {
        deleteItemsHandler();
      }
    } else {
      Promise.all(
        containerIds.map(id =>
          deleteContainer({
            variables: {
              id,
            },
          })
        )
      )
        .then(() => {
          onSuccess({
            orderItemIds: [],
            containerIds,
          });
        })
        .catch(() => {
          dispatch({
            type: 'DELETE_CLOSE',
            payload: {},
          });
        });
    }
  };

  const noPermission = !allowToUpdate();

  let dialogMessage = null;
  let dialogSubMessage = null;
  let entityLabel = null;
  let numOfEntity = null;

  if (noPermission) {
    // No permission to delete
    switch (source) {
      case ORDER_ITEM:
        entityLabel = <ItemLabelIcon />;
        break;
      case CONTAINER:
        entityLabel = <ContainerLabelIcon />;
        break;
      default:
        break;
    }
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.delete.noPermission"
        defaultMessage="At least one {entityLabel} selected does not allow you to delete."
        values={{ entityLabel }}
      />
    );
    dialogSubMessage = (
      <FormattedMessage
        id="modules.RelationMap.actions.tryAgain"
        defaultMessage="Please reselect and try again."
      />
    );
  } else {
    switch (source) {
      case ORDER_ITEM:
        numOfEntity = <FormattedNumber value={totalOrderItems} />;
        entityLabel = totalOrderItems > 1 ? <ItemsLabelIcon /> : <ItemLabelIcon />;
        break;
      case CONTAINER:
        numOfEntity = <FormattedNumber value={totalContainers} />;
        entityLabel = totalContainers > 1 ? <ContainersLabelIcon /> : <ContainerLabelIcon />;
        break;
      default:
        break;
    }
    if (isProcessing) {
      // Is currently deleting
      dialogMessage = (
        <FormattedMessage
          id="modules.RelationMap.delete.deleting"
          defaultMessage="Deleting {numOfEntity} {entityLabel} ..."
          values={{
            numOfEntity,
            entityLabel,
          }}
        />
      );
    } else if (itemsQueryResult.loading) {
      dialogMessage = (
        <FormattedMessage
          id="modules.RelationMap.deleteItem.loading"
          defaultMessage="Loading {numOfEntity} {entityLabel} ..."
          values={{
            numOfEntity,
            entityLabel,
          }}
        />
      );
    } else {
      // Has permission to delete
      dialogMessage = (
        <FormattedMessage
          id="modules.RelationMap.delete.message"
          defaultMessage="Are you sure you want to delete {numOfEntity} {entityLabel} that you have selected?"
          values={{
            numOfEntity,
            entityLabel,
          }}
        />
      );
      switch (source) {
        case ORDER_ITEM:
          dialogSubMessage = (
            <FormattedMessage
              id="modules.RelationMap.delete.itemMessage2"
              defaultMessage="All of their {batchesLabel} will be deleted as well"
              values={{
                batchesLabel: <BatchesLabelIcon />,
              }}
            />
          );
          break;
        case CONTAINER:
          dialogSubMessage = (
            <FormattedMessage
              id="modules.RelationMap.delete.containerMessage2"
              defaultMessage="All of their {batchesLabel} will be moved to the {shipmentLabel} pool"
              values={{
                batchesLabel: <BatchesLabelIcon />,
                shipmentLabel: <ShipmentLabelIcon />,
              }}
            />
          );
          break;
        default:
          break;
      }
    }
  }

  const items = itemsQueryResult.data?.orderItemsByIDs ?? [];
  const files = items.reduce((currFiles, item) => currFiles.concat(item.files), []);
  if (step === 2 && files.length > 0) {
    return (
      <DocumentsDeleteDialog
        files={files}
        isMultiple={items.length > 1}
        isOpen
        entityType="ITEM"
        onCancel={onCancel}
        onKeep={deleteItemsHandler}
        onDelete={() => {
          deleteItemsHandler();
          deleteItemFiles({
            variables: {
              ids: files.map(file => file.id),
            },
          });
        }}
      />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={isProcessing}
      onCancel={onCancel}
      title={<FormattedMessage id="modules.RelationMap.label.delete" defaultMessage="DELETE" />}
      dialogMessage={dialogMessage}
      dialogSubMessage={dialogSubMessage}
      buttons={
        <BaseButton
          label={<FormattedMessage id="modules.RelationMap.label.delete" defaultMessage="DELETE" />}
          icon="REMOVE"
          disabled={noPermission}
          onClick={onConfirm}
          backgroundColor="RED"
          hoverBackgroundColor="RED_DARK"
        />
      }
    />
  );
}
