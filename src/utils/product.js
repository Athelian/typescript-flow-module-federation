// @flow
import { defaultDistanceMetric, defaultVolumeMetric, defaultWeightMetric } from 'utils/metric';
import { initValues as infoInitValues } from 'modules/productProvider/form/containers/info';
import { initValues as taskInitValues } from 'modules/productProvider/form/containers/tasks';
import { injectUid } from './id';

export const generatePackaging = () =>
  injectUid({
    capacity: 0,
    size: {
      width: {
        metric: defaultDistanceMetric,
        value: 0,
      },
      height: {
        metric: defaultDistanceMetric,
        value: 0,
      },
      length: {
        metric: defaultDistanceMetric,
        value: 0,
      },
    },
    grossWeight: {
      metric: defaultWeightMetric,
      value: 0,
    },
    volume: {
      metric: defaultVolumeMetric,
      value: 0,
    },
    autoCalculateVolume: true,
    isNew: true,
  });

const generateEndProduct = () =>
  injectUid({ ...infoInitValues, ...taskInitValues, packages: [generatePackaging()] });

export default generateEndProduct;
