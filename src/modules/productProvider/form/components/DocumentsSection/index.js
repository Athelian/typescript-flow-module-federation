// @flow
import * as React from 'react';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { ProductProviderInfoContainer } from 'modules/productProvider/form/containers';
import usePermission from 'hooks/usePermission';
import {
  PRODUCT_PROVIDER_SET_DOCUMENTS,
  PRODUCT_PROVIDER_DOWNLOAD_DOCUMENTS,
  PRODUCT_PROVIDER_DOCUMENT_DELETE,
  PRODUCT_PROVIDER_DOCUMENT_CREATE,
  PRODUCT_PROVIDER_DOCUMENT_SET_MEMO,
  PRODUCT_PROVIDER_DOCUMENT_SET_STATUS,
  PRODUCT_PROVIDER_DOCUMENT_SET_TYPE,
} from 'modules/permission/constants/product';
import {
  DOCUMENT_CREATE,
  DOCUMENT_DELETE,
  DOCUMENT_SET_MEMO,
  DOCUMENT_SET_STATUS,
  DOCUMENT_SET_TYPE,
  DOCUMENT_UPDATE,
} from 'modules/permission/constants/file';
import DocumentsSection from 'sections/DocumentsSection';

export default function EndProductDocumentsSection() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const canSetDocuments = hasPermission(PRODUCT_PROVIDER_SET_DOCUMENTS);
  const canUpload =
    canSetDocuments || hasPermission([PRODUCT_PROVIDER_DOCUMENT_CREATE, DOCUMENT_CREATE]);
  const canDownload = hasPermission(PRODUCT_PROVIDER_DOWNLOAD_DOCUMENTS);
  const canRemove =
    canSetDocuments || hasPermission([PRODUCT_PROVIDER_DOCUMENT_DELETE, DOCUMENT_DELETE]);
  const canUpdateStatus =
    canSetDocuments ||
    hasPermission([DOCUMENT_SET_STATUS, PRODUCT_PROVIDER_DOCUMENT_SET_STATUS, DOCUMENT_UPDATE]);
  const canUpdateType =
    canSetDocuments ||
    hasPermission([DOCUMENT_SET_TYPE, PRODUCT_PROVIDER_DOCUMENT_SET_TYPE, DOCUMENT_UPDATE]);
  const canUpdateMemo =
    canSetDocuments ||
    hasPermission([DOCUMENT_SET_MEMO, PRODUCT_PROVIDER_DOCUMENT_SET_MEMO, DOCUMENT_UPDATE]);

  return (
    <DocumentsSection
      sectionId="productProvider_documentsSection"
      entityType="ProductProvider"
      container={ProductProviderInfoContainer}
      canUpload={canUpload}
      canRemove={canRemove}
      canDownload={canDownload}
      canUpdateStatus={canUpdateStatus}
      canUpdateMemo={canUpdateMemo}
      canUpdateType={canUpdateType}
    />
  );
}
