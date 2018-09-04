// @flow
import * as React from 'react';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';

type OptionalProps = {
  icon: string,
  disabled: boolean,
  active: boolean,
  onClick: Function,
};

type Props = OptionalProps & {
  label: string | React.Node,
};

const defaultProps = {
  icon: null,
  disabled: false,
  active: false,
  onClick: () => {},
};

const SectionTabs = ({ icon, label, disabled, active, onClick }: Props) => (
  <TabItem icon={icon} label={label} disabled={disabled} active={active} onClick={onClick} />
);

SectionTabs.defaultProps = defaultProps;

export default SectionTabs;
