// @flow
import * as React from 'react';
import { isNullOrUndefined } from 'utils/fp';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { FilterDataStyle } from './style';

type OptionalProps = {
  min?: number,
  max?: number,
};
type Props = OptionalProps & {
  metric: string,
  field: string,
  onRemove: Function,
};

const MetricInputItem = ({ min, max, metric, onRemove, field }: Props) => (
  <button className={FilterDataStyle} type="button" onClick={() => onRemove(null, field)}>
    {field} :{!isNullOrUndefined(min) && <FormattedNumber value={min} suffix={metric} />}
    {!isNullOrUndefined(min) && isNullOrUndefined(max) && ' > '}
    {!isNullOrUndefined(min) && !isNullOrUndefined(max) && ' - '}
    {isNullOrUndefined(min) && !isNullOrUndefined(max) && ' < '}
    {!isNullOrUndefined(max) && <FormattedNumber value={max} suffix={metric} />}
    <Icon icon="CLEAR" />
  </button>
);

export default MetricInputItem;
