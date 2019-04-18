// @flow
import React, { useState } from 'react';
import { Location } from '@reach/router';
import {
  RM_ORDER_FOCUS_LIST,
  RM_PRODUCT_FOCUS_LIST,
} from 'modules/permission/constants/relationMap';
import { ORDER_LIST } from 'modules/permission/constants/order';
import { BATCH_LIST } from 'modules/permission/constants/batch';
import { SHIPMENT_LIST } from 'modules/permission/constants/shipment';
import { CONTAINER_LIST } from 'modules/permission/constants/container';
import { PRODUCT_LIST } from 'modules/permission/constants/product';
import { WAREHOUSE_LIST } from 'modules/permission/constants/warehouse';
import { TAG_LIST } from 'modules/permission/constants/tag';
import { CUSTOM_FIELD_DEFINITIONS_LIST } from 'modules/permission/constants/customFields';
import { TEMPLATE_LIST } from 'modules/permission/constants/template';
import { PARTNER_LIST } from 'modules/permission/constants/partner';
import { STAFF_LIST } from 'modules/permission/constants/staff';
import { TASK_LIST, TASK_TEMPLATE_LIST } from 'modules/permission/constants/task';
import usePermission from 'hooks/usePermission';
import { FormattedMessage } from 'react-intl';
import { UIConsumer } from 'modules/ui';
import { Logo, MenuItem, SubMenu } from './components';
import { SideBarWrapperStyle, SideBarBodyStyle } from './style';
import messages from './messages';

