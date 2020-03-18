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
  ORDER_SET_DOCUMENTS,
  ORDER_DOWNLOAD_DOCUMENTS,
  ORDER_DOCUMENT_DELETE,
  ORDER_DOCUMENT_CREATE,
  ORDER_DOCUMENT_SET_TYPE,
} from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_UPDATE,
  ORDER_ITEMS_SET_DOCUMENTS,
  ORDER_ITEMS_DOWNLOAD_DOCUMENTS,
  ORDER_ITEMS_DOCUMENT_DELETE,
  ORDER_ITEMS_DOCUMENT_CREATE,
  ORDER_ITEMS_DOCUMENT_SET_TYPE,
} from 'modules/permission/constants/orderItem';
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
  switch (type) {
    case 'Order': {
      const canDelete = hasPermission([
        ORDER_SET_DOCUMENTS,
        ORDER_DOCUMENT_DELETE,
        DOCUMENT_DELETE,
      ]);
      const canUpload = hasPermission([
        ORDER_SET_DOCUMENTS,
        ORDER_DOCUMENT_CREATE,
        DOCUMENT_CREATE,
      ]);
      const canAddOrphan = hasPermission([ORDER_SET_DOCUMENTS, ORDER_UPDATE]);
      const canViewForm = hasPermission(DOCUMENT_FORM);
      const canDownload = hasPermission(ORDER_DOWNLOAD_DOCUMENTS);
      const canChangeType = hasPermission([
        ORDER_SET_DOCUMENTS,
        DOCUMENT_SET_TYPE,
        ORDER_DOCUMENT_SET_TYPE,
        DOCUMENT_UPDATE,
      ]);
      return {
        canDelete,
        canUpload,
        canAddOrphan,
        canChangeType,
        canDownload,
        canViewForm,
      };
    }

    case 'OrderItem': {
      const canUpload = hasPermission([
        ORDER_ITEMS_SET_DOCUMENTS,
        ORDER_ITEMS_DOCUMENT_CREATE,
        DOCUMENT_CREATE,
      ]);
      const canAddOrphan = hasPermission([ORDER_ITEMS_SET_DOCUMENTS, ORDER_ITEMS_UPDATE]);
      const canViewForm = hasPermission(DOCUMENT_FORM);
      const canDownload = hasPermission(ORDER_ITEMS_DOWNLOAD_DOCUMENTS);
      const canChangeType = hasPermission([
        ORDER_ITEMS_SET_DOCUMENTS,
        DOCUMENT_SET_TYPE,
        ORDER_ITEMS_DOCUMENT_SET_TYPE,
        DOCUMENT_UPDATE,
      ]);
      const canDelete = hasPermission([
        ORDER_ITEMS_SET_DOCUMENTS,
        ORDER_ITEMS_DOCUMENT_DELETE,
        DOCUMENT_DELETE,
      ]);

      return {
        canDelete,
        canUpload,
        canAddOrphan,
        canChangeType,
        canDownload,
        canViewForm,
      };
    }

    case 'Shipment': {
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
      return {
        canDelete,
        canUpload,
        canAddOrphan,
        canChangeType,
        canDownload,
        canViewForm,
      };
    }

    default: {
      const canDelete = true;
      const canUpload = true;
      const canAddOrphan = true;
      const canChangeType = true;
      const canDownload = true;
      const canViewForm = false;
      return {
        canDelete,
        canUpload,
        canAddOrphan,
        canChangeType,
        canDownload,
        canViewForm,
      };
    }
  }
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
