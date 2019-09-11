// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Dropzone from 'react-dropzone';
import type { FilePayload } from 'generated/graphql';
import { pick } from 'lodash/fp';
import Icon from 'components/Icon';
import { uuid } from 'utils/id';
import { upload } from 'utils/fs';
import { isEquals } from 'utils/fp';
import logger from 'utils/logger';
import {
  AddImageStyle,
  ProgressStyle,
  UploadWrapperStyle,
  DocumentsDragAndDropWrapperStyle,
  DocumentsDragAndDropLabelStyle,
} from './style';

type UploadFileState = {
  id: string,
  path: string,
};

type Props = {
  width: string,
  height: string,
  files: Array<FilePayload>,
  onSave: (Array<FilePayload>) => void,
};

type State = {
  filesState: Array<{
    ...UploadFileState,
    uploading: boolean,
    progress: number,
  }>,
  prevFiles: Array<UploadFileState>,
};

const SELECTED_FIELDS = ['id', 'name', 'path', 'pathMedium', '__typename'];
class ImagesUploadInput extends React.Component<Props, State> {
  state = {
    filesState: [],
    prevFiles: [],
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const editableFields = ['id', 'name', 'path', 'pathMedium'];
    if (
      !isEquals(props.files.map(pick(editableFields)), state.prevFiles.map(pick(editableFields)))
    ) {
      return {
        prevFiles: (props.files.map(pick(SELECTED_FIELDS)): Array<UploadFileState>),
        filesState: (props.files.map(pick(SELECTED_FIELDS)).map(item => ({
          ...item,
          progress: 100,
          uploading: false,
        })): Array<{
          ...UploadFileState,
          uploading: boolean,
          progress: number,
        }>),
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
          ...newFiles.map(({ name }) => ({
            name,
            id: uuid(),
            path: '',
            pathMedium: '',
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
            this.handleUpload(
              uploadResult.map(({ id, name, path }) => ({
                id,
                name,
                path,
                pathMedium: path,
                uploading: false,
                progress: 100,
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
    const { width, height } = this.props;
    const { filesState } = this.state;
    return (
      <>
        <div className={UploadWrapperStyle}>
          {filesState &&
            filesState
              .filter(file => file.uploading)
              .map(file => (
                <div key={file.id} className={ProgressStyle}>{`${file.progress}%`}</div>
              ))}

          <label className={AddImageStyle({ width, height })}>
            <Icon icon="PHOTO" />
            <Icon icon="ADD" />
            <input value="" type="file" accept="*" hidden multiple onChange={this.handleChange} />
          </label>
        </div>
        <Dropzone onDrop={this.handleChange}>
          {({ getRootProps, isDragActive }) => (
            <div {...getRootProps()} className={AddImageStyle({ width, height })}>
              <div className={DocumentsDragAndDropWrapperStyle(isDragActive)}>
                <div className={DocumentsDragAndDropLabelStyle}>
                  <FormattedMessage id="component.form.uploadImage" defaultMessage="" />
                  <Icon icon="ADD" />
                </div>
              </div>
            </div>
          )}
        </Dropzone>
      </>
    );
  }
}

export default ImagesUploadInput;
