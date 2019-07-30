// @flow
import * as React from 'react';
import { Link } from '@reach/router';
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
  blackout?: boolean,
  link?: string,
|};

export default function RelateEntity({ entity, value, blackout, link }: Props) {
  const isNotAvailable = blackout || !value;
  return (
    <div className={WrapperStyle}>
      {link && !isNotAvailable ? (
        <Link
          className={IconColorStyle(entity, isNotAvailable)}
          to={link}
          onClick={evt => {
            evt.stopPropagation();
          }}
        >
          <Icon icon={entity} />
        </Link>
      ) : (
        <div className={IconColorStyle(entity, isNotAvailable)}>
          <Icon icon={entity} />
        </div>
      )}
      <Display height="20px" align="left" blackout={blackout}>
        {value}
      </Display>
    </div>
  );
}
