// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { DocumentsInput } from 'components/Form';
import { ProductProviderInfoContainer } from 'modules/productProvider/form/containers';
import usePermission from 'hooks/usePermission';
import {
  PRODUCT_FORM,
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

type Props = {
  isOwner: boolean,
};

function DocumentsSection({ isOwner }: Props) {
  const { hasPermission } = usePermission(isOwner);

  return (
    <Subscribe to={[ProductProviderInfoContainer]}>
      {({ state: { files }, setFieldValue }) => (
        <DocumentsInput
          navigable={hasPermission(PRODUCT_FORM)}
          uploadable={hasPermission([PRODUCT_PROVIDER_DOCUMENT_CREATE, DOCUMENT_CREATE])}
          removable={hasPermission([PRODUCT_PROVIDER_DOCUMENT_DELETE, DOCUMENT_DELETE])}
          editable={{
            status: hasPermission([
              DOCUMENT_SET_STATUS,
              PRODUCT_PROVIDER_DOCUMENT_SET_STATUS,
              DOCUMENT_UPDATE,
              PRODUCT_PROVIDER_SET_DOCUMENTS,
            ]),
            type: hasPermission([
              DOCUMENT_SET_TYPE,
              PRODUCT_PROVIDER_DOCUMENT_SET_TYPE,
              DOCUMENT_UPDATE,
              PRODUCT_PROVIDER_SET_DOCUMENTS,
            ]),
            memo: hasPermission([
              DOCUMENT_SET_MEMO,
              PRODUCT_PROVIDER_DOCUMENT_SET_MEMO,
              DOCUMENT_UPDATE,
              PRODUCT_PROVIDER_SET_DOCUMENTS,
            ]),
          }}
          downloadable={hasPermission(PRODUCT_PROVIDER_DOWNLOAD_DOCUMENTS)}
          files={files}
          onSave={updateFiles => setFieldValue('files', updateFiles)}
          entity="ProductProvider"
        />
      )}
    </Subscribe>
  );
}

export default DocumentsSection;
