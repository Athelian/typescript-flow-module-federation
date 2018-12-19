// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Subscribe } from 'unstated';
import { DocumentsInput } from 'components/Form';
import ProductProviderContainer from 'modules/productProvider/form/container';
import { DocumentSectionStyle } from './style';

type Props = {
  intl: IntlShape,
};

function DocumentsSection({ intl }: Props) {
  return (
    <div className={DocumentSectionStyle}>
      <Subscribe to={[ProductProviderContainer]}>
        {({ state: { files }, setFieldValue: changeFiles }) => (
          <DocumentsInput
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
}

export default injectIntl(DocumentsSection);
