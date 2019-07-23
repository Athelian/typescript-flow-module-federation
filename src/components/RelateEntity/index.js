// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { WrapperStyle, IconColorStyle, TextStyle } from './style';

type Props = {|
  entity: 'ORDER' | 'BATCH' | 'SHIPMENT' | 'ORDER_ITEM',
  value: React$Node,
|};

export default function RelateEntity({ entity, value }: Props) {
  return (
    <div className={WrapperStyle}>
      <div className={IconColorStyle(entity)}>
        <Icon icon={entity} />
      </div>
      <div className={TextStyle}>{value}</div>
    </div>
  );
}
