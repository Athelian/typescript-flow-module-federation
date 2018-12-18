// @flow
import { isNullOrUndefined } from 'utils/fp';

type MetricInputType = {
  min?: number,
  max?: number,
  metric: string,
};

type PortType = {
  name?: string,
};

export const isValidOfMetricRangeInput = (input: MetricInputType) =>
  input &&
  !isNullOrUndefined(input.metric) &&
  (!isNullOrUndefined(input.min) || !isNullOrUndefined(input.max));

export const isValidOfPortsInput = (ports: Array<PortType>) =>
  ports && ports.filter(port => !isNullOrUndefined(port)).length > 0;

export const filterPorts = (ports: Array<PortType>): Array<PortType> =>
  ports && ports.filter(port => !isNullOrUndefined(port));
