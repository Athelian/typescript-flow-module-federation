// @flow
import * as React from 'react';
import BaseCard from 'components/Cards';
import { MiniSelectorItemStyle } from './style';

type Props = {
  children: React.Node,
};

export default function MiniSelector({ children, ...rest }: Props) {
  return (
    <BaseCard selectable {...rest}>
      <div className={MiniSelectorItemStyle}>{children}</div>
    </BaseCard>
  );
}
