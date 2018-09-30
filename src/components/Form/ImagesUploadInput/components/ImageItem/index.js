// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import type { Image } from 'components/Form/ImagesUploadInput/type.js.flow';
import { computeIcon, getFileExtension, getFileName } from './helpers';
import {
  ImageWrapperStyle,
  ImageCardStyle,
  FileExtensionIconStyle,
  BottomWrapperStyle,
  FileNameWrapperStyle,
  FileNameStyle,
  DownloadButtonStyle,
  DeleteButtonStyle,
} from './style';

type Props = {
  value: Image,
  readOnly?: boolean,
  onRemove?: Function,
};

type State = {
  isExpanded: boolean,
};

class ImageItem extends React.Component<Props, State> {
  static defaultProps = {
    readOnly: false,
    onChange: () => {},
    onBlur: () => {},
    onRemove: () => {},
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isExpanded: false,
    };
  }

  toggleMemo = () => {
    const { isExpanded } = this.state;
    this.setState({ isExpanded: !isExpanded });
  };

  render() {
    const { value, readOnly, onRemove } = this.props;
    const { isExpanded } = this.state;

    const fileExtension = getFileExtension(value.name);
    const fileName = getFileName(value.name);
    const fileIcon = computeIcon(fileExtension);

    return (
      <div className={ImageWrapperStyle(isExpanded)}>
        {!readOnly && (
          <button type="button" className={DeleteButtonStyle} onClick={onRemove}>
            <Icon icon="REMOVE" />
          </button>
        )}
        <div className={ImageCardStyle}>
          <div className={FileExtensionIconStyle(fileIcon.color)}>
            <Icon icon={fileIcon.icon} />
          </div>
          <div className={BottomWrapperStyle}>
            <div className={FileNameWrapperStyle}>
              <div className={FileNameStyle}>{fileName}</div>
              {`.${fileExtension}`}
            </div>
            <button
              type="button"
              className={DownloadButtonStyle}
              onClick={() => {
                window.open(value.path, '_blank');
              }}
            >
              <Icon icon="DOWNLOAD" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ImageItem;
