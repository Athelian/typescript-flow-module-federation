// @flow
import * as React from 'react';
import type { FilePayload } from 'generated/graphql';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import withForbiddenCard from 'hoc/withForbiddenCard';
import { isForbidden } from 'utils/data';
import { FormField } from 'modules/form';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import {
  computeIcon,
  getFileExtension,
  getFileName,
} from 'components/Form/DocumentsUpload/helpers';
import { SelectInputFactory } from 'components/Form';
import Tag from 'components/Tag';
import RelateEntity from 'components/RelateEntity';
import orderMessages from 'modules/order/messages';
import shipmentMessages from 'modules/shipment/messages';
import { getParentInfo } from 'utils/task';
import BaseCard from '../BaseCard';
import {
  DocumentCardWrapperStyle,
  DocumentParentWrapperStyle,
  DocumentTypeStyle,
  FileExtensionIconStyle,
  FileNameWrapperStyle,
  FileNameStyle,
  TagsAndButtonsWrapperStyle,
  DownloadButtonStyle,
  TagsWrapperStyle,
} from './style';

type Props = {|
  intl: IntlShape,
  file: FilePayload,
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

let cardHeight = '150px';

const DocumentCard = ({
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
  cardHeight = hideParentInfo ? '150px' : '175px';
  const name = file?.name ?? '';
  const id = file?.id ?? Date.now();
  const fileExtension = getFileExtension(name);
  const fileName = getFileName(name);
  const fileIcon = computeIcon(fileExtension);
  const { parentIcon, parentData, link } = getParentInfo(file?.entity ?? {});

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
      <div className={DocumentCardWrapperStyle(cardHeight)}>
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
          className={DocumentTypeStyle}
          onClick={evt => {
            evt.stopPropagation();
          }}
          role="presentation"
        >
          <FormField
            name={`${id}.type`}
            setFieldValue={(field, value) => onChange && onChange('type', value)}
            initValue={file?.type ?? ''}
            saveOnChange
          >
            {({ ...inputHandlers }) => (
              <SelectInputFactory
                {...inputHandlers}
                items={getFileTypesByEntity(file?.entity?.__typename, intl)}
                editable={editable?.type}
                inputWidth={hideParentInfo ? '165px' : '185px'}
                inputHeight="30px"
                hideTooltip
                required
              />
            )}
          </FormField>
        </div>

        {!hideParentInfo && (
          <div className={DocumentParentWrapperStyle}>
            <RelateEntity link={navigable ? link : ''} entity={parentIcon} value={parentData} />
          </div>
        )}

        <div
          className={TagsAndButtonsWrapperStyle}
          onClick={evt => {
            evt.stopPropagation();
          }}
          role="presentation"
        >
          <div className={TagsWrapperStyle}>
            {(file?.tags ?? [])
              .filter(item => !isForbidden(item))
              .map(tag => (
                <Tag key={tag.id} tag={tag} />
              ))}
          </div>
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

export default withForbiddenCard(injectIntl(DocumentCard), 'file', {
  width: '195px',
  height: cardHeight,
  entityIcon: 'DOCUMENT',
  entityColor: 'DOCUMENT',
});
