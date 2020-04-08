// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useQuery } from '@apollo/react-hooks';
import { FocusedView } from 'modules/relationMapV2/store';
import { ORDER, SHIPMENT } from 'modules/relationMapV2/constants';
import { YesButton } from 'components/Buttons';
import ActionDialog from 'components/Dialog/ActionDialog';
import SlideView from 'components/SlideView';
import StaffSelector from 'components/Followers/StaffSelector';
import { ordersByIDsQuery, shipmentsByIDsQuery } from './query';

type Props = {|
  onSuccess: (ids: Array<string>) => void,
|};

export default function AddFollowers({ onSuccess }: Props) {
  const [isShowDialog, setIsShowDialog] = React.useState(true);
  const [sharedFollowers, setSharedFollowers] = React.useState([]);
  const [sharedPartnerIds, setSharedPartnerIds] = React.useState([]);
  const [excludedPartnerNames, setExcludedPartnerNames] = React.useState([]);
  const { dispatch, state } = FocusedView.useContainer();
  const { isProcessing, isOpen, source, ids } = state.followers;
  const entitiesQuery = source === ORDER ? ordersByIDsQuery : shipmentsByIDsQuery;

  const { data: entities, loading } = useQuery(entitiesQuery, {
    onCompleted: () => {
      const partnerNameMap = new Map();
      let newFlatFollowers = [];
      let newSharedPartnerIds = [];
      let newExcludedPartnerIds = [];
      const dataKey = source === ORDER ? 'ordersByIDs' : 'shipmentsByIDs';
      if (entities) {
        entities[dataKey].forEach(entity => {
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
            flatPartnerIds.concat(forwarders.map(forwader => forwader.id));
            forwarders.forEach(forwarder => {
              partnerNameMap.set(forwarder.id, forwarder.name);
            });
          }

          if (!newSharedPartnerIds.length) {
            newSharedPartnerIds = flatPartnerIds;
          }

          newFlatFollowers = newFlatFollowers.concat(entity.followers);
          newExcludedPartnerIds = [
            ...newExcludedPartnerIds,
            ...newSharedPartnerIds.filter(id => !flatPartnerIds.includes(id)),
            ...flatPartnerIds.filter(id => !newSharedPartnerIds.includes(id)),
          ];
          newSharedPartnerIds = [...newSharedPartnerIds.filter(id => flatPartnerIds.includes(id))];
        });
        setIsShowDialog(!!newExcludedPartnerIds.length);
        setSharedPartnerIds(newSharedPartnerIds);
        setSharedFollowers([
          ...new Set(
            newFlatFollowers.filter(follower =>
              newSharedPartnerIds.includes(follower.organization.id)
            )
          ),
        ]);
        setExcludedPartnerNames(newExcludedPartnerIds.map(id => partnerNameMap.get(id)));
      }
    },
    variables: {
      ids,
    },
  });

  const onCancel = () => {
    dispatch({
      type: 'FOLLOWERS_CLOSE',
      payload: {},
    });
    setIsShowDialog(true);
  };

  const onStart = () => {
    onSuccess(ids);
    setIsShowDialog(false);
  };

  const dialogMessage = loading
    ? 'loading...'
    : `excluede partners: ${excludedPartnerNames.toString()}`;
  if (isShowDialog || loading) {
    return (
      <ActionDialog
        isOpen={isOpen && isShowDialog}
        isProcessing={isProcessing || loading}
        onCancel={onCancel}
        title={
          <FormattedMessage
            id="modules.RelationMap.label.activateArchive"
            defaultMessage="ACTIVATE/ARCHIVE"
          />
        }
        dialogMessage={dialogMessage}
        dialogSubMessage="Followers dialogSubMessage"
        buttons={
          <>
            <YesButton disabled={!entities && !loading} onClick={onStart} />
          </>
        }
      />
    );
  }

  return (
    <SlideView
      isOpen={isOpen}
      onRequestClose={onCancel}
      shouldConfirm={() => {
        return !!document.querySelector('#resetBtn');
      }}
    >
      <StaffSelector
        selected={sharedFollowers}
        onSelect={() => {
          console.log('onSelect');
        }}
        onCancel={() => {
          console.log('onCancel');
        }}
        organizationIds={sharedPartnerIds}
      />
    </SlideView>
  );
}
