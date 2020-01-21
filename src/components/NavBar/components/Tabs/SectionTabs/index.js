// @flow
import * as React from 'react';
import { Tooltip } from 'components/Tooltip';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import { WrapperStyle } from './style';

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
  const showLabel = link && active;
  return showLabel ? (
    <div className={WrapperStyle(true)}>
      <TabItem icon={icon} label={label} disabled={disabled} active={active} onClick={onClick} />
    </div>
  ) : (
    <Tooltip message={label}>
      <div className={WrapperStyle(false)}>
        <TabItem icon={icon} label="" disabled={disabled} active={active} onClick={onClick} />
      </div>
    </Tooltip>
  );
};

export default SectionTabs;
