// @flow
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import Dropzone from 'react-dropzone';
import type { FilePayload } from 'generated/graphql';
import { pick } from 'lodash/fp';
import Icon from 'components/Icon';
import { isEquals } from 'utils/fp';
import logger from 'utils/logger';
import { uuid } from 'utils/id';
import fileUploadMutation from './mutation';
import { AddImageStyle, ProgressStyle, UploadWrapperStyle } from './style';

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

const SELECTED_FIELDS = ['id', 'name', 'path', 'pathMedium', '__typename'];
const editableFields = ['id', 'name', 'path', 'pathMedium'];

const ImagesUploadInput = ({ files, width, height, onSave }: Props) => {
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

    // const basePosition = filesState.length;
    setFileState([
      ...filesState,
      ...newFiles.map(({ name }) => ({
        name,
        id: uuid(),
        path: '',
        pathMedium: '',
        uploading: true,
        progress: 0,
      })),
    ]);

    Promise.all<any>(
      newFiles.map(file =>
        upload({
          variables: {
            file,
            input: {},
          },
          /*
          context: {
            fetchOptions: {
              onProgress: (progressEvent: ProgressEvent) => {
                const { lengthComputable, loaded, total } = progressEvent;
                if (lengthComputable) {
                  filesState[index + basePosition].progress = Math.round((loaded / total) * 100);
                  setFileState(
                    filesState.map((fileState, idx) => ({
                      ...fileState,
                      progress:
                        idx === index + basePosition
                          ? Math.round((loaded / total) * 100)
                          : fileState.progress,
                    }))
                  );
                }
              },
            },
          },
          */
        })
      )
    )
      .then(uploadResults => {
        handleUpload(
          uploadResults.map(({ data }) => ({
            ...data.fileUpload,
            uploading: false,
            progress: 100,
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

  return (
    <Dropzone onDrop={handleChange}>
      {({ getRootProps, isDragActive }) => (
        <div {...getRootProps()} className={UploadWrapperStyle}>
          {filesState &&
            filesState
              .filter(file => file.uploading)
              .map(file => (
                <div key={file.id} className={ProgressStyle}>{`${file.progress}%`}</div>
              ))}

          <label className={AddImageStyle({ width, height, isDragActive })}>
            <Icon icon="PHOTO" />
            <Icon icon="ADD" />
            <input value="" type="file" accept="*" hidden multiple onChange={handleChange} />
          </label>
        </div>
      )}
    </Dropzone>
  );
};

export default ImagesUploadInput;
