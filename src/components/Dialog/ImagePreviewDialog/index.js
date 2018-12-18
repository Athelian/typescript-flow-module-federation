// @flow
import * as React from 'react';
import Dialog from '../index';
import { DialogStyle, ImageStyle } from './style';

type Props = {
  isOpen: boolean,
  image: {
    path: string,
    name: string,
  },
  onRequestClose: () => void,
};

function ImagePreviewDialog({ image: { path, name }, isOpen, onRequestClose }: Props) {
  return (
    <Dialog isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className={DialogStyle}>
        <img src={path} alt={name} className={ImageStyle} />
      </div>
    </Dialog>
  );
}

export default ImagePreviewDialog;
