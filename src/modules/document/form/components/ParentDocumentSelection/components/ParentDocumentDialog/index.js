// @flow
import * as React from 'react';
import FormDialog from 'components/Dialog/FormDialog';
import { useIntl } from 'react-intl';
import { DocumentsUpload } from 'components/Form';
import { getFileTypesByEntity } from 'components/Cards/DocumentCard';
import { ParentDialogStyle, ParentDialogUploadBodyStyle } from '../../../../style';

type Props = {
  entity: 'Order' | 'OrderItem' | 'Shipment' | 'ProductProvider' | 'Milestone',
  files: Object | [Object],
  isDialogOpen: boolean,
  onCancel: Function,
  onRequestClose: Function,
  onSave: Function,
};

const ParentDocumentDialog = ({
  entity,
  files,
  isDialogOpen,
  onCancel,
  onRequestClose,
  onSave,
}: Props) => {
  const intl = useIntl();
  const [dialogFiles, setDialogFiles] = React.useState(Array.isArray(files) ? files : [files]);

  React.useEffect(() => {
    const [firstType] = getFileTypesByEntity(entity, intl);

    setDialogFiles(_files => {
      return _files.map(_file => ({
        ..._file,
        type: firstType.value,
      }));
    });
  }, [entity, intl]);

  return (
    <FormDialog
      isOpen={isDialogOpen}
      width="880px"
      onRequestClose={onRequestClose}
      onCancel={onCancel}
      noPadding
      className={ParentDialogStyle}
      onSave={() => onSave(dialogFiles)}
    >
      <DocumentsUpload
        files={dialogFiles}
        isInDialog
        entity={entity}
        uploadWrapperStyle={ParentDialogUploadBodyStyle}
        onSave={updatedFiles => setDialogFiles(updatedFiles)}
        canDownload
        canChangeType
      />
    </FormDialog>
  );
};

export default ParentDocumentDialog;
