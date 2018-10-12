// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { SectionHeaderWrapperStyle, TitleWrapperStyle, TitleStyle, IconStyle } from './style';

type Props = {
  icon: string,
  title: string,
  children: React.Node,
};

const defaultProps = {
  children: null,
};

function SectionHeader({ icon, title, children }: Props) {
  return (
    <div className={SectionHeaderWrapperStyle}>
      <div className={TitleWrapperStyle}>
        <div className={IconStyle}>
          <Icon icon={icon} />
        </div>
        <div className={TitleStyle}>{title}</div>
      </div>
      {children}
    </div>
  );
}

SectionHeader.defaultProps = defaultProps;

export default SectionHeader;
