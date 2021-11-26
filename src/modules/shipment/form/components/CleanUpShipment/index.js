// @flow
import * as React from 'react';
import type { PartnerPayload } from 'generated/graphql';
import { useLazyQuery } from '@apollo/react-hooks';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import { shipmentFormTimelineAndCargoQuery } from 'modules/shipment/form/components/TimelineAndCargoSections/query';
import useUser from 'hooks/useUser';
import { getUpdatedTags } from './helpers';

type Props = {|
  isNew: boolean,
  shipmentId: string,
  containersContainer: Object,
  batchesContainer: Object,
  tagsContainer: Object,
  infoContainer: Object,
|};

type ChangeData = {|
  action: 'CHANGE_EXPORTER' | 'CHANGE_IMPORTER' | 'CHANGE_FORWARDERS' | 'CHANGE_SHARED_PARTNERS',
  payload: {
    importer?: PartnerPayload,
    exporter?: PartnerPayload,
    forwarders?: Array<PartnerPayload>,
    selectedImporter?: PartnerPayload,
    selectedExporter?: PartnerPayload,
    selectedForwarders?: Array<PartnerPayload>,
    selectedOrganizations?: Array<PartnerPayload>,
  },
|};

export default function CleanUpShipment({
  isNew,
  shipmentId,
  containersContainer,
  batchesContainer,
  infoContainer,
  tagsContainer,
}: Props) {
  const [queryShipmentDetail, { data, called, loading }] = useLazyQuery(
    shipmentFormTimelineAndCargoQuery
  );
  const { user } = useUser();

  const changeDataRef = React.useRef<ChangeData | null>(null);

  React.useEffect(() => {
    if (called && !loading) {
      const containers = data?.shipment?.containers ?? [];
      const batches = data?.shipment?.batches ?? [];
      if (!containersContainer.state.hasCalledContainerApiYet) {
        containersContainer.initDetailValues(containers, true, user.timezone);
      }

      if (!batchesContainer.state.hasCalledBatchesApiYet) {
        batchesContainer.initDetailValues(batches, true, user.timezone);
      }

      const { action, payload } = changeDataRef.current ?? { action: '', payload: {} };

      switch (action) {
        case 'CHANGE_EXPORTER':
          batchesContainer.changeMainExporter(payload.exporter, payload.selectedExporter);
          containersContainer.onChangeExporter(payload.exporter, payload.selectedExporter);
          break;
        case 'CHANGE_IMPORTER':
          batchesContainer.onChangeImporter(payload.importer);
          containersContainer.onChangeImporter(payload.importer);
          break;

        default:
          logger.warn('not support yet', action);
          break;
      }
    }
  }, [batchesContainer, called, containersContainer, data, loading, user]);

  React.useEffect(() => {
    emitter.addListener('CLEAN_SHIPMENTS', changeData => {
      const { action, payload }: ChangeData = (changeData: any);
      if (
        !isNew &&
        (!containersContainer.state.hasCalledContainerApiYet ||
          !batchesContainer.state.hasCalledBatchesApiYet)
      ) {
        changeDataRef.current = (changeData: any);
        queryShipmentDetail({
          variables: {
            id: shipmentId,
          },
        });
      } else {
        switch (action) {
          case 'CHANGE_EXPORTER':
            {
              batchesContainer.changeMainExporter(payload.exporter, payload.selectedExporter);
              containersContainer.onChangeExporter(payload.exporter, payload.selectedExporter);

              const updatedTags = getUpdatedTags({
                infoContainer,
                tagsContainer,
                newValue: payload.selectedExporter,
                field: 'exporter',
              });

              tagsContainer.setFieldValue('tags', updatedTags);
            }
            break;
          case 'CHANGE_IMPORTER':
            {
              batchesContainer.onChangeImporter(payload.importer);
              containersContainer.onChangeImporter(payload.importer);

              const updatedTags = getUpdatedTags({
                infoContainer,
                tagsContainer,
                newValue: payload.selectedImporter,
                field: 'importer',
              });

              tagsContainer.setFieldValue('tags', updatedTags);
            }
            break;
          case 'CHANGE_FORWARDERS':
            {
              const updatedTags = getUpdatedTags({
                infoContainer,
                tagsContainer,
                newValue: payload.selectedForwarders,
                field: 'forwarders',
              });

              tagsContainer.setFieldValue('tags', updatedTags);
            }
            break;
          case 'CHANGE_SHARED_PARTNERS':
            {
              const updatedTags = getUpdatedTags({
                infoContainer,
                tagsContainer,
                newValue: payload.selectedOrganizations,
                field: 'organizations',
              });

              tagsContainer.setFieldValue('tags', updatedTags);
            }
            break;

          default:
            logger.warn('not support yet', action);
            break;
        }
      }
    });
    return () => {
      emitter.removeAllListeners('CLEAN_SHIPMENTS');
    };
  }, [
    batchesContainer,
    containersContainer,
    infoContainer,
    tagsContainer,
    isNew,
    queryShipmentDetail,
    shipmentId,
  ]);
  return null;
}
