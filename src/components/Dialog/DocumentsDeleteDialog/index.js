// @flow
import * as React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { BaseButton } from 'components/Buttons';
import ActionDialog, {
  ItemLabelIcon,
  MilestoneLabelIcon,
  EndProductLabelIcon,
  FileLabelIcon,
  FilesLabelIcon,
} from 'components/Dialog/ActionDialog';

type Props = {|
  entityType: string,
  isMultiple?: boolean,
  files: any,
  isOpen: boolean,
  isProcessing?: boolean,
  onDelete: Function,
  onKeep?: Function,
  onCancel?: Function,
|};

const generateEntityIcon = (type: string) => {
  switch (type) {
    case 'ITEM':
      return <ItemLabelIcon />;

    case 'END_PRODUCT':
      return <EndProductLabelIcon />;

    case 'MILESTONE':
      return <MilestoneLabelIcon />;

    default:
      return '';
  }
};

export default function DocumentsDeleteDialog({
  entityType,
  isMultiple = false,
  files,
  isOpen,
  isProcessing,
  onDelete = () => {},
  onKeep = () => {},
  onCancel = () => {},
}: Props) {
  const dialogMessage = defineMessages({
    single: {
      id: 'components.DocumentsDeleteDialog.message',
      defaultMessage: 'This {entityIcon} has {fileCount} {fileIcon}.',
      values: {
        entityIcon: generateEntityIcon(entityType),
        fileCount: files.length,
        fileIcon: <FileLabelIcon />,
      },
    },
    multiple: {
      id: 'components.DocumentsDeleteDialog.message.multiple',
      defaultMessage: 'These {entityIcon} have {fileCount} {fileIcon}.',
      values: {
        entityIcon: generateEntityIcon(entityType),
        fileCount: files.length,
        fileIcon: <FilesLabelIcon />,
      },
    },
  });

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={isProcessing}
      onCancel={onCancel}
      title={
        <FormattedMessage
          id="components.DocumentsDeleteDialog.title"
          defaultMessage="Delete or Keep"
        />
      }
      dialogMessage={
        isMultiple ? (
          <FormattedMessage {...dialogMessage.multiple} />
        ) : (
          <FormattedMessage {...dialogMessage.single} />
        )
      }
      dialogSubMessage={
        <FormattedMessage
          id="components.DocumentsDeleteDialog.subMessage"
          defaultMessage="Would you also like to delete these {fileIcon} or keep them, making them parentless?"
          values={{
            fileIcon: <FilesLabelIcon />,
          }}
        />
      }
      buttons={[
        <BaseButton
          key="btn-keep"
          label={
            <FormattedMessage id="components.DocumentsDeleteDialog.keep" defaultMessage="KEEP" />
          }
          onClick={() => {
            onKeep(files);
          }}
        />,

        <BaseButton
          key="btn-delete"
          label={
            <FormattedMessage
              id="components.DocumentsDeleteDialog.delete"
              defaultMessage="DELETE"
            />
          }
          onClick={() => {
            onDelete(files);
          }}
        />,
      ]}
    />
  );
}
