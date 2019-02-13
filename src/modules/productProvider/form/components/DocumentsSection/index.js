// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Subscribe } from 'unstated';
import { DocumentsInput } from 'components/Form';
import ProductProviderContainer from 'modules/productProvider/form/container';
import { PermissionConsumer } from 'modules/permission';
import { DocumentSectionStyle } from './style';

type Props = {
  intl: IntlShape,
};

function DocumentsSection({ intl }: Props) {
  return (
    <PermissionConsumer>
      {hasPermission => {
        const canCreateOrUpdate =
          hasPermission('product.productProviders.create') ||
          hasPermission('product.productProviders.update');
        return (
          <div className={DocumentSectionStyle}>
            <Subscribe to={[ProductProviderContainer]}>
              {({ state: { files }, setFieldValue: changeFiles }) => (
                <DocumentsInput
                  readOnly={
                    !canCreateOrUpdate && !hasPermission('product.productProviders.setDocuments')
                  }
                  id="files"
                  name="files"
                  values={files}
                  onChange={(field, value) => {
                    changeFiles(field, value);
                  }}
                  types={[
                    {
                      type: 'ProductSpec',
                      label: intl.formatMessage({
                        id: 'modules.provider.fileType.productSpec',
                        defaultMessage: 'Product Specification',
                      }),
                    },
                    {
                      type: 'ProductAnalysisCert',
                      label: intl.formatMessage({
                        id: 'modules.provider.fileType.productAnalysisCert',
                        defaultMessage: 'Product Analysis Certificate',
                      }),
                    },
                    {
                      type: 'ProductOriginCert',
                      label: intl.formatMessage({
                        id: 'modules.provider.fileType.productOriginCert',
                        defaultMessage: 'Product Origin Certificate',
                      }),
                    },
                    {
                      type: 'Document',
                      label: intl.formatMessage({
                        id: 'modules.provider.fileType.document',
                        defaultMessage: 'Document',
                      }),
                    },
                  ]}
                />
              )}
            </Subscribe>
          </div>
        );
      }}
    </PermissionConsumer>
  );
}

export default injectIntl(DocumentsSection);
