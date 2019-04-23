// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { SectionHeaderWrapperStyle, TitleWrapperStyle, TitleStyle, IconStyle } from './style';

type OptionalProps = {
  actionToolBar: ?React.Node,
};

type Props = OptionalProps & {
  icon: string,
  title: string,
  children: React.Node,
};

const defaultProps = {
  actionToolBar: null,
};

function SectionHeader({ icon, title, children, actionToolBar }: Props) {
  return (
    <div className={SectionHeaderWrapperStyle}>
      <div className={TitleWrapperStyle}>
        <div className={IconStyle}>
          <Icon icon={icon} />
        </div>
        <div className={TitleStyle}>{title}</div>
        {actionToolBar}
      </div>
      {children}
    </div>
  );
}

SectionHeader.defaultProps = defaultProps;

export default SectionHeader;
