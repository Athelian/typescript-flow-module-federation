// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { uuid } from 'utils/id';
import { upload } from 'utils/fs';
import { isEquals } from 'utils/fp';
import logger from 'utils/logger';
import type { Image } from './type.js.flow';
import { AddImageStyle, ProgressStyle, UploadWrapperStyle } from './style';

type OptionalProps = {
  width: string,
  height: string,
};

type Props = OptionalProps & {
  name: string,
  values: Array<Image>,
  onChange: (string, any) => void,
};

type State = {
  filesState: Array<{
    uploading: boolean,
    progress: number,
    id: string,
    path: string,
  }>,
  prevFiles: Array<string>,
};

class ImagesUploadInput extends React.Component<Props, State> {
  static defaultProps = {
    values: [],
    onChange: () => {},
  };

  state = {
    filesState: [],
    prevFiles: [],
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (!isEquals(props.values.map(item => item.id), state.prevFiles)) {
      return {
        prevFiles: (props.values.map(item => item.id): Array<string>),
        filesState: (props.values.map(item => ({
          ...item,
          progress: 100,
          uploading: false,
        })): Array<any>),
      };
    }
    return null;
  }

  handleChange = (
    event: SyntheticInputEvent<HTMLInputElement>,
    onUpload: (Array<Object>) => any
  ) => {
    event.preventDefault();
    const { filesState } = this.state;

    const newFiles = Array.from(event.target.files);
    const basePosition = filesState.length;
    this.setState(
      prevState => ({
        filesState: [
          ...prevState.filesState,
          ...newFiles.map(() => ({
            id: uuid(),
            path: '',
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
            onUpload(
              uploadResult.map(({ id, name, path }) => ({
                id,
                name,
                path,
                memo: null,
                uploading: false,
                progress: 100,
              }))
            );
          })
          .catch(error => {
            logger.error(error);
            const { values } = this.props;
            this.setState({
              prevFiles: (values.map(item => item.id): Array<string>),
              filesState: (values.map(item => ({
                ...item,
                progress: 100,
                uploading: false,
              })): Array<any>),
            });
          });
      }
    );
  };

  render() {
    const { name, values, onChange, width, height } = this.props;
    const { filesState } = this.state;
    return (
      <div className={UploadWrapperStyle}>
        {filesState &&
          filesState
            .filter(file => file.uploading)
            .map(file => <div key={file.id} className={ProgressStyle}>{`${file.progress}%`}</div>)}

        <label className={AddImageStyle({ width, height })}>
          <Icon icon="PHOTO" />
          <Icon icon="ADD" />
          <input
            type="file"
            accept="*"
            hidden
            multiple
            onChange={e => {
              this.handleChange(e, newFiles => {
                onChange(name, [...values, ...newFiles]);
              });
            }}
          />
        </label>
      </div>
    );
  }
}

export default ImagesUploadInput;
