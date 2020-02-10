// @flow
import * as React from 'react';
import type { MaskEdit } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { BaseButton } from 'components/Buttons';
import ActionDialog, { TableTemplateLabelIcon } from 'components/Dialog/ActionDialog';
import { deleteTableTemplateMutation } from './mutation';

type Props = {|
  entity: MaskEdit,
  isOpen: boolean,
  onSuccess: (tableTemplateId: string) => void,
  onCancel: () => void,
|};

export default function DeleteTableTemplateConfirm({ onSuccess, onCancel, entity, isOpen }: Props) {
  const [deleteTableTemplate, { loading: isProcessing }] = useMutation(deleteTableTemplateMutation);

  const onConfirm = () => {
    deleteTableTemplate({
      variables: {
        id: entity.id,
      },
    })
      .then(() => {
        onSuccess(entity.id);
      })
      .catch(() => {});
  };

  let dialogMessage = null;

  if (isProcessing) {
    // Is currently deleting
    dialogMessage = (
      <FormattedMessage
        id="modules.TableTemplates.deleteTableTemplate.deleting"
        defaultMessage="Deleting {templateLabel} ..."
        values={{ templateLabel: <TableTemplateLabelIcon /> }}
      />
    );
  } else {
    // Has permission to delete
    dialogMessage = (
      <FormattedMessage
        id="modules.TableTemplates.deleteTableTemplate.message1"
        defaultMessage="Are you sure you want to delete this {templateLabel}?"
        values={{ templateLabel: <TableTemplateLabelIcon /> }}
      />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={isProcessing}
      onCancel={onCancel}
      title={<FormattedMessage id="modules.TableTemplates.label.delete" defaultMessage="DELETE" />}
      dialogMessage={dialogMessage}
      buttons={
        <BaseButton
          label={
            <FormattedMessage id="modules.TableTemplates.label.delete" defaultMessage="DELETE" />
          }
          icon="REMOVE"
          onClick={onConfirm}
          backgroundColor="RED"
          hoverBackgroundColor="RED_DARK"
        />
      }
    />
  );
}
