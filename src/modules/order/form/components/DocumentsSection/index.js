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
  ORDER_DOCUMENT_FORM,
} from 'modules/permission/constants/order';
import {
  SHIPMENT_EDIT,
  SHIPMENT_DOCUMENT_SET,
  SHIPMENT_DOCUMENT_DOWNLOAD,
  SHIPMENT_DOCUMENT_DELETE,
  SHIPMENT_DOCUMENT_CREATE,
  SHIPMENT_DOCUMENT_SET_TYPE,
  SHIPMENT_DOCUMENT_FORM,
} from 'modules/permission/constants/shipment';
import {
  MILESTONE_UPDATE,
  MILESTONE_SET_DOCUMENTS,
  MILESTONE_DOWNLOAD_DOCUMENTS,
  MILESTONE_DOCUMENT_DELETE,
  MILESTONE_DOCUMENT_CREATE,
  MILESTONE_DOCUMENT_SET_TYPE,
  MILESTONE_DOCUMENT_FORM,
} from 'modules/permission/constants/milestone';
import {
  DOCUMENT_CREATE,
  DOCUMENT_DELETE,
  DOCUMENT_SET_TYPE,
  DOCUMENT_UPDATE,
} from 'modules/permission/constants/file';
import { DocumentsUpload } from 'components/Form';
import { orderFormFilesQuery } from './query';

type Props = {
  isLoading: boolean,
  entityId: string,
  type: string,
};

function DocumentsSection({ isLoading, entityId, type }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  let canDelete = true;
  let canUpload = true;
  let canAddOrphan = true;
  let canChangeType = true;
  let canDownload = true;
  let canViewForm = false;

  switch (type) {
    case 'Order': {
      canUpload = hasPermission([ORDER_SET_DOCUMENTS, ORDER_DOCUMENT_CREATE, DOCUMENT_CREATE]);
      canAddOrphan = hasPermission([ORDER_SET_DOCUMENTS, ORDER_UPDATE]);
      canViewForm = hasPermission(ORDER_DOCUMENT_FORM);
      canDownload = hasPermission(ORDER_DOWNLOAD_DOCUMENTS);
      canChangeType = hasPermission([
        ORDER_SET_DOCUMENTS,
        DOCUMENT_SET_TYPE,
        ORDER_DOCUMENT_SET_TYPE,
        DOCUMENT_UPDATE,
      ]);
      canDelete = hasPermission([ORDER_SET_DOCUMENTS, ORDER_DOCUMENT_DELETE, DOCUMENT_DELETE]);
      break;
    }

    case 'Shipment': {
      canUpload = hasPermission([SHIPMENT_DOCUMENT_SET, SHIPMENT_DOCUMENT_CREATE, DOCUMENT_CREATE]);
      canAddOrphan = hasPermission([SHIPMENT_DOCUMENT_SET, SHIPMENT_EDIT]);
      canViewForm = hasPermission(SHIPMENT_DOCUMENT_FORM);
      canDownload = hasPermission(SHIPMENT_DOCUMENT_DOWNLOAD);
      canChangeType = hasPermission([
        SHIPMENT_DOCUMENT_SET,
        DOCUMENT_SET_TYPE,
        SHIPMENT_DOCUMENT_SET_TYPE,
        DOCUMENT_UPDATE,
      ]);
      canDelete = hasPermission([SHIPMENT_DOCUMENT_SET, SHIPMENT_DOCUMENT_DELETE, DOCUMENT_DELETE]);
      break;
    }
    case 'Milestone': {
      canUpload = hasPermission([
        MILESTONE_SET_DOCUMENTS,
        MILESTONE_DOCUMENT_CREATE,
        DOCUMENT_CREATE,
      ]);
      canAddOrphan = hasPermission([MILESTONE_SET_DOCUMENTS, MILESTONE_UPDATE]);
      canViewForm = hasPermission(MILESTONE_DOCUMENT_FORM);
      canDownload = hasPermission(MILESTONE_DOWNLOAD_DOCUMENTS);
      canChangeType = hasPermission([
        MILESTONE_SET_DOCUMENTS,
        DOCUMENT_SET_TYPE,
        MILESTONE_DOCUMENT_SET_TYPE,
        DOCUMENT_UPDATE,
      ]);
      canDelete = hasPermission([
        MILESTONE_SET_DOCUMENTS,
        MILESTONE_DOCUMENT_DELETE,
        DOCUMENT_DELETE,
      ]);
      break;
    }

    default: {
      canDelete = true;
      canUpload = true;
      canAddOrphan = true;
      canChangeType = true;
      canDownload = true;
      canViewForm = false;
    }
  }

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
