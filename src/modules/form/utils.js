// @flow
import { isNullOrUndefined } from 'utils/fp';

export const resetFormState = (containerInstance: Object, key: ?string): void =>
  isNullOrUndefined(key)
    ? containerInstance.initDetailValues(containerInstance.originalValues)
    : containerInstance.initDetailValues(containerInstance.originalValues[key]);

export default resetFormState;
