// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Subscribe } from 'unstated';
import { DocumentsInput } from 'components/Form';
import { OrderFilesContainer } from 'modules/order/form/containers';
import messages from 'modules/order/messages';
import { DocumentSectionStyle } from './style';

type Props = {
  intl: IntlShape,
};

function DocumentsSection({ intl }: Props) {
  return (
    <div className={DocumentSectionStyle}>
      <Subscribe to={[OrderFilesContainer]}>
        {({ state: { files }, setFieldValue: changeFiles }) => (
          <DocumentsInput
            id="files"
            name="files"
            values={files}
            onChange={(field, value) => {
              changeFiles(field, value);
            }}
            types={[
              { type: 'Document', label: intl.formatMessage(messages.fileTypeDocument) },
              { type: 'OrderPO', label: intl.formatMessage(messages.fileTypeOrderPO) },
            ]}
          />
        )}
      </Subscribe>
    </div>
  );
}

export default injectIntl(DocumentsSection);
