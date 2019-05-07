// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Subscribe } from 'unstated';
import { DocumentsInput } from 'components/Form';
import { ProductProviderInfoContainer } from 'modules/productProvider/form/containers';
import usePermission from 'hooks/usePermission';
import {
  PRODUCT_UPDATE,
  PRODUCT_PROVIDER_SET_DOCUMENTS,
  PRODUCT_PROVIDER_DOWNLOAD_DOCUMENTS,
} from 'modules/permission/constants/product';

type Props = {
  intl: IntlShape,
  isOwner: boolean,
};

function DocumentsSection({ intl, isOwner }: Props) {
  const { hasPermission } = usePermission(isOwner);
  const allowUpdate =
    hasPermission(PRODUCT_UPDATE) || hasPermission(PRODUCT_PROVIDER_SET_DOCUMENTS);
  const allowDownload = hasPermission(PRODUCT_PROVIDER_DOWNLOAD_DOCUMENTS);

  return (
    <Subscribe to={[ProductProviderInfoContainer]}>
      {({ state: { files }, setFieldValue: changeFiles }) => (
        <DocumentsInput
          editable={allowUpdate}
          downloadable={allowDownload}
          id="files"
          name="files"
          values={files}
          onChange={(field, value) => {
            changeFiles(field, value);
          }}
          types={[
            {
              value: 'ProductSpec',
              label: intl.formatMessage({
                id: 'modules.provider.fileType.productSpec',
                defaultMessage: 'Product Specification',
              }),
            },
            {
              value: 'ProductAnalysisCert',
              label: intl.formatMessage({
                id: 'modules.provider.fileType.productAnalysisCert',
                defaultMessage: 'Product Analysis Certificate',
              }),
            },
            {
              value: 'ProductOriginCert',
              label: intl.formatMessage({
                id: 'modules.provider.fileType.productOriginCert',
                defaultMessage: 'Product Origin Certificate',
              }),
            },
            {
              value: 'Document',
              label: intl.formatMessage({
                id: 'modules.provider.fileType.document',
                defaultMessage: 'Document',
              }),
            },
          ]}
        />
      )}
    </Subscribe>
  );
}

export default injectIntl(DocumentsSection);
