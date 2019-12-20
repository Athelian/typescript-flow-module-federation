// @flow
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import type { FilePayload } from 'generated/graphql';
import { FormattedMessage, useIntl } from 'react-intl';
import { pick } from 'lodash/fp';
import Dropzone from 'react-dropzone';
import update from 'immutability-helper';
import Icon from 'components/Icon';
import { uuid } from 'utils/id';
import { isEquals, getByPath } from 'utils/fp';
import logger from 'utils/logger';
import SlideView from 'components/SlideView';
import DocumentFormSideView from 'modules/document/index.formSlideView';
import SectionNavBar from 'components/NavBar/SectionNavBar';
import UploadPlaceholder from 'components/UploadPlaceholder';
import { CardAction } from 'components/Cards';
import DocumentCard, { getFileTypesByEntity } from 'components/Cards/DocumentCard';
import { Tooltip } from 'components/Tooltip';
import fileUploadMutation from './mutation';
import {
  DocumentsSectionWrapperStyle,
  DocumentsDragAndDropBodyWrapperStyle,
  DocumentsSectionBodyStyle,
  DocumentsDragAndDropTooltipWrapperStyle,
  DocumentsDragAndDropWrapperStyle,
  DocumentsDragAndDropLabelStyle,
  DocumentsListStyle,
  AddDocumentButtonWrapperStyle,
  AddDocumentButtonLabelStyle,
  AddDocumentButtonIconStyle,
  NoDocumentsStyle,
} from './style';
import messages from './messages';

type Props = {|
  files: Array<FilePayload>,
  onSave: (Array<FilePayload>) => void,
  entity: 'Order' | 'OrderItem' | 'Shipment' | 'ProductProvider' | 'Milestone',
  editable: {
    status: boolean,
    type: boolean,
    memo: boolean,
  },
  downloadable: boolean,
  viewForm: boolean,
  uploadable: boolean,
  removable: boolean,
|};

type UploadFileState = {
  id: string,
  name: string,
  path: string,
  type: string,
  status: string,
  memo: string,
  entity?: Object,
};

const editableFields = ['id', 'type', 'name', 'path', 'status', 'memo'];
const SELECTED_FIELDS = [
  'id',
  'type',
  'name',
  'path',
  'status',
  'memo',
  'entity',
  'ownedBy',
  '__typename',
];

