// @flow
import React from 'react';
import { ContainerWrapperStyle, NameStyle } from './style';

type Props = {
  name: string,
};
const ShipmentCollapsed = ({ name }: Props) => (
  <div className={ContainerWrapperStyle}>
    <div className={NameStyle}>{name}</div>
  </div>
);

export default ShipmentCollapsed;
