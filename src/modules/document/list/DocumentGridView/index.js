// @flow
import * as React from 'react';
import type { FilePayload } from 'generated/graphql';
import { useMutation } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import { intersection } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { encodeId } from 'utils/id';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import UploadPlaceholder from 'components/UploadPlaceholder';
import GridView from 'components/GridView';
import DocumentCard from 'components/Cards/DocumentCard';
import ActionDialog, { FileLabelIcon } from 'components/Dialog/ActionDialog';
import { CardAction } from 'components/Cards';
import { BaseButton } from 'components/Buttons';
import {
  ORDER_FORM,
  ORDER_DOWNLOAD_DOCUMENTS,
  ORDER_DOCUMENT_DELETE,
} from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_FORM,
  ORDER_ITEMS_DOWNLOAD_DOCUMENTS,
  ORDER_ITEMS_DOCUMENT_DELETE,
} from 'modules/permission/constants/orderItem';
import {
  PRODUCT_FORM,
  PRODUCT_DOWNLOAD_DOCUMENTS,
  PRODUCT_DOCUMENT_DELETE,
  PRODUCT_PROVIDER_DOWNLOAD_DOCUMENTS,
  PRODUCT_PROVIDER_DOCUMENT_DELETE,
} from 'modules/permission/constants/product';
import {
  SHIPMENT_FORM,
  SHIPMENT_DOWNLOAD_DOCUMENTS,
  SHIPMENT_DOCUMENT_DELETE,
} from 'modules/permission/constants/shipment';
import { PROJECT_FORM } from 'modules/permission/constants/project';
import {
  MILESTONE_DOCUMENTS_DOWNLOAD,
  MILESTONE_DOCUMENT_DELETE,
} from 'modules/permission/constants/milestone';
import { DOCUMENT_FORM, DOCUMENT_DELETE } from 'modules/permission/constants/file';
import { getParentInfo } from 'utils/task';
import { deleteFileMutation } from './mutation';

type Props = {
  files: Array<FilePayload>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  afterDelete?: (fileId: string) => void,
  renderItem?: (item: FilePayload, afterDelete?: (fileId: string) => void) => React$Node,
};

const defaultRenderItem = (file: FilePayload, afterDelete?: (fileId: string) => void): React$Node =>
  file?.uploading ? (
    <UploadPlaceholder progress={file?.progress ?? 0} height="159px" key={file?.id} />
  ) : (
    <PartnerPermissionsWrapper key={file?.id ?? ''} data={file}>
      {permissions => {
        const { parentType } = getParentInfo(file?.entity ?? {});
        const [isOpen, setIsOpen] = React.useState(false);
        const hasPermission = React.useCallback(
          (checkPermission: string | Array<string>) => {
            if (Array.isArray(checkPermission)) {
              return intersection(permissions, checkPermission).length > 0;
            }
            return permissions.includes(checkPermission);
          },
          [permissions]
        );

        const viewPermissions = {
          order: hasPermission(ORDER_FORM),
          orderItem: hasPermission(ORDER_ITEMS_FORM),
          shipment: hasPermission(SHIPMENT_FORM),
          product: hasPermission(PRODUCT_FORM),
          productProvider: hasPermission(PRODUCT_FORM),
          project: hasPermission(PROJECT_FORM),
        };
        const downloadPermissions = {
          order: hasPermission(ORDER_DOWNLOAD_DOCUMENTS),
          orderItem: hasPermission(ORDER_ITEMS_DOWNLOAD_DOCUMENTS),
          shipment: hasPermission(SHIPMENT_DOWNLOAD_DOCUMENTS),
          product: hasPermission(PRODUCT_DOWNLOAD_DOCUMENTS),
          productProvider: hasPermission(PRODUCT_PROVIDER_DOWNLOAD_DOCUMENTS),
          project: hasPermission(MILESTONE_DOCUMENTS_DOWNLOAD),
        };
        const deletePermissions = {
          order: hasPermission(ORDER_DOCUMENT_DELETE) || hasPermission(DOCUMENT_DELETE),
          orderItem: hasPermission(ORDER_ITEMS_DOCUMENT_DELETE) || hasPermission(DOCUMENT_DELETE),
          shipment: hasPermission(SHIPMENT_DOCUMENT_DELETE) || hasPermission(DOCUMENT_DELETE),
          product: hasPermission(PRODUCT_DOCUMENT_DELETE) || hasPermission(DOCUMENT_DELETE),
          productProvider:
            hasPermission(PRODUCT_PROVIDER_DOCUMENT_DELETE) || hasPermission(DOCUMENT_DELETE),
          project: hasPermission(MILESTONE_DOCUMENT_DELETE) || hasPermission(DOCUMENT_DELETE),
        };
        const onCancel = () => setIsOpen(false);
        const [deleteFile, { loading: isProcessing }] = useMutation(deleteFileMutation);
        const onConfirm = () => {
          deleteFile({
            variables: {
              id: file.id,
            },
          }).then(() => {
            if (afterDelete) afterDelete(file.id);
            setIsOpen(false);
          });
        };

        return (
          <>
            <ActionDialog
              isOpen={isOpen}
              isProcessing={isProcessing}
              onCancel={onCancel}
              title={
                <FormattedMessage id="modules.RelationMap.label.delete" defaultMessage="DELETE" />
              }
              dialogMessage={
                isProcessing ? (
                  <FormattedMessage
                    id="modules.documents.deleteFile.deleting"
                    defaultMessage="Deleting {fileLabel} ..."
                    values={{ fileLabel: <FileLabelIcon /> }}
                  />
                ) : (
                  <FormattedMessage
                    id="modules.documents.deleteBatch.message1"
                    defaultMessage="Are you sure you want to delete this {fileLabel} ?"
                    values={{ fileLabel: <FileLabelIcon /> }}
                  />
                )
              }
              buttons={
                <BaseButton
                  label={
                    <FormattedMessage
                      id="modules.RelationMap.label.delete"
                      defaultMessage="DELETE"
                    />
                  }
                  icon="REMOVE"
                  onClick={onConfirm}
                  backgroundColor="RED"
                  hoverBackgroundColor="RED_DARK"
                />
              }
            />
            <DocumentCard
              file={file}
              navigable={viewPermissions?.[parentType] || !parentType}
              downloadable={downloadPermissions?.[parentType] || !parentType}
              editable={{
                status: false,
                type: false,
                memo: false,
              }}
              onClick={evt => {
                evt.stopPropagation();
                if (hasPermission(DOCUMENT_FORM) || !parentType) {
                  navigate(`/document/${encodeId(file.id)}`);
                }
              }}
              showActionsOnHover
              actions={[
                ...(deletePermissions?.[parentType] || !parentType
                  ? [
                      <CardAction
                        icon="REMOVE"
                        hoverColor="RED"
                        onClick={evt => {
                          evt.stopPropagation();
                          setIsOpen(true);
                        }}
                      />,
                    ]
                  : []),
              ]}
            />
          </>
        );
      }}
    </PartnerPermissionsWrapper>
  );

const DocumentGridView = ({
  files,
  onLoadMore,
  hasMore,
  isLoading,
  afterDelete,
  renderItem = defaultRenderItem,
}: Props): React$Node => {
  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={files.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.Documents.noDocumentFound" defaultMessage="No files found" />
      }
    >
      {files.map(file => renderItem(file, afterDelete))}
    </GridView>
  );
};

export default DocumentGridView;
