// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { downloadFile, downloadAndZip } from 'utils/file';
import { BaseButton } from 'components/Buttons';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { DownloadDropDownStyle, DownloadItemStyle, DownloadWrapperStyle } from '../../style';
import messages from '../../messages';

type Props = {
  isMultiSelect: boolean,
  selectedFiles: { [k: string]: Object },
  onDownloadFinished: () => void,
};

const DownloadSelectedButton = ({ isMultiSelect, selectedFiles, onDownloadFinished }: Props) => {
  const buttonRef = React.useRef(null);
  const [isOpen, setOpen] = React.useState(false);

  const onDownloadZipSelect = () => {
    const files = Object.values(selectedFiles)
      .map(selectedFile => {
        if (
          selectedFile &&
          selectedFile.path &&
          typeof selectedFile.path === 'string' &&
          selectedFile.name &&
          typeof selectedFile.name === 'string'
        ) {
          const { path, name } = selectedFile;
          return { url: path, name };
        }

        return null;
      })
      .filter(Boolean);

    downloadAndZip(files);
  };

  const onDownloadFilesSelect = () => {
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
  };

  return (
    <div className={DownloadWrapperStyle}>
      <BaseButton
        icon="DOWNLOAD"
        label={<FormattedMessage {...messages.downloadSelected} />}
        backgroundColor={isMultiSelect ? 'TEAL' : 'GRAY_SUPER_LIGHT'}
        hoverBackgroundColor={isMultiSelect ? 'TEAL_DARK' : 'GRAY_VERY_LIGHT'}
        textColor={isMultiSelect ? 'WHITE' : 'GRAY_DARK'}
        hoverTextColor={isMultiSelect ? 'WHITE' : 'GRAY_DARK'}
        buttonRef={buttonRef}
        onClick={e => {
          e.stopPropagation();
          setOpen(prevOpen => !prevOpen);
        }}
      />
      {isOpen && (
        <>
          <OutsideClickHandler
            onOutsideClick={() => setOpen(false)}
            ignoreClick={!isOpen}
            ignoreElements={buttonRef.current ? [buttonRef.current] : []}
          >
            <div className={DownloadDropDownStyle}>
              <button
                type="button"
                className={DownloadItemStyle}
                onClick={() => {
                  onDownloadZipSelect();
                  onDownloadFinished();
                }}
              >
                <FormattedMessage {...messages.downloadZip} />
              </button>
              <button
                type="button"
                className={DownloadItemStyle}
                onClick={() => {
                  onDownloadFilesSelect();
                  onDownloadFinished();
                }}
              >
                <FormattedMessage {...messages.downloadAll} />
              </button>
            </div>
          </OutsideClickHandler>
        </>
      )}
    </div>
  );
};

export default DownloadSelectedButton;
