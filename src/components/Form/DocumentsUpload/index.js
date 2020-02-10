// @flow
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import type { FilePayload } from 'generated/graphql';
import { FormattedMessage, useIntl } from 'react-intl';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { pick } from 'lodash/fp';
import Icon from 'components/Icon';
import { uuid } from 'utils/id';
import { isEquals } from 'utils/fp';
import logger from 'utils/logger';
import { getFileTypesByEntity } from 'components/Cards/DocumentCard';
import { Tooltip } from 'components/Tooltip';
import { SectionHeader } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import { StickyScrollingSection } from 'components/Sections';
import fileUploadMutation from './mutation';
import { DocumentTypeArea } from './components';
import { DocumentsDragAndDropTooltipWrapperStyle, DocumentsUploadWrapperStyle } from './style';
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
  editable: { type: boolean },
|};

type UploadFileState = {
  id: string,
  name: string,
  path: string,
  type: string,
  tags: Array<Object>,
  memo: string,
  entity?: Object,
};

const editableFields = ['id', 'type', 'name', 'path', 'tags', 'memo'];
const SELECTED_FIELDS = [
  'id',
  'type',
  'name',
  'path',
  'size',
  'tags',
  'memo',
  'tags',
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
  editable,
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
        memo: '',
        tags: [],
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
                files={filesState.filter(file => file.type === type.value)}
                onSave={updatedValues =>
                  onSave([...files.filter(file => file.type !== type.value), ...updatedValues])
                }
                onUpload={evt => handleUpload(evt, type.value)}
                canUpload={uploadable}
                canAddOrphan={addable}
                canViewForm={viewForm}
                canDownload={downloadable}
                canChangeType={editable.type}
                canDelete={removable}
              />
            );
          })}
        </div>
      </DndProvider>
    </StickyScrollingSection>
  );
};

export default DocumentsUpload;
