// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { DocumentsUpload, SectionWrapper } from 'components/Form';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
  ORDER_ITEMS_UPDATE,
  ORDER_ITEMS_SET_DOCUMENTS,
  ORDER_ITEMS_DOWNLOAD_DOCUMENTS,
  ORDER_ITEMS_DOCUMENT_DELETE,
  ORDER_ITEMS_DOCUMENT_CREATE,
  ORDER_ITEMS_DOCUMENT_SET_TYPE,
} from 'modules/permission/constants/orderItem';
import {
  DOCUMENT_CREATE,
  DOCUMENT_DELETE,
  DOCUMENT_SET_TYPE,
  DOCUMENT_UPDATE,
  DOCUMENT_FORM,
} from 'modules/permission/constants/file';
import { OrderItemFilesContainer } from 'modules/orderItem/form/containers';

function ItemDocumentsSection() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
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

  return (
    <Subscribe to={[OrderItemFilesContainer]}>
      {({ state: { files = [] }, setFieldValue }) => {
        return (
          <SectionWrapper id="orderItem_documentsSection">
            <DocumentsUpload
              files={files}
              entity="OrderItem"
              onSave={updateFiles => setFieldValue('files', updateFiles)}
              canUpload={canUpload}
              canAddOrphan={canAddOrphan}
              canViewForm={canViewForm}
              canDownload={canDownload}
              canChangeType={canChangeType}
              canDelete={canDelete}
            />
          </SectionWrapper>
        );
      }}
    </Subscribe>
  );
}

export default ItemDocumentsSection;
