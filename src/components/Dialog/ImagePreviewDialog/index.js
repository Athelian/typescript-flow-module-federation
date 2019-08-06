// @flow
import * as React from 'react';
import type { FilePayload } from 'generated/graphql';
import ProductImage from 'components/ProductImage';
import Dialog from '../index';
import { DialogStyle, ImageStyle } from './style';

type Props = {
  isOpen: boolean,
  image: FilePayload,
  onRequestClose: () => void,
};

function ImagePreviewDialog({ image, isOpen, onRequestClose }: Props) {
  return (
    <Dialog isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className={DialogStyle}>
        <ProductImage file={image} path="path" className={ImageStyle} />
      </div>
    </Dialog>
  );
}

export default ImagePreviewDialog;
