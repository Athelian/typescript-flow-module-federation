// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { upload } from 'utils/fs';
import logger from 'utils/logger';
import type { Image } from './type.js.flow';
import { AddImageStyle, ProgressStyle } from './style';

type OptionalProps = {
  width: string,
  height: string,
};

type Props = OptionalProps & {
  name: string,
  values: Array<Image>,
  onChange: (string, any) => void,
  onBlur: (string, boolean) => void,
  onUpload?: ({ uploading: boolean, progress: number }) => void,
};

type State = {
  uploading: boolean,
  progress: number,
};

class ImagesUploadInput extends React.Component<Props, State> {
  static defaultProps = {
    values: [],
    onChange: () => {},
    onBlur: () => {},
    onUpload: () => {},
    width: '180px',
    height: '180px',
  };

  state = {
    uploading: false,
    progress: 0,
  };

  componentDidUpdate(prevProps: Props, prevState: State): void {
    const { onUpload } = this.props;
    if (!onUpload) {
      return;
    }

    const { uploading: prevUploading, progress: prevProgress } = prevState;
    const { uploading, progress } = this.state;

    if (prevProgress === progress && prevUploading === uploading) {
      return;
    }

    onUpload({
      uploading,
      progress,
    });
  }

  handleChange = (event: Event, onUpload: Function) => {
    event.preventDefault();

    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const {
      files: [file],
    } = input;
    if (!file) {
      return;
    }

    this.setState({
      uploading: true,
    });

    upload(
      file,
      ({ id, name, path }) => {
        this.setState({
          progress: 0,
          uploading: false,
        });

        onUpload({
          id,
          name,
          path,
          type: 'Image',
          memo: null,
        });
      },
      logger.error,
      ({ lengthComputable, loaded, total }: ProgressEvent) => {
        if (lengthComputable) {
          this.setState({
            progress: Math.round((loaded / total) * 100),
          });
        }
      }
    );
  };

  render() {
    const { name, values, onChange, width, height } = this.props;
    const { uploading, progress } = this.state;

    return (
      <div>
        {uploading ? (
          <div className={ProgressStyle({ width, height })}>{`${progress}%`}</div>
        ) : (
          <label className={AddImageStyle({ width, height })}>
            <Icon icon="PHOTO" />
            <Icon icon="ADD" />
            <input
              type="file"
              accept="*"
              disabled={uploading}
              hidden
              onChange={e => {
                this.handleChange(e, newFile => {
                  onChange(name, [...values, newFile]);
                });
              }}
            />
          </label>
        )}
      </div>
    );
  }
}

export default ImagesUploadInput;
