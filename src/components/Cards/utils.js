// @flow
import { getByPathWithDefault } from 'utils/fp';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';

export const getProductImage = (product: ?Object): any => {
  const images = getByPathWithDefault([], 'files', product);
  if (images.length > 0) {
    return images[0].pathMedium;
  }
  return FALLBACK_IMAGE;
};

export const totalAdjustQuantity = (batchAdjustments: Array<{ quantity: number }>): number =>
  batchAdjustments
    ? batchAdjustments.reduce((total, adjustment) => adjustment.quantity + total, 0)
    : 0;

export default getProductImage;
