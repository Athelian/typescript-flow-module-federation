// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { getByPathWithDefault } from 'utils/fp';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_SET_DOCUMENTS,
  SHIPMENT_DOWNLOAD_DOCUMENTS,
  SHIPMENT_DOCUMENT_DELETE,
  SHIPMENT_DOCUMENT_CREATE,
  SHIPMENT_DOCUMENT_SET_MEMO,
  SHIPMENT_DOCUMENT_SET_TAGS,
  SHIPMENT_DOCUMENT_SET_TYPE,
} from 'modules/permission/constants/shipment';
import {
  DOCUMENT_CREATE,
  DOCUMENT_DELETE,
  DOCUMENT_SET_MEMO,
  DOCUMENT_SET_TAGS,
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
  const canSetDocuments = hasPermission(SHIPMENT_SET_DOCUMENTS);

  return (
    <Subscribe to={[ShipmentFilesContainer]}>
      {({ state: { files }, initDetailValues, setFieldValue }) => (
        <QueryPlaceHolder
          PlaceHolder={() => <ListCardPlaceHolder height={540} />}
          query={shipmentFormFilesQuery}
          entityId={entityId}
          isLoading={isLoading}
          onCompleted={result => {
            initDetailValues(getByPathWithDefault([], 'shipment.files', result), true);
          }}
        >
          {() => {
            return (
              <DocumentsUpload
                entity="Shipment"
                uploadable={
                  canSetDocuments || hasPermission([SHIPMENT_DOCUMENT_CREATE, DOCUMENT_CREATE])
                }
                removable={
                  canSetDocuments || hasPermission([SHIPMENT_DOCUMENT_DELETE, DOCUMENT_DELETE])
                }
                addable={canSetDocuments || hasPermission([SHIPMENT_UPDATE])}
                editable={{
                  status:
                    canSetDocuments ||
                    hasPermission([
                      DOCUMENT_SET_STATUS,
                      SHIPMENT_DOCUMENT_SET_STATUS,
                      DOCUMENT_UPDATE,
                    ]),
                  type:
                    canSetDocuments ||
                    hasPermission([DOCUMENT_SET_TYPE, SHIPMENT_DOCUMENT_SET_TYPE, DOCUMENT_UPDATE]),
                  memo:
                    canSetDocuments ||
                    hasPermission([DOCUMENT_SET_MEMO, SHIPMENT_DOCUMENT_SET_MEMO, DOCUMENT_UPDATE]),
                }}
                downloadable={hasPermission(SHIPMENT_DOWNLOAD_DOCUMENTS)}
                viewForm={hasPermission(DOCUMENT_FORM)}
                files={files}
                onSave={updateFiles => setFieldValue('files', updateFiles)}
              />
            );
          }}
        </QueryPlaceHolder>
      )}
    </Subscribe>
  );
}

export default DocumentsSection;
