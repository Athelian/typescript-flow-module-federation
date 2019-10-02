// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { useAllHasPermission } from 'components/Context/Permissions';
import { Entities } from 'modules/relationMapV2/store';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { ORDER_ITEM, CONTAINER } from 'modules/relationMapV2/constants';
import { ORDER_ITEMS_DELETE } from 'modules/permission/constants/orderItem';
import { CONTAINER_DELETE } from 'modules/permission/constants/container';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { CancelButton, YesButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { parseIcon } from 'utils/entity';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';
import { deleteContainerMutation, deleteOrderItemMutation } from './mutation';
import { targetedIds } from '../OrderFocus/helpers';

type Props = {|
  onSuccess: ({ orderItemIds: Array<string>, containerIds: Array<string> }) => void,
|};

export default function DeleteConfirm({ onSuccess }: Props) {
  const { mapping } = Entities.useContainer();
  const [deleteOrderItem] = useMutation(deleteOrderItemMutation);
  const [deleteContainer] = useMutation(deleteContainerMutation);
  const { dispatch, state } = React.useContext(RelationMapContext);
  const { isProcessing, isOpen, source } = state.deleteEntities;
  const orderItemIds = targetedIds(state.targets, ORDER_ITEM);
  const hasItemPermissions = useAllHasPermission(
    orderItemIds.map(id => mapping.entities?.orderItems?.[id]?.ownedBy).filter(Boolean)
  );
  const containerIds = targetedIds(state.targets, CONTAINER);
  const hasContainerPermissions = useAllHasPermission(
    containerIds.map(id => mapping.entities?.containers?.[id]?.ownedBy).filter(Boolean)
  );
  const selectedEntities = source === ORDER_ITEM ? orderItemIds.length : containerIds.length;

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
  };
  const onConfirm = () => {
    dispatch({
      type: 'DELETE_START',
      payload: {},
    });
    if (source === ORDER_ITEM) {
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

  if (noPermission) {
    return (
      <Dialog isOpen={isOpen} width="400px" onRequestClose={() => {}}>
        <div className={DialogStyle}>
          <h3 className={ConfirmMessageStyle}>
            <FormattedMessage
              id="modules.RelationMap.delete.noPermission"
              defaultMessage="At least one {source} {entity} selected does not allow you to delete.Please reselect and try again."
              values={{
                source,
                entity: <Icon icon={parseIcon(source)} />,
              }}
            />
          </h3>
          <div className={ButtonsStyle}>
            <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
          </div>
        </div>
      </Dialog>
    );
  }
  return (
    <Dialog isOpen={isOpen} width="400px" onRequestClose={() => {}}>
      <div className={DialogStyle}>
        {isProcessing ? (
          <>
            <FormattedMessage
              id="modules.RelationMap.delete.process"
              defaultMessage="Deleting {source} {entity} ..."
              values={{
                source,
                entity: <Icon icon={parseIcon(source)} />,
              }}
            />
            <LoadingIcon />
          </>
        ) : (
          <h3 className={ConfirmMessageStyle}>
            <FormattedMessage
              id="modules.RelationMap.delete.guideline"
              defaultMessage="Are you sure you want to delete {total} {source} {entity} ?"
              values={{
                source,
                total: selectedEntities,
                entity: <Icon icon={parseIcon(source)} />,
              }}
            />
          </h3>
        )}
        <div className={ButtonsStyle}>
          <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
          <YesButton
            disabled={Boolean(isProcessing)}
            isLoading={Boolean(isProcessing)}
            onClick={onConfirm}
          />
        </div>
      </div>
    </Dialog>
  );
}
