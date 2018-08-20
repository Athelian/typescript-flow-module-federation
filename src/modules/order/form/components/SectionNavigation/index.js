// @flow
import * as React from 'react';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';

type Props = {
  icon?: string,
  label: string | React.Node,
  disabled?: boolean,
  active?: boolean,
  onClick?: Function,
};

const defaultProps = {
  icon: null,
  disabled: false,
  active: false,
  onClick: () => {},
};

export default class SectionNavigation extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const { icon, label, disabled, active = false, onClick = () => {} } = this.props;
    return (
      <TabItem icon={icon} label={label} disabled={disabled} active={active} onClick={onClick} />
    );
  }
}
