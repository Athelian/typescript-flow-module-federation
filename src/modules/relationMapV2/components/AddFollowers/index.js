// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { FocusedView } from 'modules/relationMapV2/store';
import { ORDER, SHIPMENT } from 'modules/relationMapV2/constants';
import { BaseButton } from 'components/Buttons';
import ActionDialog, { OrderLabelIcon, ShipmentLabelIcon } from 'components/Dialog/ActionDialog';
import SlideView from 'components/SlideView';
import StaffSelector from 'components/Followers/StaffSelector';
import { ordersByIDsQuery, shipmentsByIDsQuery } from './query';
import { updateOrdersMutation, updateShipmentMutation } from './mutation';
import { ExcludedPartnerListStyle } from './style';

type Props = {|
  onSuccess?: (ids: Array<string>) => void,
|};

export default function AddFollowers({ onSuccess }: Props) {
  const [isShowDialog, setIsShowDialog] = React.useState(true);
  const [sharedPartnerIds, setSharedPartnerIds] = React.useState([]);
  const [excludedPartnerNames, setExcludedPartnerNames] = React.useState([]);
  const { dispatch, state } = FocusedView.useContainer();
  const { isProcessing, isOpen, source, ids } = state.followers;

  const entitiesQuery = source === ORDER ? ordersByIDsQuery : shipmentsByIDsQuery;
  const { data, loading } = useQuery(entitiesQuery, {
    onCompleted: () => {
      const partnerNameMap = new Map();
      let newSharedFollowers = [];
      let newSharedPartnerIds = [];
      let newExcludedPartnerIds = [];
      const dataEntityTypeKey = source === ORDER ? 'ordersByIDs' : 'shipmentsByIDs';
      if (data) {
        data[dataEntityTypeKey].forEach(entity => {
          const flatPartnerIds = [];
          if (entity?.exporter?.id && !flatPartnerIds.includes(entity.exporter.id)) {
            flatPartnerIds.push(entity.exporter.id);
            partnerNameMap.set(entity.exporter.id, entity.exporter.name);
          }

          if (entity?.importer?.id && !flatPartnerIds.includes(entity.importer.id)) {
            flatPartnerIds.push(entity.importer.id);
            partnerNameMap.set(entity.importer.id, entity.importer.name);
          }

          if (source === SHIPMENT && entity?.forwarders?.length) {
            const forwarders = entity.forwarders.filter(
              forwarder => !flatPartnerIds.includes(forwarder.id)
            );
            forwarders.forEach(forwarder => {
              flatPartnerIds.push(forwarder.id);
              partnerNameMap.set(forwarder.id, forwarder.name);
            });
          }

          if (!newSharedPartnerIds.length) {
            newSharedPartnerIds = flatPartnerIds;
          }

          if (!newSharedFollowers.length) {
            newSharedFollowers = entity.followers;
          }

          newExcludedPartnerIds = [
            ...newExcludedPartnerIds,
            ...newSharedPartnerIds.filter(id => !flatPartnerIds.includes(id)),
            ...flatPartnerIds.filter(id => !newSharedPartnerIds.includes(id)),
          ];
          newSharedPartnerIds = [...newSharedPartnerIds.filter(id => flatPartnerIds.includes(id))];
          // newSharedFollowers = newSharedFollowers.concat(entity.followers);
          newSharedFollowers = [
            ...newSharedFollowers.filter(
              sharedFollower =>
                entity.followers.filter(follower => follower.id === sharedFollower.id).length > 0
            ),
          ];
        });
        setIsShowDialog(!!newExcludedPartnerIds.length);
        setSharedPartnerIds(newSharedPartnerIds);
        setExcludedPartnerNames([
          ...new Set(newExcludedPartnerIds.map(id => partnerNameMap.get(id))),
        ]);
      }
    },
    variables: {
      ids,
    },
  });

  const onClose = () => {
    dispatch({
      type: 'FOLLOWERS_CLOSE',
      payload: {},
    });
    setIsShowDialog(!!excludedPartnerNames.length);
  };

  const onStart = () => {
    setIsShowDialog(false);
  };

  const entitiesMutation = source === ORDER ? updateOrdersMutation : updateShipmentMutation;
  const [updateEntities] = useMutation(entitiesMutation, {
    onCompleted: () => {
      if (onSuccess) {
        onSuccess(ids);
      }
      onClose();
    },
  });

  const onSetFollowers = newFollowers => {
    if (data) {
      dispatch({
        type: 'FOLLOWERS_START',
        payload: {},
      });
      const dataEntityTypeKey = source === ORDER ? 'ordersByIDs' : 'shipmentsByIDs';
      const payloadEntityTypeKey: string = source === ORDER ? 'orders' : 'shipments';
      updateEntities({
        variables: {
          [payloadEntityTypeKey]: data[dataEntityTypeKey].map(entity => ({
            id: entity.id,
            input: {
              followerIds: entity.followers
                .map(follower => follower.id)
                .concat(
                  newFollowers.reduce((result, newFollower) => {
                    if (
                      !entity.followers.filter(follower => follower.id === newFollower.id).length
                    ) {
                      result.push(newFollower.id);
                    }
                    return result;
                  }, [])
                ),
            },
          })),
        },
      });
    }
  };

  if (isShowDialog || loading) {
    return (
      <ActionDialog
        isOpen={isOpen && isShowDialog}
        isProcessing={loading}
        onCancel={onClose}
        title={
          <FormattedMessage
            id="modules.RelationMap.addFollowers.title"
            defaultMessage="Add Followers"
          />
        }
        dialogMessage={
          !loading &&
          excludedPartnerNames.length && (
            <>
              <FormattedMessage
                id="modules.RelationMap.addFollowers.message"
                defaultMessage="Note: The staff of the following partners will not be available for selection because they are not present in every {entityLabel} that you have selected."
                values={{
                  entityLabel: source === ORDER ? <OrderLabelIcon /> : <ShipmentLabelIcon />,
                }}
              />
              <br />
              <ul className={ExcludedPartnerListStyle}>
                {excludedPartnerNames.map(name => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </>
          )
        }
        dialogSubMessage={
          !loading && (
            <FormattedMessage
              id="modules.RelationMap.addFollowers.subMessage"
              defaultMessage="Continue to select followers to add?"
            />
          )
        }
        buttons={
          <>
            <BaseButton
              disabled={!data && !loading}
              icon="ARROW_RIGHT"
              label={
                <FormattedMessage
                  id="modules.RelationMap.addFollowers.continue"
                  defaultMessage="Continue"
                />
              }
              onClick={onStart}
            />
          </>
        }
      />
    );
  }

  return (
    <SlideView
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldConfirm={() => {
        return !!document.querySelector('#resetBtn');
      }}
    >
      <StaffSelector
        selected={[]}
        onSelect={onSetFollowers}
        onCancel={onClose}
        isProcessing={isProcessing}
        organizationIds={sharedPartnerIds}
      />
    </SlideView>
  );
}
