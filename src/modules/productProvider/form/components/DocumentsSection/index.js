// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { DocumentsUpload, SectionWrapper } from 'components/Form';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { ProductProviderInfoContainer } from 'modules/productProvider/form/containers';
import usePermission from 'hooks/usePermission';
import {
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_SET_DOCUMENTS,
  PRODUCT_PROVIDER_DOWNLOAD_DOCUMENTS,
  PRODUCT_PROVIDER_DOCUMENT_DELETE,
  PRODUCT_PROVIDER_DOCUMENT_CREATE,
  PRODUCT_PROVIDER_DOCUMENT_SET_TYPE,
} from 'modules/permission/constants/product';
import {
  DOCUMENT_CREATE,
  DOCUMENT_DELETE,
  DOCUMENT_SET_TYPE,
  DOCUMENT_UPDATE,
  DOCUMENT_FORM,
} from 'modules/permission/constants/file';

export default function EndProductDocumentsSection() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const canUpload = hasPermission([
    PRODUCT_PROVIDER_SET_DOCUMENTS,
    PRODUCT_PROVIDER_DOCUMENT_CREATE,
    DOCUMENT_CREATE,
  ]);
  const canAddOrphan = hasPermission([PRODUCT_PROVIDER_SET_DOCUMENTS, PRODUCT_PROVIDER_UPDATE]);
  const canViewForm = hasPermission(DOCUMENT_FORM);
  const canDownload = hasPermission(PRODUCT_PROVIDER_DOWNLOAD_DOCUMENTS);
  const canChangeType = hasPermission([
    PRODUCT_PROVIDER_SET_DOCUMENTS,
    DOCUMENT_SET_TYPE,
    PRODUCT_PROVIDER_DOCUMENT_SET_TYPE,
    DOCUMENT_UPDATE,
  ]);
  const canDelete = hasPermission([
    PRODUCT_PROVIDER_SET_DOCUMENTS,
    PRODUCT_PROVIDER_DOCUMENT_DELETE,
    DOCUMENT_DELETE,
  ]);

  return (
    <Subscribe to={[ProductProviderInfoContainer]}>
      {({ state: { files = [] }, setFieldValue }) => {
        return (
          <SectionWrapper id="productProvider_documentsSection">
            <DocumentsUpload
              files={files}
              entity="ProductProvider"
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
