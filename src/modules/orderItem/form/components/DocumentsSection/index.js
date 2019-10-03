// @flow
import * as React from 'react';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
  ORDER_ITEMS_SET_DOCUMENTS,
  ORDER_ITEMS_DOWNLOAD_DOCUMENTS,
  ORDER_ITEMS_DOCUMENT_DELETE,
  ORDER_ITEMS_DOCUMENT_CREATE,
  ORDER_ITEMS_DOCUMENT_SET_MEMO,
  ORDER_ITEMS_DOCUMENT_SET_STATUS,
  ORDER_ITEMS_DOCUMENT_SET_TYPE,
} from 'modules/permission/constants/orderItem';
import {
  DOCUMENT_CREATE,
  DOCUMENT_DELETE,
  DOCUMENT_SET_MEMO,
  DOCUMENT_SET_STATUS,
  DOCUMENT_SET_TYPE,
  DOCUMENT_UPDATE,
} from 'modules/permission/constants/file';
import { OrderItemFilesContainer } from 'modules/orderItem/form/containers';
import DocumentsSection from 'sections/DocumentsSection';

function ItemDocumentsSection() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const canSetDocuments = hasPermission(ORDER_ITEMS_SET_DOCUMENTS);

  const canRemove =
    canSetDocuments || hasPermission([ORDER_ITEMS_DOCUMENT_DELETE, DOCUMENT_DELETE]);
  const canUpload =
    canSetDocuments || hasPermission([ORDER_ITEMS_DOCUMENT_CREATE, DOCUMENT_CREATE]);
  const canUpdateStatus =
    canSetDocuments ||
    hasPermission([DOCUMENT_SET_STATUS, ORDER_ITEMS_DOCUMENT_SET_STATUS, DOCUMENT_UPDATE]);

  const canUpdateType =
    canSetDocuments ||
    hasPermission([DOCUMENT_SET_TYPE, ORDER_ITEMS_DOCUMENT_SET_TYPE, DOCUMENT_UPDATE]);
  const canUpdateMemo =
    canSetDocuments ||
    hasPermission([DOCUMENT_SET_MEMO, ORDER_ITEMS_DOCUMENT_SET_MEMO, DOCUMENT_UPDATE]);
  const canDownload = hasPermission(ORDER_ITEMS_DOWNLOAD_DOCUMENTS);

  return (
    <DocumentsSection
      entityType="OrderItem"
      container={OrderItemFilesContainer}
      canUpload={canUpload}
      canDownload={canDownload}
      canRemove={canRemove}
      canUpdateStatus={canUpdateStatus}
      canUpdateType={canUpdateType}
      canUpdateMemo={canUpdateMemo}
    />
  );
}

export default ItemDocumentsSection;
