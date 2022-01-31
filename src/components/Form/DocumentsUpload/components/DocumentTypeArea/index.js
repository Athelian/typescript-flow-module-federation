// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { useDrop } from 'react-dnd';
import Dropzone from 'react-dropzone';
import type { FilePayload } from 'generated/graphql';
import { canViewFile } from 'utils/file';
import { useViewerHasPermissions } from 'contexts/Permissions';
import { isForbidden } from 'utils/data';
import { DocumentCard, CardAction } from 'components/Cards';
import FormattedNumber from 'components/FormattedNumber';
import UploadPlaceholder from 'components/UploadPlaceholder';
import Icon from 'components/Icon';
import GridRow from 'components/GridRow';
import { Label } from 'components/Form';
import { BaseButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import DocumentFormSlideView from 'modules/document/index.formSlideView';
import DocumentDragWrapper from './DocumentDragWrapper';
import DocumentsSelector from './DocumentsSelector';
import {
  DocumentTypeAreaWrapperStyle,
  DocumentTypeAreaHeaderStyle,
  AddDocumentButtonWrapperStyle,
  AddDocumentButtonLabelStyle,
  AddDocumentButtonIconStyle,
  DocumentTypeAreaBodyStyle,
} from './style';

type Props = {|
  entityType: string,
  type: { value: string, label: React$Node },
  types: Array<string>,
  allFiles: Array<FilePayload>,
  files: Array<FilePayload>,
  onSave: Function,
  onUpload: Function,
  canUpload: boolean,
  canAddOrphan: boolean,
  canViewForm: boolean,
  canDownload: boolean,
  canChangeType: boolean,
  canDelete: boolean,
  isMultiSelect: boolean,
  selectedFiles: Object,
  onDocumentClicked: (file: Object) => void,
|};

const DocumentTypeArea = ({
  entityType,
  type,
  types,
  allFiles,
  files,
  onSave,
  onUpload,
  canUpload,
  canAddOrphan,
  canViewForm,
  canDownload,
  canChangeType,
  canDelete,
  isMultiSelect,
  selectedFiles,
  onDocumentClicked,
}: Props) => {
  const hasPermissions = useViewerHasPermissions();
  const canView = canViewFile(hasPermissions, type.value, entityType);
  const otherTypes = types.filter(t => t !== type);

  const [{ isDraggedOver, canDrop }, dropRef] = useDrop({
    accept: otherTypes,
    canDrop: item => {
      return canUpload && item.type !== type.value;
    },
    drop: item => ({ ...item, type: type.value }),
    collect: monitor => ({
      isDraggedOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <Dropzone onDrop={onUpload}>
      {({ getRootProps: dropZoneProps, isDragActive: isDraggingFilesOver }) => (
        <div {...dropZoneProps()}>
          <div
            className={DocumentTypeAreaWrapperStyle(
              (isDraggedOver && canDrop && canView) || (canView && canUpload && isDraggingFilesOver)
            )}
            ref={dropRef}
          >
            <div className={DocumentTypeAreaHeaderStyle}>
              <Label>
                {type.label}
                {' ('}
                <FormattedNumber value={files.length} />)
              </Label>

              <GridRow gap="5px">
                {canView && canAddOrphan && (
                  <BooleanValue>
                    {({ value: documentsSelectorIsOpen, set: setDocumentsSelectorIsOpen }) => (
                      <>
                        <BaseButton
                          label={
                            <FormattedMessage
                              id="modules.Documents.selectDocument"
                              defaultMessage="Select Documents"
                            />
                          }
                          icon="ADD"
                          onClick={() => setDocumentsSelectorIsOpen(true)}
                          textColor="WHITE"
                          hoverTextColor="WHITE"
                          backgroundColor="GRAY_LIGHT"
                          hoverBackgroundColor="GRAY"
                        />

                        <SlideView
                          isOpen={documentsSelectorIsOpen}
                          onRequestClose={() => setDocumentsSelectorIsOpen(false)}
                          shouldConfirm={() => {
                            const button = document.getElementById('saveButtonOnSelectDocuments');
                            return button;
                          }}
                        >
                          <DocumentsSelector
                            onCancel={() => setDocumentsSelectorIsOpen(false)}
                            onSelect={newSelectedFiles => {
                              onSave([
                                ...files,
                                ...newSelectedFiles.map(file => ({
                                  ...file,
                                  type: type.value,
                                  entity: { __typename: entityType },
                                })),
                              ]);
                              setDocumentsSelectorIsOpen(false);
                            }}
                            alreadyAddedDocuments={allFiles}
                          />
                        </SlideView>
                      </>
                    )}
                  </BooleanValue>
                )}

                {canUpload && canView && (
                  <label className={AddDocumentButtonWrapperStyle}>
                    <div className={AddDocumentButtonLabelStyle}>
                      <FormattedMessage
                        id="documents.button.uploadDocuments"
                        defaultMessage="Upload Documents"
                      />
                    </div>
                    <div className={AddDocumentButtonIconStyle}>
                      <Icon icon="UPLOAD" />
                    </div>
                    <input type="file" accept="*" hidden multiple value="" onChange={onUpload} />
                  </label>
                )}
              </GridRow>
            </div>

            {canView && files.length > 0 && (
              <div className={DocumentTypeAreaBodyStyle}>
                {files
                  .filter(file => !isForbidden(file))
                  .map(file =>
                    file.uploading ? (
                      <UploadPlaceholder
                        progress={file.progress ?? 0}
                        height="134px"
                        key={file.id}
                      />
                    ) : (
                      <BooleanValue key={file.id}>
                        {({ value: documentFormIsOpen, set: setDocumentFormIsOpen }) => (
                          <>
                            <DocumentDragWrapper
                              item={{
                                id: file.id,
                                type: type.value,
                              }}
                              canChangeType={canChangeType}
                              onChangeType={item => {
                                onSave(
                                  files.map(f => (f.id === item.id ? { ...f, type: item.type } : f))
                                );
                              }}
                            >
                              <DocumentCard
                                file={file}
                                hideParentInfo
                                downloadable={canDownload}
                                onClick={evt => {
                                  evt.stopPropagation();
                                  if (isMultiSelect) {
                                    onDocumentClicked(file);
                                  } else if (canViewForm) {
                                    setDocumentFormIsOpen(true);
                                  }
                                }}
                                selectable={isMultiSelect}
                                selected={selectedFiles[file.id]}
                                showActionsOnHover
                                actions={[
                                  canDelete && (
                                    <CardAction
                                      icon="REMOVE_ALT"
                                      hoverColor="RED"
                                      onClick={evt => {
                                        evt.stopPropagation();
                                        onSave(files.filter(item => item.id !== file.id));
                                      }}
                                    />
                                  ),
                                ].filter(Boolean)}
                              />
                            </DocumentDragWrapper>

                            <SlideView
                              isOpen={documentFormIsOpen}
                              onRequestClose={() => setDocumentFormIsOpen(false)}
                              shouldConfirm={() => {
                                const button = document.getElementById('document_form_save_button');
                                return button;
                              }}
                            >
                              <DocumentFormSlideView
                                isNew={file.isNew}
                                file={file}
                                onSave={updatedFile => {
                                  onSave(
                                    files.map(f => (f.id === updatedFile.id ? updatedFile : f))
                                  );
                                  setDocumentFormIsOpen(false);
                                }}
                              />
                            </SlideView>
                          </>
                        )}
                      </BooleanValue>
                    )
                  )}
              </div>
            )}
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default DocumentTypeArea;
