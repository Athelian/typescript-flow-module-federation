// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import {
  SHIPMENT_EDIT,
  SHIPMENT_DOCUMENT_EDIT,
  SHIPMENT_DOCUMENT_DOWNLOAD,
  SHIPMENT_DOCUMENT_DELETE,
  SHIPMENT_DOCUMENT_FORM,
} from 'modules/permission/constants/shipment';
import { PARENTLESS_DOCUMENT_UPLOAD } from 'modules/permission/constants/file';
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

  const canUpload = hasPermission(PARENTLESS_DOCUMENT_UPLOAD);
  const canAddOrphan = hasPermission([SHIPMENT_DOCUMENT_EDIT, SHIPMENT_EDIT]);
  const canChangeType = hasPermission([SHIPMENT_DOCUMENT_EDIT, SHIPMENT_EDIT]);
  const canViewForm = hasPermission(SHIPMENT_DOCUMENT_FORM);
  const canDownload = hasPermission(SHIPMENT_DOCUMENT_DOWNLOAD);
  const canDelete = hasPermission(SHIPMENT_DOCUMENT_DELETE);

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
