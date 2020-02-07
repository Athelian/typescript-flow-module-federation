// @flow
import * as React from 'react';
import type { PartnerPayload } from 'generated/graphql';
import { useLazyQuery } from '@apollo/react-hooks';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import { shipmentFormTimelineAndCargoQuery } from 'modules/shipment/form/components/TimelineAndCargoSections/query';

type Props = {|
  isNew: boolean,
  shipmentId: string,
  containersContainer: Object,
  batchesContainer: Object,
|};

type ChangeData = {|
  action: 'CHANGE_EXPORTER' | 'CHANGE_IMPORTER' | 'CHANGE_FORWARDERS',
  payload: {
    importer?: PartnerPayload,
    exporter?: PartnerPayload,
    selectedExporter?: PartnerPayload,
    forwarders?: Array<PartnerPayload>,
    selectedForwarders?: Array<PartnerPayload>,
  },
|};

export default function CleanUpShipment({
  isNew,
  shipmentId,
  containersContainer,
  batchesContainer,
}: Props) {
  const [queryShipmentDetail, { data, called, loading }] = useLazyQuery(
    shipmentFormTimelineAndCargoQuery
  );

  const changeDataRef = React.useRef<ChangeData | null>(null);

  React.useEffect(() => {
    if (called && !loading) {
      const containers = data?.shipment?.containers ?? [];
      const batches = data?.shipment?.batches ?? [];
      if (!containersContainer.state.hasCalledContainerApiYet) {
        containersContainer.initDetailValues(containers, true);
      }

      if (!batchesContainer.state.hasCalledBatchesApiYet) {
        batchesContainer.initDetailValues(batches, true);
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
        case 'CHANGE_FORWARDERS':
          containersContainer.onChangeForwarders(payload.forwarders, payload.selectedForwarders);
          break;

        default:
          logger.warn('not support yet', action);
          break;
      }
    }
  }, [batchesContainer, called, containersContainer, data, loading]);

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
            batchesContainer.changeMainExporter(payload.exporter, payload.selectedExporter);
            containersContainer.onChangeExporter(payload.exporter, payload.selectedExporter);
            break;
          case 'CHANGE_IMPORTER':
            batchesContainer.onChangeImporter(payload.importer);
            containersContainer.onChangeImporter(payload.importer);
            break;
          case 'CHANGE_FORWARDERS':
            batchesContainer.onChangeForwarders(payload.forwarders, payload.selectedForwarders);
            containersContainer.onChangeForwarders(payload.forwarders, payload.selectedForwarders);
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
  }, [batchesContainer, containersContainer, isNew, queryShipmentDetail, shipmentId]);
  return null;
}
