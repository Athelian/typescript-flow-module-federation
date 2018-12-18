// @flow
import * as React from 'react';

import Icon from 'components/Icon';

import { FilterDataStyle } from './style';

type Props = {
  port: Object,
  label: React.Node,
};

const PortItem = ({ port, label }: Props) => (
  <button className={FilterDataStyle} type="button" onClick={() => console.log(port)}>
    {label} : {port.name}
    <Icon icon="CLEAR" />
  </button>
);

export default PortItem;
