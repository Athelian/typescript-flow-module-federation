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
  ORDER_DOCUMENT_EDIT,
  ORDER_DOCUMENT_DOWNLOAD,
  ORDER_DOCUMENT_DELETE,
  ORDER_DOCUMENT_FORM,
} from 'modules/permission/constants/order';
import {
  SHIPMENT_EDIT,
  SHIPMENT_DOCUMENT_EDIT,
  SHIPMENT_DOCUMENT_DOWNLOAD,
  SHIPMENT_DOCUMENT_DELETE,
  SHIPMENT_DOCUMENT_FORM,
} from 'modules/permission/constants/shipment';
import {
  MILESTONE_UPDATE,
  MILESTONE_DOCUMENT_EDIT,
  MILESTONE_DOCUMENT_DOWNLOAD,
  MILESTONE_DOCUMENT_DELETE,
  MILESTONE_DOCUMENT_FORM,
} from 'modules/permission/constants/milestone';
import { PARENTLESS_DOCUMENT_UPLOAD } from 'modules/permission/constants/file';
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

  let canUpload = true;
  let canDelete = true;
  let canAddOrphan = true;
  let canChangeType = true;
  let canDownload = true;
  let canViewForm = false;

  switch (type) {
    case 'Order': {
      canAddOrphan = hasPermission([ORDER_DOCUMENT_EDIT, ORDER_UPDATE]);
      canChangeType = hasPermission([ORDER_DOCUMENT_EDIT, ORDER_UPDATE]);
      canUpload = hasPermission(PARENTLESS_DOCUMENT_UPLOAD) && canChangeType;
      canViewForm = hasPermission(ORDER_DOCUMENT_FORM);
      canDownload = hasPermission(ORDER_DOCUMENT_DOWNLOAD);
      canDelete = hasPermission(ORDER_DOCUMENT_DELETE);
      break;
    }

    case 'Shipment': {
      canAddOrphan = hasPermission([SHIPMENT_DOCUMENT_EDIT, SHIPMENT_EDIT]);
      canChangeType = hasPermission([SHIPMENT_DOCUMENT_EDIT, SHIPMENT_EDIT]);
      canUpload = hasPermission(PARENTLESS_DOCUMENT_UPLOAD) && canChangeType;
      canViewForm = hasPermission(SHIPMENT_DOCUMENT_FORM);
      canDownload = hasPermission(SHIPMENT_DOCUMENT_DOWNLOAD);
      canDelete = hasPermission(SHIPMENT_DOCUMENT_DELETE);
      break;
    }
    case 'Milestone': {
      canAddOrphan = hasPermission([MILESTONE_DOCUMENT_EDIT, MILESTONE_UPDATE]);
      canChangeType = hasPermission([MILESTONE_DOCUMENT_EDIT, MILESTONE_UPDATE]);
      canUpload = hasPermission(PARENTLESS_DOCUMENT_UPLOAD) && canChangeType;
      canViewForm = hasPermission(MILESTONE_DOCUMENT_FORM);
      canDownload = hasPermission(MILESTONE_DOCUMENT_DOWNLOAD);
      canDelete = hasPermission(MILESTONE_DOCUMENT_DELETE);
      break;
    }
    default:
      break;
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
