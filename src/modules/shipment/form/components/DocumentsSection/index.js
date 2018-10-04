// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { defineMessages, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { DocumentsInput } from 'components/Form';
import { ShipmentFilesContainer } from 'modules/shipment/form/containers';
import { DocumentSectionStyle } from './style';

const messages = defineMessages({
  bl: {
    id: 'global.upload.types.shipment.bl',
    defaultMessage: 'B/l',
  },
  invoice: {
    id: 'global.upload.types.shipment.invoice',
    defaultMessage: 'Invoice',
  },
  packing: {
    id: 'global.upload.types.shipment.packing',
    defaultMessage: 'Packing',
  },
  import: {
    id: 'global.upload.types.shipment.import',
    defaultMessage: 'Import',
  },
});

type Props = {
  intl: IntlShape,
};

function DocumentsSection({ intl }: Props) {
  return (
    <div className={DocumentSectionStyle}>
      <Subscribe to={[ShipmentFilesContainer]}>
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
                type: 'ShipmentBl',
                label: intl.formatMessage(messages.bl),
              },
              {
                type: 'ShipmentInvoice',
                label: intl.formatMessage(messages.invoice),
              },
              {
                type: 'ShipmentPacking',
                label: intl.formatMessage(messages.packing),
              },
              {
                type: 'ShipmentImport',
                label: intl.formatMessage(messages.import),
              },
            ]}
          />
        )}
      </Subscribe>
    </div>
  );
}

export default injectIntl(DocumentsSection);
