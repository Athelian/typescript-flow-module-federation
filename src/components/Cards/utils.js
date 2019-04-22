// @flow
import { getByPathWithDefault } from 'utils/fp';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';

export const getProductImage = (product: ?Object): any => {
  return getByPathWithDefault(FALLBACK_IMAGE, 'files.0.pathMedium', product);
};

export const totalAdjustQuantity = (batchAdjustments: Array<{ quantity: number }>): number =>
  batchAdjustments
    ? batchAdjustments.reduce((total, adjustment) => adjustment.quantity + total, 0)
    : 0;

export default getProductImage;
