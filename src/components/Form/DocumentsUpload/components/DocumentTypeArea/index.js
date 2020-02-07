// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { useDrop } from 'react-dnd';
import type { FilePayload } from 'generated/graphql';
import BaseCard, { CardAction } from 'components/Cards';
import FormattedNumber from 'components/FormattedNumber';
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
  DummyDocumentCard,
} from './style';

type Props = {|
  entityType: string,
  type: { value: string, label: React$Node },
  types: Array<string>,
  files: Array<FilePayload>,
  onSave: Function,
  onUpload: Function,
  canUpload: boolean,
  canAddOrphan: boolean,
  canViewForm: boolean,
  canDownload: boolean,
  canChangeType: boolean,
  canDelete: boolean,
|};

const DocumentTypeArea = ({
  entityType,
  type,
  types,
  files,
  onSave,
  onUpload,
  canUpload,
  canAddOrphan,
  canViewForm,
  canDownload,
  canChangeType,
  canDelete,
}: Props) => {
  const otherTypes = types.filter(t => t !== type);

  const [{ isDraggedOver, canDrop }, dropRef] = useDrop({
    accept: otherTypes,
    canDrop: item => item.type !== type.value,
    drop: item => ({ ...item, type: type.value }),
    collect: monitor => ({
      isDraggedOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  console.warn(canDownload);

  return (
    <div className={DocumentTypeAreaWrapperStyle(isDraggedOver && canDrop)} ref={dropRef}>
      <div className={DocumentTypeAreaHeaderStyle}>
        <Label>
          {type.label}
          {' ('}
          <FormattedNumber value={files.length} />)
        </Label>

        <GridRow gap="5px">
          {canAddOrphan && (
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
                      onSelect={selectedFiles => {
                        onSave([
                          ...files,
                          ...selectedFiles.map(file => ({
                            ...file,
                            entity: { __typename: entityType },
                          })),
                        ]);
                        setDocumentsSelectorIsOpen(false);
                      }}
                      alreadyAddedDocuments={files}
                    />
                  </SlideView>
                </>
              )}
            </BooleanValue>
          )}

          {canUpload && (
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

      {files.length > 0 && (
        <div className={DocumentTypeAreaBodyStyle}>
          {files.map(file => (
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
                      onSave(files.map(f => (f.id === item.id ? { ...f, type: item.type } : f)));
                    }}
                  >
                    <BaseCard
                      icon="DOCUMENT"
                      color="DOCUMENT"
                      onClick={evt => {
                        evt.stopPropagation();
                        if (canViewForm) {
                          setDocumentFormIsOpen(true);
                        }
                      }}
                      actions={[
                        canDelete && (
                          <CardAction
                            icon="REMOVE"
                            hoverColor="RED"
                            onClick={evt => {
                              evt.stopPropagation();
                              onSave(files.filter(item => item.id !== file.id));
                            }}
                          />
                        ),
                      ].filter(Boolean)}
                    >
                      <div className={DummyDocumentCard}>{file.id}</div>
                    </BaseCard>
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
                        onSave(files.map(f => (f.id === updatedFile.id ? updatedFile : f)));
                        setDocumentFormIsOpen(false);
                      }}
                    />
                  </SlideView>
                </>
              )}
            </BooleanValue>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentTypeArea;
