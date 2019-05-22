// @flow
import { getByPathWithDefault } from 'utils/fp';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';

export const getProductImage = (product: ?Object): any => {
  return getByPathWithDefault(FALLBACK_IMAGE, 'files.0.pathMedium', product);
};

export default getProductImage;
