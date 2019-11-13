// @flow
import * as React from 'react';
import type { FilePayload } from 'generated/graphql';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import { Display } from 'components/Form';
import { getByPathWithDefault } from 'utils/fp';
import { isForbidden } from 'utils/data';

type Props = {
  className: string,
  file: FilePayload,
  path?: string,
  height?: string,
};

const defaultProps = {
  path: 'pathMedium',
  height: '75px',
};

export default function ProductImage({ className, file, path, height }: Props) {
  const alt = getByPathWithDefault('product image', 'name', file);
  const src = getByPathWithDefault(FALLBACK_IMAGE, path || '', file);
  if (isForbidden(file)) {
    return <Display className={className} blackout height={height} />;
  }
  return <img className={className} src={src} alt={alt} />;
}

ProductImage.defaultProps = defaultProps;
