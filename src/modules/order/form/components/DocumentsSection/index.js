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
              { type: 'OrderPo', label: intl.formatMessage(messages.fileTypeOrderPO) },
              { type: 'OrderPi', label: intl.formatMessage(messages.fileTypeOrderPI) },
              { type: 'Document', label: intl.formatMessage(messages.fileTypeDocument) },
            ]}
          />
        )}
      </Subscribe>
    </div>
  );
}

export default injectIntl(DocumentsSection);
