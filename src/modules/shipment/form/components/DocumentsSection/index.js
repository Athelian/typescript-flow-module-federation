// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { defineMessages, injectIntl } from 'react-intl';
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

const messages = defineMessages({
  bl: {
    id: 'global.upload.types.shipment.bl',
    defaultMessage: 'B/L',
  },
  invoice: {
    id: 'global.upload.types.shipment.invoice',
    defaultMessage: 'Invoice',
  },
  packing: {
    id: 'global.upload.types.shipment.packing',
    defaultMessage: 'Packing List',
  },
  import: {
    id: 'global.upload.types.shipment.import',
    defaultMessage: 'Import Declaration',
  },
  inspection: {
    id: 'global.upload.types.shipment.inspection',
    defaultMessage: 'Inspection Application',
  },
  document: {
    id: 'global.upload.types.shipment.document',
    defaultMessage: 'Document',
  },
});

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
              label: intl.formatMessage(messages.packing),
            },
            {
              value: 'ShipmentImportDeclaration',
              label: intl.formatMessage(messages.import),
            },
            {
              value: 'ShipmentInspectionApplication',
              label: intl.formatMessage(messages.inspection),
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
