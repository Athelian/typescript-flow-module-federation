// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label } from 'components/Form';
import { UploadPlaceholderStyle, ProgressStyle } from './style';

type Props = {
  progress: number,
  height?: string,
};

export default function UploadPlaceholder({ progress, height = '185px' }: Props) {
  return (
    <div className={UploadPlaceholderStyle(height)}>
      <div className={ProgressStyle}>{`${progress}%`}</div>

      <Label align="center">
        <FormattedMessage
          id="components.UploadPlaceholder.uploading"
          defaultMessage="Uploading..."
        />
      </Label>
    </div>
  );
}
