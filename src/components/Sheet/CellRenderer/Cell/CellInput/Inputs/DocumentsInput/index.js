// @flow
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import type { FilePayload } from 'generated/graphql';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  CellDisplayWrapperStyle,
  DisplayContentStyle,
} from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
import orderMessages from 'modules/order/messages';
import shipmentMessages from 'modules/shipment/messages';
import DocumentsInputDialog from './DocumentsInputDialog';
import { DocumentsInputWrapperStyle, DocumentIconStyle } from './style';

type Props = {
  ...InputProps<Array<FilePayload>>,
  entityType: string,
};

const DocumentsInputImpl = ({
  value,
  focus,
  readonly,
  onChange,
  forceFocus,
  forceBlur,
  entityType,
}: Props) => {
  const [filesValue, setFilesValue] = React.useState(value);
  const intl = useIntl();

  React.useEffect(() => setFilesValue(value), [value]);

  const handleBlur = (e: SyntheticFocusEvent<HTMLElement>) => {
    if (focus) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const documentTypeMessageMap = {
    Order: {
      OrderPo: intl.formatMessage(orderMessages.fileTypeOrderPO),
      OrderPi: intl.formatMessage(orderMessages.fileTypeOrderPI),
      Document: intl.formatMessage(orderMessages.fileTypeDocument),
    },
    OrderItem: {
      Document: intl.formatMessage(orderMessages.fileTypeDocument),
    },
    Shipment: {
      ShipmentBl: intl.formatMessage(shipmentMessages.bl),
      ShipmentInvoice: intl.formatMessage(shipmentMessages.invoice),
      ShipmentPackingList: intl.formatMessage(shipmentMessages.packingList),
      ShipmentImportDeclaration: intl.formatMessage(shipmentMessages.importDeclaration),
      ShipmentInspectionApplication: intl.formatMessage(shipmentMessages.inspectionApplication),
      ShipmentWarehouseArrivalReport: intl.formatMessage(shipmentMessages.warehouseArrivalReport),
      ShipmentWarehouseInspectionReport: intl.formatMessage(
        shipmentMessages.warehouseInspectionReport
      ),
      Document: intl.formatMessage(orderMessages.fileTypeDocument),
    },
  };

  const renderDocuments = (documents: Array<any>) => {
    const documentTypeMap = new Map();
    const documentTypeCounts = [];

    documents.forEach(document => {
      const count = documentTypeMap.get(document.type);
      if (count) {
        documentTypeMap.set(document.type, count + 1);
      } else {
        documentTypeMap.set(document.type, 1);
      }
    });

    documentTypeMap.forEach((count, type) => {
      const typeMessage =
        (documentTypeMessageMap[entityType] && documentTypeMessageMap[entityType][type]) ||
        intl.formatMessage(orderMessages.fileTypeDocument);
      if (count) {
        documentTypeCounts.push(`${intl.formatNumber(count)} ${typeMessage}`);
      }
    });

    return <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{documentTypeCounts.join(', ')}</>;
  };

  return (
    <div onBlur={handleBlur}>
      <button
        disabled={readonly}
        onClick={forceFocus}
        type="button"
        className={DocumentsInputWrapperStyle}
      >
        <div className={DocumentIconStyle('DOCUMENT')}>
          <Icon icon="DOCUMENT" />
        </div>

        <div className={CellDisplayWrapperStyle}>
          <span className={DisplayContentStyle}>
            <>
              {(filesValue || []).length === 1 ? (
                <FormattedMessage
                  id="modules.sheet.doc"
                  defaultMessage="{numOfDocuments} Doc"
                  values={{
                    numOfDocuments: <FormattedNumber value={(filesValue || []).length} />,
                  }}
                />
              ) : (
                <FormattedMessage
                  id="modules.sheet.docs"
                  defaultMessage="{numOfDocuments} Docs"
                  values={{
                    numOfDocuments: <FormattedNumber value={(filesValue || []).length} />,
                  }}
                />
              )}
            </>
            {renderDocuments(filesValue || [])}
          </span>
        </div>
      </button>

      <DocumentsInputDialog
        value={filesValue || []}
        onChange={setFilesValue}
        onClose={() => {
          onChange(filesValue, true);
          forceBlur();
        }}
        open={focus}
        entityType={entityType}
      />
    </div>
  );
};

const DocumentsInput = (entityType: string) => (props: InputProps<Array<FilePayload>>) => (
  <DocumentsInputImpl {...props} entityType={entityType} />
);

export default {
  Order: DocumentsInput('Order'),
  OrderItem: DocumentsInput('OrderItem'),
  Shipment: DocumentsInput('Shipment'),
  Milestone: DocumentsInput('Milestone'),
};
