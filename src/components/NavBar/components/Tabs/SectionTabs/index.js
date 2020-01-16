// @flow
import * as React from 'react';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';

type Props = {|
  label: React.Node,
  icon?: string,
  disabled?: boolean,
  active?: boolean,
  onClick?: Function,
  link?: string,
|};

const SectionTabs = ({
  icon = '',
  link,
  label,
  disabled = false,
  active = false,
  onClick = () => {},
}: Props) => {
  return (
    <TabItem
      icon={icon}
      label={link && active ? label : ''}
      disabled={disabled}
      active={active}
      onClick={onClick}
    />
  );
};

export default SectionTabs;
