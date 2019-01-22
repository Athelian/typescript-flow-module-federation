// @flow
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';

export const getProductImage = (product: Object): any => {
  if (!product) return FALLBACK_IMAGE;
  return product.files && product.files.length > 0 ? product.files[0].pathMedium : FALLBACK_IMAGE;
};

export default getProductImage;
