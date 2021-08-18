// @flow
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import type { FilePayload } from 'generated/graphql';
import { cx } from 'react-emotion';
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
import useDocumentTypePermission from './hooks/useDocumentTypePermission';
import fileUploadMutation from './mutation';
import { DocumentTypeArea } from './components';
import { DocumentsDragAndDropTooltipWrapperStyle, DocumentsUploadWrapperStyle } from './style';
import messages from './messages';

type Props = {|
  files: Array<FilePayload>,
  entity: 'Order' | 'OrderItem' | 'Shipment' | 'ProductProvider' | 'Milestone',
  onSave: (Array<FilePayload>) => void,
  canUpload: boolean,
  canAddOrphan: boolean,
  canViewForm: boolean,
  canDownload: boolean,
  canChangeType: boolean,
  canDelete: boolean,
  uploadWrapperStyle: string,
  isInDialog?: boolean,
|};

type UploadFileState = {
  id: string,
  name: string,
  path: string,
  type: string,
  tags: Array<Object>,
  memo: string,
  entity?: Object,
  createdAt: string,
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
  'createdAt',
  'ownedBy',
  'orphan',
  '__typename',
];

const DocumentsUpload = ({
  files,
  entity,
  onSave,
  canUpload,
  canAddOrphan,
  canViewForm,
  canDownload,
  canChangeType,
  canDelete,
  isInDialog = false,
  uploadWrapperStyle,
}: Props) => {
  const intl = useIntl();
  const [upload] = useMutation(fileUploadMutation);
  const [filesState, setFileState] = React.useState<
    Array<{
      ...UploadFileState,
      tags: [],
      uploading: boolean,
      progress: number,
    }>
  >([]);
  const filesStateRef = React.useRef(filesState);
  const previousFilesRef = React.useRef<Array<UploadFileState>>([]);

  // TODO: to transfer somewhere else
  const documentTypePermissions = useDocumentTypePermission({ entity });

  React.useEffect(() => {
    filesStateRef.current = filesState;
  }, [filesState]);

  if (
    !isEquals(
      (files ?? []).map(pick(editableFields)),
      (previousFilesRef.current ?? []).map(pick(editableFields))
    )
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
        createdAt: '',
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
            tags: [],
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

  const documentsBody = (
    <DndProvider backend={HTML5Backend}>
      <div className={cx(DocumentsUploadWrapperStyle, uploadWrapperStyle)}>
        {types.map(type => {
          const canSet = documentTypePermissions[type.value]?.canSet;

          return (
            <DocumentTypeArea
              key={type.value}
              entityType={entity}
              type={type}
              types={types.map(t => t.value)}
              allFiles={filesState}
              files={filesState.filter(file => file.type === type.value)}
              onSave={updatedValues =>
                onSave([...files.filter(file => file.type !== type.value), ...updatedValues])
              }
              onUpload={evt => handleUpload(evt, type.value)}
              canUpload={canSet ?? canUpload}
              canAddOrphan={canSet ?? canAddOrphan}
              canViewForm={canSet ?? canViewForm}
              canDownload={canSet ?? canDownload}
              canChangeType={canSet ?? canChangeType}
              canDelete={canSet ?? canDelete}
            />
          );
        })}
      </div>
    </DndProvider>
  );

  return isInDialog ? (
    documentsBody
  ) : (
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
      {documentsBody}
    </StickyScrollingSection>
  );
};

export default DocumentsUpload;
