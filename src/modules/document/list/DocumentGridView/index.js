// @flow
import * as React from 'react';
import type { FilePayload } from 'generated/graphql';
import { useMutation } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import { intersection } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { canViewFile, canViewFileForm, canDownloadFile, canDeleteFile } from 'utils/file';
import { encodeId } from 'utils/id';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import UploadPlaceholder from 'components/UploadPlaceholder';
import GridView from 'components/GridView';
import DocumentCard from 'components/Cards/DocumentCard';
import ActionDialog, { FileLabelIcon } from 'components/Dialog/ActionDialog';
import { CardAction } from 'components/Cards';
import { BaseButton } from 'components/Buttons';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { ORDER_ITEMS_FORM } from 'modules/permission/constants/orderItem';
import { PRODUCT_FORM } from 'modules/permission/constants/product';
import { SHIPMENT_GET } from 'modules/permission/constants/shipment';
import { PROJECT_GET } from 'modules/permission/constants/project';
import { getParentInfo } from 'utils/task';

import { deleteFileMutation } from './mutation';

type RenderItemProps = {
  file: FilePayload,
  afterDelete?: (fileId: string) => void,
  onSelect?: (fileId: string) => void,
  isSelected?: boolean,
};

type Props = {
  files: Array<FilePayload>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  afterDelete?: (fileId: string) => void,
  onSelect?: (fileId: string) => void,
  selectedFiles?: { [key: string]: Object },
  renderItem?: (props: RenderItemProps) => React$Node,
};

const defaultRenderItem = ({
  file,
  afterDelete,
  onSelect,
  isSelected,
}: RenderItemProps): React$Node =>
  file?.uploading ? (
    <UploadPlaceholder progress={file?.progress ?? 0} height="184px" key={file?.id} />
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

        const viewParentPermissions = {
          order: hasPermission(ORDER_FORM),
          orderItem: hasPermission(ORDER_ITEMS_FORM),
          shipment: hasPermission(SHIPMENT_GET),
          product: hasPermission(PRODUCT_FORM),
          productProvider: hasPermission(PRODUCT_FORM),
          project: hasPermission(PROJECT_GET),
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

        const canView = canViewFile(hasPermission, file.type, parentType);

        if (!canView) return null;

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
              navigable={viewParentPermissions?.[parentType]}
              downloadable={canDownloadFile(hasPermission, parentType)}
              selectable={!!onSelect}
              selected={isSelected}
              onSelect={onSelect}
              onClick={
                !onSelect
                  ? evt => {
                      evt.stopPropagation();
                      if (canViewFileForm(hasPermission, parentType)) {
                        navigate(`/document/${encodeId(file.id)}`);
                      }
                    }
                  : null
              }
              showActionsOnHover
              actions={[
                ...(!onSelect && canDeleteFile(hasPermission, parentType)
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
  onSelect,
  selectedFiles,
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
      {files.map(file => {
        const isSelected = !!onSelect && !!selectedFiles && !!file.id && !!selectedFiles[file.id];

        return renderItem({
          file,
          afterDelete,
          onSelect,
          isSelected,
        });
      })}
    </GridView>
  );
};

export default DocumentGridView;
