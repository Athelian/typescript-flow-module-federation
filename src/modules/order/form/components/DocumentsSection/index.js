// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Subscribe } from 'unstated';
import { ORDER_UPDATE, ORDER_DOWNLOAD_DOCUMENTS } from 'modules/permission/constants/order';
import { DocumentsInput } from 'components/Form';
import { OrderFilesContainer } from 'modules/order/form/containers';
import messages from 'modules/order/messages';
import usePermission from 'hooks/usePermission';

type Props = {
  intl: IntlShape,
};

function DocumentsSection({ intl }: Props) {
  const { hasPermission } = usePermission();
  const allowUpdate = hasPermission(ORDER_UPDATE);
  const allowDownload = hasPermission(ORDER_DOWNLOAD_DOCUMENTS);

  return (
    <Subscribe to={[OrderFilesContainer]}>
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
            { value: 'OrderPo', label: intl.formatMessage(messages.fileTypeOrderPO) },
            { value: 'OrderPi', label: intl.formatMessage(messages.fileTypeOrderPI) },
            { value: 'Document', label: intl.formatMessage(messages.fileTypeDocument) },
          ]}
        />
      )}
    </Subscribe>
  );
}

export default injectIntl(DocumentsSection);
