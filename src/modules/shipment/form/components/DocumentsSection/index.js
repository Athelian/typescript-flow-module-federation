// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_SET_DOCUMENTS,
  SHIPMENT_DOWNLOAD_DOCUMENTS,
  SHIPMENT_DOCUMENT_DELETE,
  SHIPMENT_DOCUMENT_CREATE,
  SHIPMENT_DOCUMENT_SET_TYPE,
} from 'modules/permission/constants/shipment';
import {
  DOCUMENT_CREATE,
  DOCUMENT_DELETE,
  DOCUMENT_SET_TYPE,
  DOCUMENT_UPDATE,
  DOCUMENT_FORM,
} from 'modules/permission/constants/file';
import QueryPlaceHolder from 'components/PlaceHolder/QueryPlaceHolder';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
import { DocumentsUpload } from 'components/Form';
import { ShipmentFilesContainer } from 'modules/shipment/form/containers';
import { shipmentFormFilesQuery } from './query';

type Props = {|
  entityId: string,
  isLoading: boolean,
|};

function DocumentsSection({ entityId, isLoading }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const canUpload = hasPermission([
    SHIPMENT_SET_DOCUMENTS,
    SHIPMENT_DOCUMENT_CREATE,
    DOCUMENT_CREATE,
  ]);
  const canAddOrphan = hasPermission([SHIPMENT_SET_DOCUMENTS, SHIPMENT_UPDATE]);
  const canViewForm = hasPermission(DOCUMENT_FORM);
  const canDownload = hasPermission(SHIPMENT_DOWNLOAD_DOCUMENTS);
  const canChangeType = hasPermission([
    SHIPMENT_SET_DOCUMENTS,
    DOCUMENT_SET_TYPE,
    SHIPMENT_DOCUMENT_SET_TYPE,
    DOCUMENT_UPDATE,
  ]);
  const canDelete = hasPermission([
    SHIPMENT_SET_DOCUMENTS,
    SHIPMENT_DOCUMENT_DELETE,
    DOCUMENT_DELETE,
  ]);

  return (
    <Subscribe to={[ShipmentFilesContainer]}>
      {({ state: { files }, initDetailValues, setFieldValue }) => (
        <QueryPlaceHolder
          PlaceHolder={() => <ListCardPlaceHolder height={540} />}
          query={shipmentFormFilesQuery}
          entityId={entityId}
          isLoading={isLoading}
          onCompleted={result => {
            initDetailValues(result?.shipment?.files ?? [], true);
          }}
        >
          {() => {
            return (
              <DocumentsUpload
                files={files}
                entity="Shipment"
                onSave={updateFiles => setFieldValue('files', updateFiles)}
                canUpload={canUpload}
                canAddOrphan={canAddOrphan}
                canViewForm={canViewForm}
                canDownload={canDownload}
                canChangeType={canChangeType}
                canDelete={canDelete}
              />
            );
          }}
        </QueryPlaceHolder>
      )}
    </Subscribe>
  );
}

export default DocumentsSection;
