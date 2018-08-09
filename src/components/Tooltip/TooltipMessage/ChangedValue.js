// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { ChangeValueStyle, ChangesSpanStyle } from './style';

type Props = {
  oldValue: React.Node,
  newValue: React.Node,
};
const ChangedValue = ({ oldValue, newValue }: Props) => (
  <div className={ChangeValueStyle}>
    <span>{oldValue}</span>
    <Icon icon="faArrowDown" />
    <span className={ChangesSpanStyle}>{newValue}</span>
  </div>
);

export default ChangedValue;
