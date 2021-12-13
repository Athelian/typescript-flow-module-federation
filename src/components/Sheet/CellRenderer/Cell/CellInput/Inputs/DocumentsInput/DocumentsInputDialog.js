// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import type { FilePayload } from 'generated/graphql';
import { useViewerHasPermissions } from 'contexts/Permissions';
import { isForbidden } from 'utils/data';
import Dialog from 'components/Dialog';
import { FormContainer } from 'modules/form';
import { DocumentsUpload as DocumentsSection } from 'components/Form';
import {
  ORDER_UPDATE,
  ORDER_DOCUMENT_DOWNLOAD,
  ORDER_DOCUMENT_DELETE,
  ORDER_DOCUMENT_EDIT,
  ORDER_DOCUMENT_FORM,
} from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_UPDATE,
  ORDER_ITEMS_DOCUMENT_FORM,
  ORDER_ITEMS_DOCUMENT_EDIT,
  ORDER_ITEMS_DOCUMENT_DOWNLOAD,
  ORDER_ITEMS_DOCUMENT_DELETE,
} from 'modules/permission/constants/orderItem';
import {
  SHIPMENT_EDIT,
  SHIPMENT_DOCUMENT_DOWNLOAD,
  SHIPMENT_DOCUMENT_DELETE,
  SHIPMENT_DOCUMENT_EDIT,
  SHIPMENT_DOCUMENT_FORM,
} from 'modules/permission/constants/shipment';
import { PARENTLESS_DOCUMENT_UPLOAD } from 'modules/permission/constants/file';
import { DocumentsDialogWrapperStyle } from './style';

const formContainer = new FormContainer();

type Props = {
  value: Array<FilePayload>,
  onChange: (Array<FilePayload>) => void,
  open: boolean,
  onClose: () => void,
  entityType: string,
};

function checkDocumentActions(type: string, hasPermission: Function) {
  const canUpload = hasPermission(PARENTLESS_DOCUMENT_UPLOAD);
  let canDelete = true;
  let canAddOrphan = true;
  let canChangeType = true;
  let canDownload = true;
  let canViewForm = false;

  switch (type) {
    case 'Order': {
      canAddOrphan = hasPermission([ORDER_DOCUMENT_EDIT, ORDER_UPDATE]);
      canChangeType = hasPermission([ORDER_DOCUMENT_EDIT, ORDER_UPDATE]);
      canViewForm = hasPermission(ORDER_DOCUMENT_FORM);
      canDownload = hasPermission(ORDER_DOCUMENT_DOWNLOAD);
      canDelete = hasPermission(ORDER_DOCUMENT_DELETE);
      break;
    }

    case 'OrderItem': {
      canAddOrphan = hasPermission([ORDER_ITEMS_DOCUMENT_EDIT, ORDER_ITEMS_UPDATE]);
      canChangeType = hasPermission([ORDER_ITEMS_DOCUMENT_EDIT, ORDER_ITEMS_UPDATE]);
      canViewForm = hasPermission(ORDER_ITEMS_DOCUMENT_FORM);
      canDownload = hasPermission(ORDER_ITEMS_DOCUMENT_DOWNLOAD);
      canDelete = hasPermission(ORDER_ITEMS_DOCUMENT_DELETE);
      break;
    }

    case 'Shipment': {
      canAddOrphan = hasPermission([SHIPMENT_DOCUMENT_EDIT, SHIPMENT_EDIT]);
      canChangeType = hasPermission([SHIPMENT_DOCUMENT_EDIT, SHIPMENT_EDIT]);
      canViewForm = hasPermission(SHIPMENT_DOCUMENT_FORM);
      canDownload = hasPermission(SHIPMENT_DOCUMENT_DOWNLOAD);
      canDelete = hasPermission(SHIPMENT_DOCUMENT_DELETE);
      break;
    }
    default:
      break;
  }
  return {
    canDelete,
    canUpload,
    canAddOrphan,
    canChangeType,
    canDownload,
    canViewForm,
  };
}

const DocumentsInputDialog = ({ value, onChange, onClose, open, entityType }: Props) => {
  const hasPermissions = useViewerHasPermissions();
  const allowActions = checkDocumentActions(entityType, hasPermissions);

  return (
    <Provider inject={[formContainer]}>
      <Dialog isOpen={open} onRequestClose={onClose}>
        <div className={DocumentsDialogWrapperStyle}>
          <DocumentsSection
            files={value.filter(file => !isForbidden(file))}
            entity={entityType}
            onSave={onChange}
            {...allowActions}
            isInDialog
          />
        </div>
      </Dialog>
    </Provider>
  );
};

export default DocumentsInputDialog;
