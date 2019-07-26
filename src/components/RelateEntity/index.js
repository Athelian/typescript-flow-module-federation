// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { Display } from 'components/Form';
import { WrapperStyle, IconColorStyle } from './style';

type Props = {|
  entity: | 'ORDER'
    | 'BATCH'
    | 'SHIPMENT'
    | 'CONTAINER'
    | 'ORDER_ITEM'
    | 'PRODUCT'
    | 'PRODUCT_PROVIDER'
    | 'PROJECT'
    | 'MILESTONE'
    | 'WAREHOUSE',
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
        <Display
          onClick={evt => {
            evt.preventDefault();
          }}
          height="20px"
          blackout={blackout}
          align="left"
        />
      ) : (
        <Display
          onClick={evt => {
            evt.preventDefault();
          }}
          height="20px"
          align="left"
        >
          {value}
        </Display>
      )}
    </div>
  );
}

RelateEntity.defaultProps = defaultProps;
