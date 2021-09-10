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
import { downloadFile } from 'utils/file';
import { getFileTypesByEntity } from 'components/Cards/DocumentCard';
import { Tooltip } from 'components/Tooltip';
import { SectionHeader } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import { StickyScrollingSection } from 'components/Sections';
import { BaseButton } from 'components/Buttons';
import { SectionNavBar } from 'components/NavBar';
import GridRow from 'components/GridRow';
import useDocumentTypePermission from './hooks/useDocumentTypePermission';
import fileUploadMutation from './mutation';
import { DocumentTypeArea } from './components';
import {
  DocumentsDragAndDropTooltipWrapperStyle,
  DocumentsUploadWrapperStyle,
  NavContentRightContainer,
  NavContentRightContainerButtons,
} from './style';
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

  const [isMultiSelect, setMultiSelect] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<{ [k: string]: string }>({});

  const filesStateRef = React.useRef(filesState);
  const previousFilesRef = React.useRef<Array<UploadFileState>>([]);

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

  const onDocumentClicked = React.useCallback((file: Object) => {
    setSelectedFiles(oldFiles => {
      if (oldFiles[file.id]) {
        const temp = JSON.parse(JSON.stringify(oldFiles));
        delete temp[file.id];
        return temp;
      }

      return {
        ...oldFiles,
        [file.id]: file,
      };
    });
  }, []);

  const documentsBody = (
    <DndProvider backend={HTML5Backend}>
      <div className={cx(DocumentsUploadWrapperStyle, uploadWrapperStyle)}>
        {types.map(type => {
          const canSetType = documentTypePermissions[type.value]?.canSet;

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
              canUpload={canUpload || canSetType}
              canAddOrphan={canAddOrphan || canSetType}
              canViewForm={canViewForm || canSetType}
              canDownload={canDownload || canSetType}
              canChangeType={canChangeType || canSetType}
              canDelete={canDelete || canSetType}
              isMultiSelect={isMultiSelect}
              selectedFiles={selectedFiles}
              onDocumentClicked={onDocumentClicked}
            />
          );
        })}
      </div>
    </DndProvider>
  );

  const isAllSelected = filesState.length === Object.keys(selectedFiles).length;

  const navbarContent = (
    <>
      <div className={NavContentRightContainer}>
        <div className={NavContentRightContainerButtons}>
          <GridRow>
            {!!Object.keys(selectedFiles).length && (
              <>
                <BaseButton
                  icon="DOWNLOAD"
                  label={<FormattedMessage {...messages.downloadSelected} />}
                  backgroundColor={isMultiSelect ? 'TEAL' : 'GRAY_SUPER_LIGHT'}
                  hoverBackgroundColor={isMultiSelect ? 'TEAL_DARK' : 'GRAY_VERY_LIGHT'}
                  textColor={isMultiSelect ? 'WHITE' : 'GRAY_DARK'}
                  hoverTextColor={isMultiSelect ? 'WHITE' : 'GRAY_DARK'}
                  onClick={e => {
                    e.stopPropagation();
                    const interval = 100;

                    Object.values(selectedFiles).map((selectedFile, index) => {
                      setTimeout(() => {
                        if (
                          selectedFile &&
                          selectedFile.path &&
                          typeof selectedFile.path === 'string' &&
                          selectedFile.name &&
                          typeof selectedFile.name === 'string'
                        ) {
                          const { path, name } = selectedFile;
                          downloadFile(path, name);
                        }
                      }, interval * (index + 1));

                      return null;
                    });
                    setSelectedFiles({});
                  }}
                />
              </>
            )}
            {filesState.length > 0 && (
              <>
                <BaseButton
                  icon="CHECKED"
                  label={<FormattedMessage {...messages.selectAll} />}
                  backgroundColor={isAllSelected ? 'TEAL' : 'GRAY_SUPER_LIGHT'}
                  hoverBackgroundColor={isAllSelected ? 'TEAL_DARK' : 'GRAY_VERY_LIGHT'}
                  textColor={isAllSelected ? 'WHITE' : 'GRAY_DARK'}
                  hoverTextColor={isAllSelected ? 'WHITE' : 'GRAY_DARK'}
                  onClick={() => {
                    setMultiSelect(true);

                    setSelectedFiles(
                      isAllSelected
                        ? {}
                        : filesState.reduce((arr, file) => {
                            // eslint-disable-next-line
                            arr[file.id] = file;
                            return arr;
                          }, {})
                    );
                  }}
                />

                <BaseButton
                  icon="CHECKED"
                  label={<FormattedMessage {...messages.selectMultiple} />}
                  backgroundColor={isMultiSelect ? 'TEAL' : 'GRAY_SUPER_LIGHT'}
                  hoverBackgroundColor={isMultiSelect ? 'TEAL_DARK' : 'GRAY_VERY_LIGHT'}
                  textColor={isMultiSelect ? 'WHITE' : 'GRAY_DARK'}
                  hoverTextColor={isMultiSelect ? 'WHITE' : 'GRAY_DARK'}
                  onClick={() => {
                    if (isMultiSelect) {
                      setSelectedFiles({});
                    }

                    setMultiSelect(isMulti => !isMulti);
                  }}
                />
              </>
            )}
          </GridRow>
        </div>
        <Tooltip message={<FormattedMessage {...messages.dragAndDrop} />}>
          <div className={DocumentsDragAndDropTooltipWrapperStyle}>
            <Icon icon="INFO" />
          </div>
        </Tooltip>
      </div>
    </>
  );

  return isInDialog ? (
    <>
      <SectionNavBar>{navbarContent}</SectionNavBar>
      {documentsBody}
    </>
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
      navbarContent={navbarContent}
    >
      {documentsBody}
    </StickyScrollingSection>
  );
};

export default DocumentsUpload;
