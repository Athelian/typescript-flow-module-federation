// @flow
import * as React from 'react';
import { isNullOrUndefined } from 'utils/fp';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { FilterDataStyle } from 'modules/relationMap/common/SortFilter/AdvancedFilter/FilterMenu/components/FilterData/style';

type OptionalProps = {
  label?: string | React.Node,
  min?: number,
  max?: number,
};
type Props = OptionalProps & {
  metric: string,
  name: string,
  onRemove: Function,
};

const MetricInputItem = ({ min, max, metric, onRemove, name, label }: Props) => (
  <button className={FilterDataStyle} type="button" onClick={() => onRemove(null, name)}>
    {!isNullOrUndefined(label) && <>{label} :</>}
    {!isNullOrUndefined(min) && <FormattedNumber value={min} suffix={metric} />}
    {!isNullOrUndefined(min) && isNullOrUndefined(max) && ' > '}
    {!isNullOrUndefined(min) && !isNullOrUndefined(max) && ' - '}
    {isNullOrUndefined(min) && !isNullOrUndefined(max) && ' < '}
    {!isNullOrUndefined(max) && <FormattedNumber value={max} suffix={metric} />}
    <Icon icon="CLEAR" />
  </button>
);

export default MetricInputItem;
