// @flow
import * as React from 'react';
import { Location } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { UIConsumer } from 'modules/ui';
import { SideBarWrapperStyle, SideBarBodyStyle } from './style';
import Logo from './components/Logo';
import MenuItem from './components/MenuItem';
import SubMenu from './components/SubMenu';
import messages from './messages';

type Props = {};

type State = {
  expandedSubMenu: ?string,
};

class SideBar extends React.Component<Props, State> {
  state = {
    expandedSubMenu: null,
  };

  setExpandedSubMenu = (subMenu: ?string): void => {
    this.setState({ expandedSubMenu: subMenu });
  };

  render() {
    const { expandedSubMenu } = this.state;

    return (
      <Location>
        {({ location }) =>
          location.pathname !== '/login' && (
            <UIConsumer>
              {uiState => (
                <div className={SideBarWrapperStyle(uiState.isSideBarExpanded)}>
                  <Logo {...uiState} />
                  <div className={SideBarBodyStyle}>
                    <MenuItem
                      path="/relation-map/orders"
                      isActive={`/${location.pathname.split('/')[1]}` === '/relation-map'}
                      icon="RELATION_MAP"
                      label={<FormattedMessage {...messages.relationMap} />}
                      onClick={() => this.setExpandedSubMenu(null)}
                    />
                    <MenuItem
                      path="/order"
                      isActive={`/${location.pathname.split('/')[1]}` === '/order'}
                      icon="ORDER"
                      label={<FormattedMessage {...messages.order} />}
                      onClick={() => this.setExpandedSubMenu(null)}
                    />
                    <MenuItem
                      path="/batch"
                      isActive={`/${location.pathname.split('/')[1]}` === '/batch'}
                      icon="BATCH"
                      label={<FormattedMessage {...messages.batch} />}
                      onClick={() => this.setExpandedSubMenu(null)}
                    />
                    <MenuItem
                      path="/shipment"
                      isActive={`/${location.pathname.split('/')[1]}` === '/shipment'}
                      icon="SHIPMENT"
                      label={<FormattedMessage {...messages.shipment} />}
                      onClick={() => this.setExpandedSubMenu(null)}
                    />
                    <MenuItem
                      path="/product"
                      isActive={`/${location.pathname.split('/')[1]}` === '/product'}
                      icon="PRODUCT"
                      label={<FormattedMessage {...messages.product} />}
                      onClick={() => this.setExpandedSubMenu(null)}
                    />
                    <MenuItem
                      path="/warehouse"
                      isActive={`/${location.pathname.split('/')[1]}` === '/warehouse'}
                      icon="WAREHOUSE"
                      label={<FormattedMessage {...messages.warehouse} />}
                      onClick={() => this.setExpandedSubMenu(null)}
                    />
                    <SubMenu
                      id="network"
                      isExpanded={expandedSubMenu === 'network'}
                      hasActiveChild={
                        `/${location.pathname.split('/')[1]}` === '/partner' ||
                        `/${location.pathname.split('/')[1]}` === '/staff'
                      }
                      icon="NETWORK"
                      label={<FormattedMessage {...messages.network} />}
                      onClick={(id: ?string) => this.setExpandedSubMenu(id)}
                    >
                      <MenuItem
                        path="/partner"
                        isActive={`/${location.pathname.split('/')[1]}` === '/partner'}
                        icon="PARTNER"
                        label={<FormattedMessage {...messages.partner} />}
                        onClick={() => this.setExpandedSubMenu(null)}
                      />
                      <MenuItem
                        path="/staff"
                        isActive={`/${location.pathname.split('/')[1]}` === '/staff'}
                        icon="STAFF"
                        label={<FormattedMessage {...messages.staff} />}
                        onClick={() => this.setExpandedSubMenu(null)}
                      />
                    </SubMenu>
                    <SubMenu
                      id="settings"
                      isExpanded={expandedSubMenu === 'settings'}
                      hasActiveChild={`/${location.pathname.split('/')[1]}` === '/tags'}
                      icon="SETTINGS"
                      label={<FormattedMessage {...messages.settings} />}
                      onClick={(id: ?string) => this.setExpandedSubMenu(id)}
                    >
                      <MenuItem
                        path="/tags"
                        isActive={`/${location.pathname.split('/')[1]}` === '/tags'}
                        icon="TAG"
                        label={<FormattedMessage {...messages.tags} />}
                        onClick={() => this.setExpandedSubMenu(null)}
                      />
                    </SubMenu>
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
