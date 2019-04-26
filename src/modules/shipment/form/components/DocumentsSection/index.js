// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_DOWNLOAD_DOCUMENTS,
  SHIPMENT_SET_DOCUMENTS,
} from 'modules/permission/constants/shipment';
import { DocumentsInput } from 'components/Form';
import { ShipmentFilesContainer } from 'modules/shipment/form/containers';
import messages from 'modules/shipment/messages';

type Props = {
  intl: IntlShape,
};

function DocumentsSection({ intl }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const allowUpdate = hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_DOCUMENTS);

  const allowDownload = hasPermission(SHIPMENT_DOWNLOAD_DOCUMENTS);

  return (
    <Subscribe to={[ShipmentFilesContainer]}>
      {({ state: { files }, setFieldValue: changeFiles }) => (
        <DocumentsInput
          id="files"
          name="files"
          editable={allowUpdate}
          downloadable={allowDownload}
          values={files}
          onChange={(field, value) => {
            changeFiles(field, value);
          }}
          types={[
            {
              value: 'ShipmentBl',
              label: intl.formatMessage(messages.bl),
            },
            {
              value: 'ShipmentInvoice',
              label: intl.formatMessage(messages.invoice),
            },
            {
              value: 'ShipmentPackingList',
              label: intl.formatMessage(messages.packingList),
            },
            {
              value: 'ShipmentImportDeclaration',
              label: intl.formatMessage(messages.importDeclaration),
            },
            {
              value: 'ShipmentInspectionApplication',
              label: intl.formatMessage(messages.inspectionApplication),
            },
            {
              value: 'Document',
              label: intl.formatMessage(messages.document),
            },
          ]}
        />
      )}
    </Subscribe>
  );
}

export default injectIntl(DocumentsSection);
