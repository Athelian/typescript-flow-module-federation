// @flow
import * as React from 'react';
import { ProgressStyle } from './style';

type Props = {
  children: React$Node,
  uploading: boolean,
  progress: number,
};

export default function UploadPlaceholder({ children, uploading, progress }: Props) {
  return uploading ? <div className={ProgressStyle}>{`${progress}%`}</div> : children;
}
