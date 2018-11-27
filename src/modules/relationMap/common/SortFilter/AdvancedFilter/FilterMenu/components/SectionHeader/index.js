// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import { SectionHeaderStyle, SectionHeaderIconStyle } from './style';

type Props = {
  label: React.Node,
  icon: string,
};

export default function SectionHeader({ label, icon }: Props) {
  return (
    <div className={SectionHeaderStyle}>
      <div className={SectionHeaderIconStyle}>
        <Icon icon={icon} />
      </div>
      <Label>{label}</Label>
    </div>
  );
}
