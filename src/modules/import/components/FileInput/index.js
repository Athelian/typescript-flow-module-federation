// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Dropzone from 'react-dropzone';
import Icon from 'components/Icon';
import DashedPlusButton from 'components/Form/DashedPlusButton';
import { ContainerStyle, FilePreviewStyle, FileIconStyle, FileNameStyle } from './style';
import messages from '../../messages';

type Props = {
  value: File | null,
  onChange: (File | null) => void,
};

const FileInput = ({ value, onChange }: Props) => {
  function handleChange(event: SyntheticInputEvent<HTMLInputElement>) {
    event.preventDefault();
    onChange(event.target.files[0] || null);
  }

  const ref = React.useRef(null);

  return (
    <>
      <input
        ref={ref}
        id="import-file"
        type="file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        hidden
        onChange={handleChange}
      />
      <Dropzone
        onDrop={files => {
          onChange(files[0] || null);
        }}
      >
        {({ getRootProps }) => (
          <div className={ContainerStyle} {...getRootProps()}>
            {value !== null ? (
              <div className={FilePreviewStyle}>
                <i className={FileIconStyle}>
                  <Icon icon="EXCEL" />
                </i>
                <span className={FileNameStyle}>{value.name}</span>
              </div>
            ) : (
              <DashedPlusButton
                width="100%"
                height="150px"
                label={<FormattedMessage {...messages.dropFile} />}
                onClick={() => {
                  if (ref.current) {
                    ref.current.click();
                  }
                }}
              />
            )}
          </div>
        )}
      </Dropzone>
    </>
  );
};

export default FileInput;
