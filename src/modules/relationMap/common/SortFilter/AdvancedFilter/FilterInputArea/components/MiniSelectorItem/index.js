// @flow
import * as React from 'react';
import BaseCard from 'components/Cards';
import { MiniSelectorItemStyle } from './style';

type Props = {
  children: React.Node,
};

export default function MiniSelector({ children, ...rest }: Props) {
  return (
    /* $FlowFixMe This comment suppresses an error found when upgrading Flow to
     * v0.112.0. To view the error, delete this comment and run Flow. */
    <BaseCard selectable {...rest}>
      <div className={MiniSelectorItemStyle}>{children}</div>
    </BaseCard>
  );
}
