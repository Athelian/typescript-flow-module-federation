// @flow
import * as React from 'react';
import { TabItemStyle } from 'components/NavBar/components/Tabs/components/TabItem/style';

type Props = {
  children: React.Node,
  active?: boolean,
  onClick?: Function,
};

const defaultProps = {
  active: false,
  onClick: () => {},
};

export default class SectionNavigation extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const { children, active, onClick } = this.props;
    return (
      <div>
        <button type="button" className={TabItemStyle(!!active)} onClick={onClick}>
          {children}
          <span />
        </button>
      </div>
    );
  }
}
