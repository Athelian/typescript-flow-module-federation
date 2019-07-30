// @flow
import * as React from 'react';
import type { FilePayload } from 'generated/graphql';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { pick } from 'lodash/fp';
import Dropzone from 'react-dropzone';
import update from 'immutability-helper';
import Icon from 'components/Icon';
import { uuid } from 'utils/id';
import { upload } from 'utils/fs';
import { isEquals, getByPath } from 'utils/fp';
import logger from 'utils/logger';
import SectionNavBar from 'components/NavBar/SectionNavBar';
import UploadPlaceholder from 'components/UploadPlaceholder';
import { CardAction } from 'components/Cards';
import DocumentCard, { getFileTypesByEntity } from 'components/Cards/DocumentCard';
import { Tooltip } from 'components/Tooltip';
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
  intl: IntlShape,
  files: Array<FilePayload>,
  onSave: (Array<FilePayload>) => void,
  entity: 'Order' | 'OrderItem' | 'Shipment' | 'ProductProvider',
  editable: {
    status: boolean,
    type: boolean,
    memo: boolean,
  },
  downloadable: boolean,
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
  entity: Object,
};

type State = {
  filesState: Array<{
    ...UploadFileState,
    uploading: boolean,
    progress: number,
  }>,
  prevFiles: Array<UploadFileState>,
};

const SELECTED_FIELDS = ['id', 'type', 'name', 'path', 'status', 'memo', 'entity', '__typename'];
class DocumentsInput extends React.Component<Props, State> {
  state = {
    filesState: [],
    prevFiles: [],
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const editableFields = ['id', 'type', 'name', 'path', 'status', 'memo'];
    if (
      !isEquals(props.files.map(pick(editableFields)), state.prevFiles.map(pick(editableFields)))
    ) {
      return {
        prevFiles: props.files.map(pick(SELECTED_FIELDS)),
        filesState: props.files.map(pick(SELECTED_FIELDS)).map(item => ({
          ...item,
          progress: 100,
          uploading: false,
        })),
      };
    }
    return null;
  }

  handleUpload = (newFiles: Array<Object>) => {
    const { files, onSave } = this.props;
    onSave([...files, ...newFiles]);
  };

  handleChange = (event: SyntheticInputEvent<HTMLInputElement> | Array<File>) => {
    let newFiles = [];
    if (Array.isArray(event)) {
      newFiles = event;
    } else {
      event.preventDefault();
      newFiles = Array.from(event.target.files);
    }
    const { filesState } = this.state;

    const basePosition = filesState.length;
    this.setState(
      prevState => ({
        filesState: [
          ...prevState.filesState,
          ...newFiles.map(({ name, type }) => ({
            name,
            type,
            id: uuid(),
            path: '',
            status: 'Draft',
            memo: '',
            uploading: true,
            progress: 0,
          })),
        ],
      }),
      () => {
        Promise.all(
          newFiles.map((file, index) =>
            upload(file, (progressStatus: ProgressEvent) => {
              const { lengthComputable, loaded, total } = progressStatus;
              if (lengthComputable) {
                const { filesState: newFilesState } = this.state;
                newFilesState[index + basePosition].progress = Math.round((loaded / total) * 100);
                this.setState({ filesState: newFilesState });
              }
            })
          )
        )
          .then(uploadResult => {
            const { entity, intl } = this.props;
            const types = getFileTypesByEntity(entity, intl);
            this.handleUpload(
              uploadResult.map(({ id, name, path }) => ({
                id,
                name,
                path,
                type: types[0].value,
                status: 'Draft',
                memo: '',
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
            const { files } = this.props;
            this.setState({
              prevFiles: files.map(pick(SELECTED_FIELDS)),
              filesState: files.map(pick(SELECTED_FIELDS)).map(item => ({
                ...item,
                progress: 100,
                uploading: false,
              })),
            });
          });
      }
    );
  };

  render() {
    const { files, editable, uploadable, removable, downloadable, onSave } = this.props;
    const { filesState } = this.state;

    const fileInputValue = '';

    const isEditable = Object.keys(editable).some(key => editable[key]);
    return (
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
                <input
                  type="file"
                  accept="*"
                  hidden
                  multiple
                  value={fileInputValue}
                  onChange={this.handleChange}
                />
              </label>
            </>
          )}
        </SectionNavBar>

        {isEditable ? (
          <Dropzone onDrop={this.handleChange}>
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
    );
  }
}

export default injectIntl(DocumentsInput);
