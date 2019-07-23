// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import { WrapperStyle, IconColorStyle, TextStyle } from './style';

type Props = {|
  entity: 'ORDER' | 'BATCH' | 'SHIPMENT' | 'CONTAINER' | 'ORDER_ITEM',
  value: React$Node,
  blackout: boolean,
|};

const defaultProps = {
  blackout: false,
};

export default function RelateEntity({ entity, value, blackout }: Props) {
  const isNotAvailable = blackout || !value;
  return (
    <div className={WrapperStyle}>
      <div className={IconColorStyle(entity, isNotAvailable)}>
        <Icon icon={entity} />
      </div>
      {blackout ? (
        <Display height="25px" blackout={blackout} align="left" />
      ) : (
        <div className={TextStyle}>{value}</div>
      )}
    </div>
  );
}

RelateEntity.defaultProps = defaultProps;
