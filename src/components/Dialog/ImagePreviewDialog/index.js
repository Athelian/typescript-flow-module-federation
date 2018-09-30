// @flow
import * as React from 'react';
import Dialog from '../index';
import { DialogStyle, ImageStyle } from './style';

type Props = {
  isOpen: boolean,
  width: number,
  image: {
    path: string,
    name: string,
  },
  onRequestClose: () => void,
};

function ImagePreviewDialog({ image: { path, name }, isOpen, onRequestClose, width }: Props) {
  return (
    <Dialog isOpen={isOpen} onRequestClose={onRequestClose} options={{ width }}>
      <div className={DialogStyle}>
        <img src={path} alt={name} className={ImageStyle} />
      </div>
    </Dialog>
  );
}

export default ImagePreviewDialog;
