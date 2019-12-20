// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { useAuthorizedViewer } from 'contexts/Viewer';
import SlideView from 'components/SlideView';
import DocumentFormSideView from 'modules/document/index.formSlideView';
import { DocumentsInput, SectionWrapper, SectionHeader } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';

type Props = {|
  sectionId: string,
  entityType: string,
  container: Object,
  canUpload: boolean,
  canDownload: boolean,
  canRemove: boolean,
  canUpdateType: boolean,
  canUpdateStatus: boolean,
  canUpdateMemo: boolean,
  entityOwnedBy: Object,
|};

export default function DocumentsSection({
  sectionId,
  entityType,
  container,
  canUpload,
  canDownload,
  canRemove,
  canUpdateType,
  canUpdateStatus,
  canUpdateMemo,
  entityOwnedBy,
}: Props) {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const { organization } = useAuthorizedViewer();
  return (
    <Subscribe to={[container]}>
      {({ state: { files = [] }, setFieldValue }) => {
        return (
          <div>
            <SectionWrapper id={sectionId}>
              <SectionHeader
                icon="DOCUMENT"
                title={
                  <>
                    <FormattedMessage id="modules.OrderItems.document" defaultMessage="DOCUMENTS" />{' '}
                    (
                    <FormattedNumber value={files.length} />)
                  </>
                }
              />
              <DocumentsInput
                entity={entityType}
                files={files}
                removable={canRemove}
                uploadable={canUpload}
                editable={{
                  status: canUpdateStatus,
                  type: canUpdateType,
                  memo: canUpdateMemo,
                }}
                downloadable={canDownload}
                onSave={updateFiles => setFieldValue('files', updateFiles)}
                onSelect={file =>
                  setSelectedFile({
                    ...file,
                    ownedBy: file.ownedBy || organization,
                    entity: { ...file.entity, ownedBy: file.entity?.ownedBy ?? entityOwnedBy },
                  })
                }
              />
            </SectionWrapper>
            <SlideView
              isOpen={!!selectedFile}
              onRequestClose={() => setSelectedFile(null)}
              shouldConfirm={() => {
                const button = document.getElementById('document_form_save_button');
                return button;
              }}
            >
              {selectedFile && (
                <DocumentFormSideView
                  file={selectedFile}
                  onSave={updatedFile => {
                    setFieldValue(
                      'files',
                      files.map(file => (file.id === updatedFile.id ? updatedFile : file))
                    );
                    setSelectedFile(null);
                  }}
                />
              )}
            </SlideView>
          </div>
        );
      }}
    </Subscribe>
  );
}
