// @flow
import * as React from 'react';
import { Location } from '@reach/router';
import { UIConsumer } from 'modules/ui';
import { zenMenuStyle, MenuBody } from './style';
import menuConfig from './menuConfig';
import Logo from './components/Logo';
import MenuItem from './components/MenuItem';
import SubMenu from './components/SubMenu';

type Props = {};

type State = {
  expandedSubMenuId: number | null,
};

class SideBar extends React.Component<Props, State> {
  state = {
    expandedSubMenuId: null,
  };

  setExpandedSubMenuId: Function;

  setExpandedSubMenuId = (expandedSubMenuId: number) => {
    this.setState({ expandedSubMenuId });
  };

  render() {
    const { expandedSubMenuId } = this.state;
    return (
      <Location>
        {({ location }) =>
          location.pathname !== '/login' && (
            <UIConsumer>
              {uiState => (
                <div className={zenMenuStyle(uiState.isSideBarExpanded)}>
                  <Logo {...uiState} />
                  <div className={MenuBody}>
                    {menuConfig.map(
                      menu =>
                        menu.type === 'menuitem' ? (
                          <MenuItem
                            {...menu}
                            key={menu.path}
                            isActive={`/${location.pathname.split('/')[1]}` === menu.path}
                            setExpandedSubMenuId={() => this.setExpandedSubMenuId(menu.id)}
                          />
                        ) : (
                          <SubMenu
                            {...menu}
                            key={menu.id}
                            activeLink={location.pathname}
                            isExpanded={expandedSubMenuId === menu.id}
                            setExpandedSubMenuId={this.setExpandedSubMenuId}
                          />
                        )
                    )}
                  </div>
                </div>
              )}
            </UIConsumer>
          )
        }
      </Location>
    );
  }
}

export default SideBar;
