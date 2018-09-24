// @flow
import React from 'react';

type Props = {
  quantity: number,
  name: string,
};
const TotalCard = ({ quantity, name }: Props) => (
  <div>
    <span>
      Total {quantity} {name}
    </span>
  </div>
);

export default TotalCard;
