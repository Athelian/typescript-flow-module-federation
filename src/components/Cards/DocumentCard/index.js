// @flow
import * as React from 'react';
import type { FileType, FileStatus, EntityPayload } from 'generated/graphql';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Link } from '@reach/router';
import withForbiddenCard from 'hoc/withForbiddenCard';
import { getByPathWithDefault } from 'utils/fp';
import { FormField } from 'modules/form';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import { computeIcon, getFileExtension, getFileName } from 'components/Form/DocumentsInput/helpers';
import { SelectInputFactory, TextAreaInputFactory, EnumSelectInputFactory } from 'components/Form';
import RelateEntity from 'components/RelateEntity';
import orderMessages from 'modules/order/messages';
import shipmentMessages from 'modules/shipment/messages';
import { getParentInfo } from 'utils/task';
import BaseCard from '../BaseCard';
import {
  DocumentCardWrapperStyle,
  DocumentBottomWrapperStyle,
  DocumentParentWrapperStyle,
  FileExtensionIconStyle,
  FileNameWrapperStyle,
  FileNameStyle,
  DownloadButtonStyle,
  FileStatusColoringWrapper,
  MemoWrapperStyle,
  CloseButtonStyle,
  MemoPanelStyle,
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
|};

export const getFileTypesByEntity = (
  entity: 'Order' | 'OrderItem' | 'Shipment' | 'ProductProvider',
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
          value: 'Document',
          label: intl.formatMessage(shipmentMessages.document),
        },
      ];

    default:
      return [];
  }
};

let cardHeight = '210px';

const DocumentCard = ({
  file,
  editable,
  hideParentInfo,
  actions,
  downloadable,
  navigable,
  intl,
  onChange,
}: Props) => {
  cardHeight = hideParentInfo ? '185px' : '210px';
  const memoHeight = hideParentInfo ? '145px' : '170px';
  const { parentIcon, parentData, link } = getParentInfo(getByPathWithDefault({}, 'entity', file));

  const name = getByPathWithDefault('', 'name', file);
  const id = getByPathWithDefault(Date.now(), 'id', file);
  const fileExtension = getFileExtension(name);
  const fileName = getFileName(name);
  const fileIcon = computeIcon(fileExtension);
  const [showMemo, setShowMemo] = React.useState(false);
  return (
    <BaseCard
      actions={actions}
      showActionsOnHover
      readOnly={!editable}
      icon="DOCUMENT"
      color="DOCUMENT"
    >
      <div className={DocumentCardWrapperStyle(cardHeight)} role="presentation">
        {!hideParentInfo && (
          <div className={DocumentParentWrapperStyle}>
            {navigable ? (
              <Link
                to={link}
                onClick={evt => {
                  evt.stopPropagation();
                }}
              >
                <RelateEntity entity={parentIcon} value={parentData} />
              </Link>
            ) : (
              <RelateEntity entity={parentIcon} value={parentData} />
            )}
          </div>
        )}
        <FormField
          name={`${id}.type`}
          setFieldValue={(field, value) => onChange && onChange('type', value)}
          initValue={getByPathWithDefault('', 'type', file)}
          saveOnChange
        >
          {({ ...inputHandlers }) => (
            <SelectInputFactory
              {...inputHandlers}
              items={getFileTypesByEntity(
                getByPathWithDefault('', 'entity.__typename', file),
                intl
              )}
              editable={editable.type}
              inputWidth={hideParentInfo ? '160px' : '185px'}
              inputHeight="30px"
              hideTooltip
              inputAlign="left"
              required
            />
          )}
        </FormField>
        <div className={FileExtensionIconStyle(fileIcon.color)}>
          <Icon {...fileIcon} />
        </div>
        <Tooltip message={`${fileName}.${fileExtension}`}>
          <div className={FileNameWrapperStyle}>
            <div className={FileNameStyle}>{fileName}</div>
            {`.${fileExtension}`}
          </div>
        </Tooltip>

        <div className={DocumentBottomWrapperStyle(showMemo)}>
          <div className={MemoPanelStyle(showMemo ? cardHeight : '30px')}>
            {showMemo ? (
              <>
                <div
                  className={CloseButtonStyle}
                  onClick={() => setShowMemo(false)}
                  role="presentation"
                >
                  <Icon icon="CLEAR" />
                </div>
                <FormField
                  name={`${id}.memo`}
                  setFieldValue={(field, value) => onChange && onChange('memo', value)}
                  initValue={getByPathWithDefault('', 'memo', file)}
                >
                  {({ ...inputHandlers }) => (
                    <TextAreaInputFactory
                      {...inputHandlers}
                      isNew
                      editable={editable.memo}
                      label={<FormattedMessage {...orderMessages.memo} />}
                      inputWidth="185px"
                      inputHeight={memoHeight}
                    />
                  )}
                </FormField>
              </>
            ) : (
              <button
                className={MemoWrapperStyle(!!getByPathWithDefault('', 'memo', file))}
                type="button"
                onClick={() => setShowMemo(true)}
              >
                <Icon icon="MEMO" />
              </button>
            )}
            {!showMemo && (
              <>
                <FormField
                  name={`${id}.status`}
                  setFieldValue={(field, value) => onChange && onChange('status', value)}
                  initValue={getByPathWithDefault('', 'status', file)}
                  saveOnChange
                >
                  {({ ...inputHandlers }) => (
                    <span
                      className={FileStatusColoringWrapper(
                        getByPathWithDefault('', 'status', file),
                        editable.status
                      )}
                    >
                      <EnumSelectInputFactory
                        {...inputHandlers}
                        enumType="FileStatus"
                        editable={editable.status}
                        inputWidth="115px"
                        inputHeight="30px"
                        hideTooltip
                        inputAlign="center"
                        dropDirection="up"
                        required
                      />
                    </span>
                  )}
                </FormField>
                {downloadable ? (
                  <button
                    type="button"
                    className={DownloadButtonStyle(false)}
                    onClick={() => {
                      window.open(getByPathWithDefault('', 'path', file), '_blank');
                    }}
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
              </>
            )}
          </div>
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
