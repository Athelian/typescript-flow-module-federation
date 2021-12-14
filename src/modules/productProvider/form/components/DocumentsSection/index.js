// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { DocumentsUpload, SectionWrapper } from 'components/Form';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { ProductProviderInfoContainer } from 'modules/productProvider/form/containers';
import usePermission from 'hooks/usePermission';
import {
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_DOCUMENT_EDIT,
  PRODUCT_PROVIDER_DOCUMENT_DOWNLOAD,
  PRODUCT_PROVIDER_DOCUMENT_DELETE,
  PRODUCT_PROVIDER_DOCUMENT_FORM,
} from 'modules/permission/constants/product';
import { PARENTLESS_DOCUMENT_UPLOAD } from 'modules/permission/constants/file';

export default function EndProductDocumentsSection() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const canAddOrphan = hasPermission([PRODUCT_PROVIDER_DOCUMENT_EDIT, PRODUCT_PROVIDER_UPDATE]);
  const canChangeType = hasPermission([PRODUCT_PROVIDER_DOCUMENT_EDIT, PRODUCT_PROVIDER_UPDATE]);
  const canUpload = hasPermission(PARENTLESS_DOCUMENT_UPLOAD) && canChangeType;
  const canViewForm = hasPermission(PRODUCT_PROVIDER_DOCUMENT_FORM);
  const canDownload = hasPermission(PRODUCT_PROVIDER_DOCUMENT_DOWNLOAD);
  const canDelete = hasPermission(PRODUCT_PROVIDER_DOCUMENT_DELETE);

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
