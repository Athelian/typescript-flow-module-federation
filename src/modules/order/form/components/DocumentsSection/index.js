// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { OrderFilesContainer } from 'modules/order/form/containers';
import QueryPlaceHolder from 'components/PlaceHolder/QueryPlaceHolder';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
import {
  ORDER_UPDATE,
  ORDER_SET_DOCUMENTS,
  ORDER_DOWNLOAD_DOCUMENTS,
  ORDER_DOCUMENT_DELETE,
  ORDER_DOCUMENT_CREATE,
  ORDER_DOCUMENT_SET_TYPE,
} from 'modules/permission/constants/order';
import {
  DOCUMENT_CREATE,
  DOCUMENT_DELETE,
  DOCUMENT_SET_TYPE,
  DOCUMENT_UPDATE,
  DOCUMENT_FORM,
} from 'modules/permission/constants/file';
import { DocumentsUpload } from 'components/Form';
import { orderFormFilesQuery } from './query';

type Props = {
  isLoading: boolean,
  entityId: string,
};

function DocumentsSection({ isLoading, entityId }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const canUpload = hasPermission([ORDER_SET_DOCUMENTS, ORDER_DOCUMENT_CREATE, DOCUMENT_CREATE]);
  const canAddOrphan = hasPermission([ORDER_SET_DOCUMENTS, ORDER_UPDATE]);
  const canViewForm = hasPermission(DOCUMENT_FORM);
  const canDownload = hasPermission(ORDER_DOWNLOAD_DOCUMENTS);
  const canChangeType = hasPermission([
    ORDER_SET_DOCUMENTS,
    DOCUMENT_SET_TYPE,
    ORDER_DOCUMENT_SET_TYPE,
    DOCUMENT_UPDATE,
  ]);
  const canDelete = hasPermission([ORDER_SET_DOCUMENTS, ORDER_DOCUMENT_DELETE, DOCUMENT_DELETE]);

  return (
    <Subscribe to={[OrderFilesContainer]}>
      {({ state: { files }, initDetailValues, setFieldValue }) => (
        <QueryPlaceHolder
          PlaceHolder={() => <ListCardPlaceHolder height={540} />}
          query={orderFormFilesQuery}
          entityId={entityId}
          isLoading={isLoading}
          onCompleted={result => {
            initDetailValues(result?.order?.files ?? []);
          }}
        >
          {() => {
            return (
              <DocumentsUpload
                files={files}
                entity="Order"
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