const SideBar = () => {
  const [expandedSubMenu, setExpandedSubMenu] = useState(null);
  const { hasPermission } = usePermission();

  const hasOrdersMenu = hasPermission(ORDER_LIST) || hasPermission(BATCH_LIST);

  const hasShipmentsMenu = hasPermission(SHIPMENT_LIST) || hasPermission(CONTAINER_LIST);

  const hasNetworkMenu =
    hasPermission(WAREHOUSE_LIST) || hasPermission(PARTNER_LIST) || hasPermission(STAFF_LIST);

  const hasTemplatesMenu =
    hasPermission(CUSTOM_FIELD_DEFINITIONS_LIST) ||
    hasPermission(TEMPLATE_LIST) ||
    hasPermission(TASK_TEMPLATE_LIST);

  return (
    <Location>
      {({ location }) =>
        location.pathname !== '/login' && (
          <UIConsumer>
            {uiState => (
              <div className={SideBarWrapperStyle(uiState.isSideBarExpanded)}>
                <Logo {...uiState} />
                <div className={SideBarBodyStyle}>
                  {(hasPermission(RM_ORDER_FOCUS_LIST) || hasPermission(RM_PRODUCT_FOCUS_LIST)) && (
                    <MenuItem
                      path="/relation-map"
                      isActive={`/${location.pathname.split('/')[1]}` === '/relation-map'}
                      icon="RELATION_MAP"
                      label={<FormattedMessage {...messages.relationMap} />}
                      onClick={() => setExpandedSubMenu(null)}
                    />
                  )}

                  {hasOrdersMenu && (
                    <SubMenu
                      id="order"
                      isExpanded={expandedSubMenu === 'order'}
                      hasActiveChild={
                        `/${location.pathname.split('/')[1]}` === '/order' ||
                        `/${location.pathname.split('/')[1]}` === '/batch'
                      }
                      icon="ORDER"
                      label={<FormattedMessage {...messages.order} />}
                      onClick={(id: ?string) => setExpandedSubMenu(id)}
                    >
                      {hasPermission(ORDER_LIST) && (
                        <MenuItem
                          path="/order"
                          isActive={`/${location.pathname.split('/')[1]}` === '/order'}
                          icon="ORDER"
                          label={<FormattedMessage {...messages.order} />}
                          onClick={() => setExpandedSubMenu(null)}
                        />
                      )}
                      {hasPermission(BATCH_LIST) && (
                        <MenuItem
                          path="/batch"
                          isActive={`/${location.pathname.split('/')[1]}` === '/batch'}
                          icon="BATCH"
                          label={<FormattedMessage {...messages.batch} />}
                          onClick={() => setExpandedSubMenu(null)}
                        />
                      )}
                    </SubMenu>
                  )}

                  {hasShipmentsMenu && (
                    <SubMenu
                      id="shipment"
                      isExpanded={expandedSubMenu === 'shipment'}
                      hasActiveChild={
                        `/${location.pathname.split('/')[1]}` === '/shipment' ||
                        `/${location.pathname.split('/')[1]}` === '/container'
                      }
                      icon="SHIPMENT"
                      label={<FormattedMessage {...messages.shipment} />}
                      onClick={(id: ?string) => setExpandedSubMenu(id)}
                    >
                      {hasPermission(SHIPMENT_LIST) && (
                        <MenuItem
                          path="/shipment"
                          isActive={`/${location.pathname.split('/')[1]}` === '/shipment'}
                          icon="SHIPMENT"
                          label={<FormattedMessage {...messages.shipment} />}
                          onClick={() => setExpandedSubMenu(null)}
                        />
                      )}
                      {hasPermission(CONTAINER_LIST) && (
                        <MenuItem
                          path="/container"
                          isActive={`/${location.pathname.split('/')[1]}` === '/container'}
                          icon="CONTAINER"
                          label={<FormattedMessage {...messages.container} />}
                          onClick={() => setExpandedSubMenu(null)}
                        />
                      )}
                    </SubMenu>
                  )}

                  {hasPermission(PRODUCT_LIST) && (
                    <MenuItem
                      path="/product"
                      isActive={`/${location.pathname.split('/')[1]}` === '/product'}
                      icon="PRODUCT"
                      label={<FormattedMessage {...messages.product} />}
                      onClick={() => setExpandedSubMenu(null)}
                    />
                  )}

                  {hasPermission(TASK_LIST) && (
                    <MenuItem
                      path="/task"
                      isActive={`/${location.pathname.split('/')[1]}` === '/task'}
                      icon="TASK"
                      label={<FormattedMessage {...messages.task} />}
                      onClick={() => setExpandedSubMenu(null)}
                    />
                  )}

                  {hasNetworkMenu && (
                    <SubMenu
                      id="network"
                      isExpanded={expandedSubMenu === 'network'}
                      hasActiveChild={
                        `/${location.pathname.split('/')[1]}` === '/warehouse' ||
                        `/${location.pathname.split('/')[1]}` === '/partner' ||
                        `/${location.pathname.split('/')[1]}` === '/staff'
                      }
                      icon="NETWORK"
                      label={<FormattedMessage {...messages.network} />}
                      onClick={(id: ?string) => setExpandedSubMenu(id)}
                    >
                      {hasPermission(WAREHOUSE_LIST) && (
                        <MenuItem
                          path="/warehouse"
                          isActive={`/${location.pathname.split('/')[1]}` === '/warehouse'}
                          icon="WAREHOUSE"
                          label={<FormattedMessage {...messages.warehouse} />}
                          onClick={() => setExpandedSubMenu(null)}
                        />
                      )}
                      {hasPermission(PARTNER_LIST) && (
                        <MenuItem
                          path="/partner"
                          isActive={`/${location.pathname.split('/')[1]}` === '/partner'}
                          icon="PARTNER"
                          label={<FormattedMessage {...messages.partner} />}
                          onClick={() => setExpandedSubMenu(null)}
                        />
                      )}
                      {hasPermission(STAFF_LIST) && (
                        <MenuItem
                          path="/staff"
                          isActive={`/${location.pathname.split('/')[1]}` === '/staff'}
                          icon="STAFF"
                          label={<FormattedMessage {...messages.staff} />}
                          onClick={() => setExpandedSubMenu(null)}
                        />
                      )}
                    </SubMenu>
                  )}

                  {hasTemplatesMenu && (
                    <SubMenu
                      id="templates"
                      isExpanded={expandedSubMenu === 'templates'}
                      hasActiveChild={
                        `/${location.pathname.split('/')[2]}` === '/metadata' ||
                        `/${location.pathname.split('/')[2]}` === '/table-template' ||
                        `/${location.pathname.split('/')[2]}` === '/task-template'
                      }
                      icon="TEMPLATE"
                      label={<FormattedMessage {...messages.templates} />}
                      onClick={(id: ?string) => setExpandedSubMenu(id)}
                    >
                      {hasPermission(CUSTOM_FIELD_DEFINITIONS_LIST) && (
                        <MenuItem
                          path="/templates/metadata/order"
                          isActive={`/${location.pathname.split('/')[2]}` === '/metadata'}
                          icon="METADATA"
                          label={<FormattedMessage {...messages.metadata} />}
                          onClick={() => setExpandedSubMenu(null)}
                        />
                      )}

                      {hasPermission(TEMPLATE_LIST) && (
                        <MenuItem
                          path="/templates/table-template"
                          isActive={`/${location.pathname.split('/')[2]}` === '/table-template'}
                          icon="EDIT_TABLE"
                          label={<FormattedMessage {...messages.template} />}
                          onClick={() => setExpandedSubMenu(null)}
                        />
                      )}

                      {hasPermission(TASK_TEMPLATE_LIST) && (
                        <MenuItem
                          path="/templates/task-template/order"
                          isActive={`/${location.pathname.split('/')[2]}` === '/task-template'}
                          icon="TASK"
                          label={
                            <FormattedMessage id="modules.SideBar.task" defaultMessage="TASKS" />
                          }
                          onClick={() => setExpandedSubMenu(null)}
                        />
                      )}
                    </SubMenu>
                  )}

                  {hasPermission(TAG_LIST) && (
                    <MenuItem
                      path="/tags"
                      isActive={`/${location.pathname.split('/')[1]}` === '/tags'}
                      icon="TAG"
                      label={<FormattedMessage {...messages.tags} />}
                      onClick={() => setExpandedSubMenu(null)}
                    />
                  )}
                </div>
              </div>
            )}
          </UIConsumer>
        )
      }
    </Location>
  );
};

export default SideBar;
