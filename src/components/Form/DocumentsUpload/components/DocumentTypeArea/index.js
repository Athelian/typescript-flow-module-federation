// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import type { FilePayload } from 'generated/graphql';
import FormattedNumber from 'components/FormattedNumber';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import { BaseButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
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
  files: Array<FilePayload>,
  onUpload: Function,
  uploadable: boolean,
  onAdd: Function,
  addable: boolean,
|};

const DocumentTypeArea = ({
  entityType,
  type,
  files,
  onUpload,
  uploadable,
  onAdd,
  addable,
}: Props) => {
  return (
    <div className={DocumentTypeAreaWrapperStyle}>
      <div className={DocumentTypeAreaHeaderStyle}>
        <Label>
          {type.label}
          {' ('}
          <FormattedNumber value={files.length} />)
        </Label>

        {addable && (
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
                      onAdd([
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

        {uploadable && (
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
      </div>

      {files.length > 0 && (
        <div className={DocumentTypeAreaBodyStyle}>
          {files.map(file => (
            <div className={DummyDocumentCard} key={file.id}>
              {file.id}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentTypeArea;
