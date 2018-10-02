// @flow
import React from 'react';
import { CardWrapperStyle } from '../style';

type Props = {
  quantity: number,
  name: string,
};
const TotalCard = ({ quantity, name }: Props) => (
  <div className={CardWrapperStyle}>
    <span>
      Total {quantity} {name}
    </span>
  </div>
);

export default TotalCard;
