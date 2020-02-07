// @flow
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import type { FilePayload } from 'generated/graphql';
import { FormattedMessage, useIntl } from 'react-intl';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { pick } from 'lodash/fp';
import Dropzone from 'react-dropzone';
import update from 'immutability-helper';
import Icon from 'components/Icon';
import { uuid } from 'utils/id';
import { isEquals } from 'utils/fp';
import logger from 'utils/logger';
import UploadPlaceholder from 'components/UploadPlaceholder';
import { CardAction } from 'components/Cards';
import DocumentCard, { getFileTypesByEntity } from 'components/Cards/DocumentCard';
import { Tooltip } from 'components/Tooltip';
import { SectionHeader } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import { StickyScrollingSection } from 'components/Sections';
import fileUploadMutation from './mutation';
import { DocumentTypeArea } from './components';
import {
  DocumentsDragAndDropTooltipWrapperStyle,
  DocumentsUploadWrapperStyle,
  DocumentsDragAndDropBodyWrapperStyle,
  DocumentsSectionBodyStyle,
  DocumentsDragAndDropWrapperStyle,
  DocumentsDragAndDropLabelStyle,
  DocumentsListStyle,
} from './style';
import messages from './messages';

type Props = {|
  files: Array<FilePayload>,
  onSave: (Array<FilePayload>) => void,
  entity: 'Order' | 'OrderItem' | 'Shipment' | 'ProductProvider' | 'Milestone',
  downloadable: boolean,
  viewForm: boolean,
  uploadable: boolean,
  addable: boolean,
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
  'size',
  'status',
  'memo',
  'entity',
  'ownedBy',
  'orphan',
  '__typename',
];

const DocumentsUpload = ({
  files,
  entity,
  uploadable,
  addable,
  removable,
  downloadable,
  viewForm,
  onSave,
}: Props) => {
  const intl = useIntl();
  const [upload] = useMutation(fileUploadMutation);
  const [filesState, setFileState] = React.useState<
    Array<{
      ...UploadFileState,
      uploading: boolean,
      progress: number,
    }>
  >([]);
  const filesStateRef = React.useRef(filesState);
  const previousFilesRef = React.useRef<Array<UploadFileState>>([]);

  React.useEffect(() => {
    filesStateRef.current = filesState;
  }, [filesState]);

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

  const types = getFileTypesByEntity(entity, intl);

  const handleUpload = (
    event: SyntheticInputEvent<HTMLInputElement> | Array<File>,
    type: string
  ) => {
    let newFiles = [];
    if (Array.isArray(event)) {
      newFiles = event;
    } else {
      event.preventDefault();
      newFiles = Array.from(event.target.files);
    }

    const currentNumberOfFiles = filesState.length;

    setFileState([
      ...filesState,
      ...newFiles.map(({ name }) => ({
        name,
        type,
        id: uuid(),
        path: '',
        status: 'Draft',
        memo: '',
        uploading: true,
        progress: 0,
        isNew: true,
      })),
    ]);

    Promise.all<any>(
      newFiles.map((file, index) =>
        upload({
          variables: {
            file,
            input: {
              status: 'Draft',
              type,
            },
          },
          context: ({
            fetchOptions: {
              onProgress: (progressEvent: ProgressEvent) => {
                const { lengthComputable, loaded, total } = progressEvent;
                if (lengthComputable) {
                  setFileState(
                    filesStateRef.current.map((fileState, idx) => ({
                      ...fileState,
                      progress:
                        idx === index + currentNumberOfFiles
                          ? Math.round((loaded / total) * 100)
                          : fileState.progress,
                    }))
                  );
                }
              },
            },
          }: any),
        })
      )
    )
      .then(uploadResults => {
        onSave([
          ...files,
          ...uploadResults.map(({ data }) => ({
            ...data.fileUpload,
            uploading: false,
            progress: 100,
            entity: {
              __typename: entity,
            },
            isNew: true,
          })),
        ]);
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

  return (
    <StickyScrollingSection
      sectionHeader={
        <SectionHeader
          icon="DOCUMENT"
          title={
            <>
              <FormattedMessage id="components.section.documents" defaultMessage="Documents" /> (
              <FormattedNumber value={files.length} />)
            </>
          }
        />
      }
      navbarContent={
        <Tooltip message={<FormattedMessage {...messages.dragAndDrop} />}>
          <div className={DocumentsDragAndDropTooltipWrapperStyle}>
            <Icon icon="INFO" />
          </div>
        </Tooltip>
      }
    >
      <DndProvider backend={HTML5Backend}>
        <div className={DocumentsUploadWrapperStyle}>
          {types.map(type => {
            return (
              <DocumentTypeArea
                key={type.value}
                entityType={entity}
                type={type}
                types={types.map(t => t.value)}
                files={files.filter(file => file.type === type.value)}
                onSave={onSave}
                onUpload={evt => handleUpload(evt, type.value)}
                canUpload={uploadable}
                canAddOrphan={addable}
                canViewForm={viewForm}
                canDownload={downloadable}
              />
            );
          })}
        </div>
      </DndProvider>

      <Dropzone onDrop={handleUpload}>
        {({ getRootProps, isDragActive }) => (
          <div {...getRootProps()} className={DocumentsDragAndDropBodyWrapperStyle}>
            <div className={DocumentsSectionBodyStyle}>
              {filesState && filesState.length > 0 && (
                <div className={DocumentsListStyle}>
                  {filesState.map((file, index) => {
                    if (filesState.length > 0 && filesState[index].uploading) {
                      return (
                        <UploadPlaceholder
                          progress={filesState.length > 0 ? filesState[index].progress : 0}
                          key={file?.id}
                        />
                      );
                    }
                    return (
                      <DocumentCard
                        hideParentInfo
                        file={pick(SELECTED_FIELDS, file)}
                        onClick={evt => {
                          evt.stopPropagation();
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
                              onClick={evt => {
                                evt.stopPropagation();
                                onSave(files.filter(item => item?.id !== file?.id));
                              }}
                            />
                          ),
                        ].filter(Boolean)}
                        downloadable={downloadable}
                        key={file?.id}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div className={DocumentsDragAndDropWrapperStyle(isDragActive)}>
              <div className={DocumentsDragAndDropLabelStyle}>
                <FormattedMessage {...messages.newDocument} />
                <Icon icon="ADD" />
              </div>
            </div>
          </div>
        )}
      </Dropzone>
    </StickyScrollingSection>
  );
};

export default DocumentsUpload;
