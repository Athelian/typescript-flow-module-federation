// @flow
import * as React from 'react';
import type { FileType, FileStatus, EntityPayload } from 'generated/graphql';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import withForbiddenCard from 'hoc/withForbiddenCard';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import {
  computeIcon,
  getFileExtension,
  getFileName,
} from 'components/Form/DocumentsUpload/helpers';
import orderMessages from 'modules/order/messages';
import shipmentMessages from 'modules/shipment/messages';
import BaseCard from '../BaseCard';
import {
  DocumentMiniCardWrapperStyle,
  FileExtensionIconStyle,
  FileNameWrapperStyle,
  FileNameStyle,
  StatusAndButtonsWrapperStyle,
  DownloadButtonStyle,
} from './style';

type Props = {|
  intl: IntlShape,
  file: {
    id: string,
    name: string,
    type: FileType,
    status: FileStatus,
    entity: EntityPayload,
    memo: string,
    path: string,
  },
  editable: {
    status: boolean,
    type: boolean,
    memo: boolean,
  },
  actions?: Array<React$Node>,
  hideParentInfo?: boolean,
  downloadable?: boolean,
  navigable?: boolean,
  onChange?: (field: string, value: mixed) => void,
  onClick?: Function,
|};

export const getFileTypesByEntity = (
  entity: 'Order' | 'OrderItem' | 'Shipment' | 'ProductProvider' | 'Milestone',
  intl: IntlShape
) => {
  switch (entity) {
    case 'Order':
      return [
        { value: 'OrderPo', label: intl.formatMessage(orderMessages.fileTypeOrderPO) },
        { value: 'OrderPi', label: intl.formatMessage(orderMessages.fileTypeOrderPI) },
        { value: 'Document', label: intl.formatMessage(orderMessages.fileTypeDocument) },
      ];

    case 'OrderItem':
    case 'Milestone':
      return [
        {
          value: 'Document',
          label: intl.formatMessage(orderMessages.fileTypeDocument),
        },
      ];

    case 'ProductProvider':
      return [
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
      ];

    case 'Shipment':
      return [
        {
          value: 'ShipmentBl',
          label: intl.formatMessage(shipmentMessages.bl),
        },
        {
          value: 'ShipmentInvoice',
          label: intl.formatMessage(shipmentMessages.invoice),
        },
        {
          value: 'ShipmentPackingList',
          label: intl.formatMessage(shipmentMessages.packingList),
        },
        {
          value: 'ShipmentImportDeclaration',
          label: intl.formatMessage(shipmentMessages.importDeclaration),
        },
        {
          value: 'ShipmentInspectionApplication',
          label: intl.formatMessage(shipmentMessages.inspectionApplication),
        },
        {
          value: 'ShipmentWarehouseArrivalReport',
          label: intl.formatMessage(shipmentMessages.warehouseArrivalReport),
        },
        {
          value: 'ShipmentWarehouseInspectionReport',
          label: intl.formatMessage(shipmentMessages.warehouseInspectionReport),
        },
        {
          value: 'Document',
          label: intl.formatMessage(shipmentMessages.document),
        },
      ];

    default:
      return [
        {
          value: 'Document',
          label: intl.formatMessage(shipmentMessages.document),
        },
      ];
  }
};

const DocumentMiniCard = ({
  file,
  editable,
  hideParentInfo,
  actions,
  downloadable,
  navigable,
  intl,
  onChange,
  onClick,
  ...rest
}: Props) => {
  const name = file?.name ?? '';
  const fileExtension = getFileExtension(name);
  const fileName = getFileName(name);
  const fileIcon = computeIcon(fileExtension);
  return (
    <BaseCard
      actions={actions}
      showActionsOnHover
      readOnly={!editable}
      icon="DOCUMENT"
      color="DOCUMENT"
      onClick={onClick}
      {...rest}
    >
      <div className={DocumentMiniCardWrapperStyle}>
        {/* TODO: revision UI */}
        <div className={FileExtensionIconStyle(fileIcon.color)}>
          <Icon {...fileIcon} />
        </div>

        <Tooltip message={`${fileName}.${fileExtension}`}>
          <div className={FileNameWrapperStyle}>
            <div className={FileNameStyle}>{fileName}</div>
            {`.${fileExtension}`}
          </div>
        </Tooltip>

        <div
          className={StatusAndButtonsWrapperStyle}
          onClick={evt => {
            evt.stopPropagation();
          }}
          role="presentation"
        >
          {downloadable ? (
            <button
              className={DownloadButtonStyle(false)}
              onClick={e => {
                e.stopPropagation();
                window.open(file?.path ?? '', '_blank');
              }}
              type="button"
            >
              <Icon icon="DOWNLOAD" />
            </button>
          ) : (
            <Tooltip
              message={
                <FormattedMessage
                  id="components.documentInput.cantDownload"
                  defaultMessage="You do not have the rights to download this document"
                />
              }
            >
              <div className={DownloadButtonStyle(true)}>
                <Icon icon="DOWNLOAD" />
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    </BaseCard>
  );
};

export default withForbiddenCard(injectIntl(DocumentMiniCard), 'file', {
  width: '195px',
  height: '109px',
  entityIcon: 'DOCUMENT',
  entityColor: 'DOCUMENT',
});
