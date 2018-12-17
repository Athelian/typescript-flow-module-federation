// @flow
import { isNullOrUndefined } from 'utils/fp';

type MetricInputType = {
  min?: number,
  max?: number,
  metric: string,
};

export const isValidOfMetricRangeInput = (input: MetricInputType) =>
  input &&
  !isNullOrUndefined(input.metric) &&
  (!isNullOrUndefined(input.min) || !isNullOrUndefined(input.max));

export default isValidOfMetricRangeInput;
