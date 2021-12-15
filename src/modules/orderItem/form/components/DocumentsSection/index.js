// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { DocumentsUpload, SectionWrapper } from 'components/Form';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { OrderItemFilesContainer } from 'modules/orderItem/form/containers';
import {
  ORDER_ITEMS_UPDATE,
  ORDER_ITEMS_DOCUMENT_EDIT,
  ORDER_ITEMS_DOCUMENT_DOWNLOAD,
  ORDER_ITEMS_DOCUMENT_DELETE,
  ORDER_ITEMS_DOCUMENT_FORM,
} from 'modules/permission/constants/orderItem';
import { PARENTLESS_DOCUMENT_UPLOAD } from 'modules/permission/constants/file';

function ItemDocumentsSection() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const canAddOrphan = hasPermission([ORDER_ITEMS_DOCUMENT_EDIT, ORDER_ITEMS_UPDATE]);
  const canChangeType = hasPermission([ORDER_ITEMS_DOCUMENT_EDIT, ORDER_ITEMS_UPDATE]);
  const canUpload = hasPermission(PARENTLESS_DOCUMENT_UPLOAD) && canChangeType;
  const canViewForm = hasPermission(ORDER_ITEMS_DOCUMENT_FORM);
  const canDownload = hasPermission(ORDER_ITEMS_DOCUMENT_DOWNLOAD);
  const canDelete = hasPermission(ORDER_ITEMS_DOCUMENT_DELETE);

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
