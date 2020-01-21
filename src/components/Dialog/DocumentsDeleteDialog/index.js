// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';
import ActionDialog, { ItemLabelIcon, FileLabelIcon } from 'components/Dialog/ActionDialog';

type Props = {
  files: any,
  isOpen: boolean,
  isProcessing?: boolean,
  onCancel?: Function,
};

export default function DocumentsDeleteDialog({ files, isOpen, isProcessing, onCancel }: Props) {
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
        <FormattedMessage
          id="components.DocumentsDeleteDialog.message"
          defaultMessage="This {itemIcon} has {fileCount} {fileIcon}."
          values={{
            itemIcon: <ItemLabelIcon />,
            fileCount: files.length,
            fileIcon: <FileLabelIcon />,
          }}
        />
      }
      dialogSubMessage={
        <FormattedMessage
          id="components.DocumentsDeleteDialog.subMessage"
          defaultMessage="Would you also like to delete these {fileIcon} or keep them, making them parentless?"
          values={{
            fileIcon: <FileLabelIcon />,
          }}
        />
      }
      buttons={[
        <BaseButton
          label={
            <FormattedMessage id="components.DocumentsDeleteDialog.keep" defaultMessage="KEEP" />
          }
          onClick={() => {
            console.log('KEEP files');
          }}
        />,
        <BaseButton
          label={
            <FormattedMessage
              id="components.DocumentsDeleteDialog.delete"
              defaultMessage="DELETE"
            />
          }
          onClick={() => {
            console.log('DELETE files');
          }}
        />,
      ]}
    />
  );
}
