// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import { targetedIds, findShipmentIdsByOrder } from 'modules/relationMapV2/helpers';
import { ORDER } from 'modules/relationMapV2/constants';
import { YesButton } from 'components/Buttons';
import ActionDialog from 'components/Dialog/ActionDialog';
import { updateOrdersMutation } from './mutation';

type Props = {|
  onSuccess: (ids: Array<string>) => void,
|};

export default function FollowersConfirm({ onSuccess }: Props) {
  const [updateOrders] = useMutation(updateOrdersMutation);
  const { dispatch, state, selectors } = FocusedView.useContainer();
  const { mapping } = Entities.useContainer();
  const { isProcessing, isOpen, source } = state.followers;
  const orderIds = targetedIds(state.targets, ORDER);

  const onCancel = () => {
    dispatch({
      type: 'FOLLOWERS_CLOSE',
      payload: {},
    });
  };

  const onConfirm = archived => {
    dispatch({
      type: 'FOLLOWERS_START',
      payload: {},
    });
    updateOrders({
      variables: {
        orders: orderIds.map(id => ({
          id,
          input: {
            archived,
          },
        })),
      },
    })
      .then(result => {
        if (selectors.isShipmentFocus) {
          const ids = [];
          (result.data?.orderUpdateMany ?? []).forEach(order => {
            ids.push(...findShipmentIdsByOrder(order.id, mapping.entities));
          });
          onSuccess(ids);
        } else {
          onSuccess(orderIds);
        }
      })
      .catch(() => {
        dispatch({
          type: 'STATUS_CLOSE',
          payload: {},
        });
      });
  };

  console.log('source');
  console.dir(source);

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={isProcessing}
      onCancel={onCancel}
      title={
        <FormattedMessage
          id="modules.RelationMap.label.activateArchive"
          defaultMessage="ACTIVATE/ARCHIVE"
        />
      }
      dialogMessage="Followers dialogMessage"
      dialogSubMessage="Followers dialogSubMessage"
      buttons={
        <>
          <YesButton onClick={() => onConfirm(false)} />
        </>
      }
    />
  );
}
