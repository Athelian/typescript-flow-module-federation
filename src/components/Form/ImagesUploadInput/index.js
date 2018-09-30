// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { upload } from 'utils/fs';
import logger from 'utils/logger';
import ImageItem from './components/ImageItem';
import type { Image } from './type.js.flow';
import { ImageListStyle, AddImageStyle, ProgressStyle, NoImagesStyle } from './style';
import messages from './messages';

type Props = {
  name: string,
  values: Array<Image>,
  readOnly: boolean,
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
    readOnly: false,
    onChange: () => {},
    onBlur: () => {},
    onUpload: () => {},
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
    const { name, values, readOnly, onChange, onBlur } = this.props;
    const { uploading, progress } = this.state;

    if (readOnly) {
      return values && values.length > 0 ? (
        <div className={ImageListStyle}>
          {values.map(image => (
            <ImageItem name={image.id} key={image.id} value={image} readOnly />
          ))}
        </div>
      ) : (
        <div className={NoImagesStyle}>
          <FormattedMessage {...messages.noImages} />
        </div>
      );
    }

    return (
      <div className={ImageListStyle}>
        {values &&
          values.map((image, index) => {
            const imageName = `${name}[${index}]`;

            return (
              <ImageItem
                name={imageName}
                key={imageName}
                value={image}
                onChange={onChange}
                onBlur={onBlur}
                onRemove={() => {
                  onChange(name, values.filter(d => d.id !== image.id));
                }}
              />
            );
          })}
        {uploading ? (
          <div className={ProgressStyle}>{`${progress}%`}</div>
        ) : (
          <label className={AddImageStyle}>
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
