// @flow
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';

export const getProductImage = (product: Object): any => {
  if (!product) return FALLBACK_IMAGE;
  return product.files && product.files.length > 0 ? product.files[0].pathMedium : FALLBACK_IMAGE;
};

export const totalAdjustQuantity = (batchAdjustments: Array<{ quantity: number }>): number =>
  batchAdjustments
    ? batchAdjustments.reduce((total, adjustment) => adjustment.quantity + total, 0)
    : 0;

export default getProductImage;