const DocumentsUpload = ({
  files,
  entity,
  editable,
  uploadable,
  removable,
  downloadable,
  viewForm,
  onSave,
}: Props) => {
  const intl = useIntl();
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [upload] = useMutation(fileUploadMutation);
  const [filesState, setFileState] = React.useState<
    Array<{
      ...UploadFileState,
      uploading: boolean,
      progress: number,
    }>
  >([]);
  const previousFilesRef = React.useRef<Array<UploadFileState>>([]);

  if (
    !isEquals(files.map(pick(editableFields)), previousFilesRef.current.map(pick(editableFields)))
  ) {
    previousFilesRef.current = files.map(pick(SELECTED_FIELDS));
    setFileState(
      files.map(pick(SELECTED_FIELDS)).map(item => ({
        ...item,
        progress: 100,
        uploading: false,
      }))
    );
  }

  const handleUpload = (newFiles: Array<Object>) => {
    onSave([...files, ...newFiles]);
  };

  const handleChange = (event: SyntheticInputEvent<HTMLInputElement> | Array<File>) => {
    let newFiles = [];
    if (Array.isArray(event)) {
      newFiles = event;
    } else {
      event.preventDefault();
      newFiles = Array.from(event.target.files);
    }

    const types = getFileTypesByEntity(entity, intl);

    setFileState([
      ...filesState,
      ...newFiles.map(({ name }) => ({
        name,
        type: types[0].value,
        id: uuid(),
        path: '',
        status: 'Draft',
        memo: '',
        uploading: true,
        progress: 0,
      })),
    ]);

    Promise.all<any>(
      newFiles.map(file =>
        upload({
          variables: {
            file,
            input: {
              status: 'Draft',
              type: types[0].value,
            },
          },
        })
      )
    )
      .then(uploadResults => {
        handleUpload(
          uploadResults.map(({ data }) => ({
            ...data.fileUpload,
            uploading: false,
            progress: 100,
            entity: {
              __typename: entity,
            },
          }))
        );
      })
      .catch(error => {
        logger.error(error);
        setFileState(
          files.map(pick(SELECTED_FIELDS)).map(item => ({
            ...item,
            progress: 100,
            uploading: false,
          }))
        );
      });
  };

  const isEditable = Object.keys(editable).some(key => editable[key]);
  return (
    <>
      <div className={DocumentsSectionWrapperStyle}>
        <SectionNavBar>
          {uploadable && (
            <>
              <label className={AddDocumentButtonWrapperStyle}>
                <div className={AddDocumentButtonLabelStyle}>
                  <FormattedMessage {...messages.newDocument} />
                </div>
                <div className={AddDocumentButtonIconStyle}>
                  <Icon icon="ADD" />
                </div>
                <input type="file" accept="*" hidden multiple value="" onChange={handleChange} />
              </label>
            </>
          )}
        </SectionNavBar>

        {isEditable ? (
          <Dropzone onDrop={handleChange}>
            {({ getRootProps, isDragActive }) => (
              <div {...getRootProps()} className={DocumentsDragAndDropBodyWrapperStyle}>
                <div className={DocumentsSectionBodyStyle}>
                  {filesState && filesState.length > 0 ? (
                    <div className={DocumentsListStyle}>
                      {filesState.map((file, index) => {
                        return (
                          <UploadPlaceholder
                            uploading={filesState.length > 0 ? filesState[index].uploading : false}
                            progress={filesState.length > 0 ? filesState[index].progress : 0}
                            key={getByPath('id', file)}
                          >
                            <DocumentCard
                              hideParentInfo
                              file={pick(SELECTED_FIELDS, file)}
                              onClick={evt => {
                                evt.stopPropagation();
                                if (viewForm) setSelectedFile(file);
                              }}
                              onChange={(field, value) => {
                                onSave(
                                  update(files, {
                                    [index]: {
                                      [field]: {
                                        $set: value,
                                      },
                                    },
                                  })
                                );
                              }}
                              actions={[
                                removable && (
                                  <CardAction
                                    icon="REMOVE"
                                    hoverColor="RED"
                                    onClick={() => {
                                      onSave(
                                        files.filter(
                                          item => getByPath('id', item) !== getByPath('id', file)
                                        )
                                      );
                                    }}
                                  />
                                ),
                              ].filter(Boolean)}
                              editable={editable}
                              downloadable={downloadable}
                            />
                          </UploadPlaceholder>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={NoDocumentsStyle}>
                      <FormattedMessage {...messages.noDocuments} />
                    </div>
                  )}
                </div>

                <Tooltip message={<FormattedMessage {...messages.dragAndDrop} />}>
                  <div className={DocumentsDragAndDropTooltipWrapperStyle}>
                    <Icon icon="INFO" />
                  </div>
                </Tooltip>

                <div className={DocumentsDragAndDropWrapperStyle(isDragActive)}>
                  <div className={DocumentsDragAndDropLabelStyle}>
                    <FormattedMessage {...messages.newDocument} />
                    <Icon icon="ADD" />
                  </div>
                </div>
              </div>
            )}
          </Dropzone>
        ) : (
          <div className={DocumentsSectionBodyStyle}>
            {files && files.length > 0 ? (
              <div className={DocumentsListStyle}>
                {files.map(file => (
                  <DocumentCard
                    hideParentInfo
                    onClick={evt => {
                      evt.stopPropagation();
                      if (viewForm) setSelectedFile(file);
                    }}
                    key={getByPath('id', file)}
                    file={pick(SELECTED_FIELDS, file)}
                    editable={editable}
                    downloadable={downloadable}
                  />
                ))}
              </div>
            ) : (
              <div className={NoDocumentsStyle}>
                <FormattedMessage {...messages.noDocuments} />
              </div>
            )}
          </div>
        )}
      </div>
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
              onSave(files.map(file => (file.id === updatedFile.id ? updatedFile : file)));
              setSelectedFile(null);
            }}
          />
        )}
      </SlideView>
    </>
  );
};

export default DocumentsUpload;
