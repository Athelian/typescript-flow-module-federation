// @flow
import React from 'react';
import { Location } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import {
  NAVIGATION_ORDERS_MAP,
  NAVIGATION_ORDERS_TABLE,
  NAVIGATION_ORDERS_CARD,
  NAVIGATION_ORDER_ITEMS_CARD,
  NAVIGATION_BATCH_TABLE,
  NAVIGATION_BATCH_CARD,
  NAVIGATION_SHIPMENTS_MAP,
  NAVIGATION_SHIPMENTS_TABLE,
  NAVIGATION_SHIPMENTS_TABLE_BETA,
  NAVIGATION_SHIPMENTS_CARD,
  NAVIGATION_CONTAINERS_CARD,
  NAVIGATION_PRODUCTS_CARD,
  NAVIGATION_PROJECTS_TABLE,
  NAVIGATION_PROJECTS_TABLE_BETA,
  NAVIGATION_PROJECTS_CARD,
  NAVIGATION_TASKS_CARD,
  NAVIGATION_DOCUMENTS_CARD,
  NAVIGATION_NETWORK_WAREHOUSES,
  NAVIGATION_NETWORK_PARTNERS,
  NAVIGATION_NETWORK_USERS,
  NAVIGATION_TEMPLATES_CUSTOM_FILEDS,
  NAVIGATION_TEMPLATES_TABLE,
  NAVIGATION_TEMPLATES_TASKS,
  NAVIGATION_TEMPLATES_PROJECTS,
  NAVIGATION_TAGS_CARD,
} from 'modules/permission/constants/navigation';

import { useViewerHasPermissions, type HasPermissions } from 'contexts/Permissions';
import useUser from 'hooks/useUser';
import { useUI } from 'contexts/UI';
import { isEnableBetaFeature } from 'utils/env';
import { Logo, MenuItem, SubMenu } from './components';
import { SideBarWrapperStyle, SideBarBodyStyle } from './style';
import messages from './messages';

type MenuConfig = {
  label: any,
  icon: string,
  path: string,
  permitted?: HasPermissions => boolean,
  hidden?: boolean,
  legacy?: boolean,
  href?: string,
  beta?: boolean,
  submenu?: Array<{
    label: any,
    icon: string,
    path: string,
    overrideFullPath?: string,
    permitted?: HasPermissions => boolean,
    hidden?: boolean,
    href?: string,
    beta?: boolean,
    legacy?: boolean,
  }>,
};

const menu: Array<MenuConfig> = [
  {
    label: <FormattedMessage {...messages.order} />,
    icon: 'ORDER',
    path: 'order',
    permitted: hasPermissions =>
      hasPermissions([NAVIGATION_ORDERS_MAP, NAVIGATION_ORDERS_TABLE, NAVIGATION_ORDERS_CARD]),
    submenu: [
      {
        label: <FormattedMessage {...messages.map} />,
        icon: 'MAP',
        path: 'map',
        permitted: hasPermissions => hasPermissions(NAVIGATION_ORDERS_MAP),
      },
      {
        label: <FormattedMessage {...messages.table} />,
        icon: 'TABLE',
        path: 'table',
        permitted: hasPermissions => hasPermissions(NAVIGATION_ORDERS_TABLE),
      },
      {
        label: <FormattedMessage {...messages.cards} />,
        icon: 'CARDS',
        path: 'cards',
        permitted: hasPermissions => hasPermissions(NAVIGATION_ORDERS_CARD),
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.orderItem} />,
    icon: 'ORDER_ITEM',
    path: 'order-item',
    permitted: hasPermissions => hasPermissions(NAVIGATION_ORDER_ITEMS_CARD),
    submenu: [
      {
        label: <FormattedMessage {...messages.cards} />,
        icon: 'CARDS',
        path: 'cards',
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.batch} />,
    icon: 'BATCH',
    path: 'batch',
    permitted: hasPermissions => hasPermissions([NAVIGATION_BATCH_TABLE, NAVIGATION_BATCH_CARD]),
    submenu: [
      {
        label: <FormattedMessage {...messages.table} />,
        icon: 'TABLE',
        path: 'table',
        permitted: hasPermissions => hasPermissions(NAVIGATION_BATCH_TABLE),
      },
      {
        label: <FormattedMessage {...messages.cards} />,
        icon: 'CARDS',
        path: 'cards',
        permitted: hasPermissions => hasPermissions(NAVIGATION_BATCH_CARD),
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.shipment} />,
    icon: 'SHIPMENT',
    path: 'shipment',
    permitted: hasPermissions =>
      hasPermissions([
        NAVIGATION_SHIPMENTS_MAP,
        NAVIGATION_SHIPMENTS_TABLE,
        NAVIGATION_SHIPMENTS_TABLE_BETA,
        NAVIGATION_SHIPMENTS_CARD,
      ]),
    submenu: [
      {
        label: <FormattedMessage {...messages.map} />,
        icon: 'MAP',
        path: 'map',
        permitted: hasPermissions => hasPermissions(NAVIGATION_SHIPMENTS_MAP),
      },
      {
        label: <FormattedMessage {...messages.table} />,
        icon: 'TABLE',
        path: 'table',
        permitted: hasPermissions => hasPermissions(NAVIGATION_SHIPMENTS_TABLE),
      },
      {
        label: <FormattedMessage {...messages.newTable} />,
        icon: 'TABLE',
        path: 'newTable',
        href: `${window.location.origin}/new/shipment/table`,
        permitted: hasPermissions => hasPermissions(NAVIGATION_SHIPMENTS_TABLE_BETA),
      },
      {
        label: <FormattedMessage {...messages.cards} />,
        icon: 'CARDS',
        path: 'cards',
        permitted: hasPermissions => hasPermissions(NAVIGATION_SHIPMENTS_CARD),
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.container} />,
    icon: 'CONTAINER',
    path: 'container',
    permitted: hasPermissions => hasPermissions(NAVIGATION_CONTAINERS_CARD),
    submenu: [
      {
        label: <FormattedMessage {...messages.cards} />,
        icon: 'CARDS',
        path: 'cards',
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.product} />,
    icon: 'PRODUCT',
    path: 'product',
    permitted: hasPermissions => hasPermissions(NAVIGATION_PRODUCTS_CARD),
    submenu: [
      {
        label: <FormattedMessage {...messages.cards} />,
        icon: 'CARDS',
        path: 'cards',
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.project} />,
    icon: 'PROJECT',
    path: 'project',
    permitted: hasPermissions =>
      hasPermissions([
        NAVIGATION_PROJECTS_TABLE,
        NAVIGATION_PROJECTS_TABLE_BETA,
        NAVIGATION_PROJECTS_CARD,
      ]),
    submenu: [
      {
        label: <FormattedMessage {...messages.table} />,
        icon: 'TABLE',
        path: 'table',
        permitted: hasPermissions => hasPermissions(NAVIGATION_PROJECTS_TABLE),
      },
      {
        label: <FormattedMessage {...messages.newProject} />,
        icon: 'TABLE',
        path: 'newTable',
        href: `${window.location.origin}/new/project/table`,
        permitted: hasPermissions => hasPermissions(NAVIGATION_PROJECTS_TABLE_BETA),
      },
      {
        label: <FormattedMessage {...messages.cards} />,
        icon: 'CARDS',
        path: 'cards',
        permitted: hasPermissions => hasPermissions(NAVIGATION_PROJECTS_CARD),
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.task} />,
    icon: 'TASK',
    path: 'task',
    permitted: hasPermissions => hasPermissions(NAVIGATION_TASKS_CARD),
    submenu: [
      {
        label: <FormattedMessage {...messages.cards} />,
        icon: 'CARDS',
        path: 'cards',
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.documents} />,
    icon: 'DOCUMENT',
    path: 'document',
    permitted: hasPermissions => hasPermissions(NAVIGATION_DOCUMENTS_CARD),
    submenu: [
      {
        label: <FormattedMessage {...messages.cards} />,
        icon: 'CARDS',
        path: 'cards',
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.network} />,
    icon: 'NETWORK',
    path: 'network',
    permitted: hasPermissions =>
      hasPermissions([
        NAVIGATION_NETWORK_WAREHOUSES,
        NAVIGATION_NETWORK_PARTNERS,
        NAVIGATION_NETWORK_USERS,
      ]),
    submenu: [
      {
        label: <FormattedMessage {...messages.warehouse} />,
        icon: 'WAREHOUSE',
        path: 'warehouse',
        overrideFullPath: 'warehouse',
        permitted: hasPermissions => hasPermissions(NAVIGATION_NETWORK_WAREHOUSES),
      },
      {
        label: <FormattedMessage {...messages.partner} />,
        icon: 'PARTNER',
        path: 'partner',
        overrideFullPath: 'partner',
        permitted: hasPermissions => hasPermissions(NAVIGATION_NETWORK_PARTNERS),
      },
      {
        label: <FormattedMessage {...messages.staff} />,
        icon: 'STAFF',
        path: 'staff',
        overrideFullPath: 'staff',
        permitted: hasPermissions => hasPermissions(NAVIGATION_NETWORK_USERS),
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.templates} />,
    icon: 'TEMPLATE',
    path: 'templates',
    permitted: hasPermissions =>
      hasPermissions([
        NAVIGATION_TEMPLATES_CUSTOM_FILEDS,
        NAVIGATION_TEMPLATES_TABLE,
        NAVIGATION_TEMPLATES_TASKS,
        NAVIGATION_TEMPLATES_PROJECTS,
      ]),
    submenu: [
      {
        label: <FormattedMessage {...messages.metadata} />,
        icon: 'METADATA',
        path: 'metadata',
        permitted: hasPermissions => hasPermissions(NAVIGATION_TEMPLATES_CUSTOM_FILEDS),
      },
      {
        label: <FormattedMessage {...messages.table} />,
        icon: 'EDIT_TABLE',
        path: 'table-template',
        permitted: hasPermissions => hasPermissions(NAVIGATION_TEMPLATES_TABLE),
      },
      {
        label: <FormattedMessage {...messages.task} />,
        icon: 'TASK',
        path: 'task-template',
        permitted: hasPermissions => hasPermissions(NAVIGATION_TEMPLATES_TASKS),
      },
      {
        label: <FormattedMessage {...messages.project} />,
        icon: 'PROJECT',
        path: 'project',
        permitted: hasPermissions => hasPermissions(NAVIGATION_TEMPLATES_PROJECTS),
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.tags} />,
    icon: 'TAG',
    path: 'tags',
    permitted: hasPermissions => hasPermissions(NAVIGATION_TAGS_CARD),
    submenu: [
      {
        label: <FormattedMessage {...messages.cards} />,
        icon: 'CARDS',
        path: 'cards',
      },
    ],
  },
];

const SideBar = () => {
  const hasPermissions = useViewerHasPermissions();
  const uiState = useUI();
  const { isUsingLegacyFeatures } = useUser();

  return (
    <Location>
      {({ location }) => {
        // Shouldn't happen actually
        if (location.pathname === '/login') {
          return null;
        }

        const pathnameSplit = location.pathname.split('/');

        return (
          <div className={SideBarWrapperStyle(uiState.isSideBarExpanded)}>
            <Logo {...uiState} />
            <div className={SideBarBodyStyle}>
              {menu.map(config => {
                if (config.hidden) {
                  return null;
                }

                if (config.legacy && !isUsingLegacyFeatures() && !isEnableBetaFeature) {
                  return null;
                }

                if (config.permitted && !config.permitted(hasPermissions)) {
                  return null;
                }

                if (!config.submenu) {
                  return (
                    <MenuItem
                      key={config.path}
                      path={`/${config.path}`}
                      isActive={pathnameSplit[1] === config.path}
                      icon={config.icon}
                      label={config.label}
                      isBeta={config.beta}
                    />
                  );
                }

                const activePaths = [
                  config.path,
                  ...config.submenu
                    .filter(subConfig => !!subConfig.overrideFullPath)
                    .map(subConfig => subConfig.overrideFullPath),
                ];

                return (
                  <SubMenu
                    key={config.path}
                    hasActiveChild={activePaths.includes(pathnameSplit[1])}
                    icon={config.icon}
                    label={config.label}
                  >
                    {/* $FlowFixMe already check if submenu is defined */}
                    {config.submenu.map(subConfig => {
                      if (subConfig.hidden) {
                        return null;
                      }
                      if (subConfig.legacy && !isUsingLegacyFeatures() && !isEnableBetaFeature) {
                        return null;
                      }

                      if (subConfig.permitted && !subConfig.permitted(hasPermissions)) {
                        return null;
                      }

                      return (
                        <MenuItem
                          key={subConfig.path}
                          path={
                            subConfig.overrideFullPath
                              ? `/${subConfig.overrideFullPath}`
                              : `/${config.path}/${subConfig.path}`
                          }
                          isActive={
                            subConfig.overrideFullPath
                              ? pathnameSplit[1] === subConfig.overrideFullPath
                              : pathnameSplit[2] === subConfig.path &&
                                activePaths.includes(pathnameSplit[1])
                          }
                          icon={subConfig.icon}
                          label={subConfig.label}
                          isBeta={subConfig.beta}
                          href={subConfig.href}
                        />
                      );
                    })}
                  </SubMenu>
                );
              })}
            </div>
          </div>
        );
      }}
    </Location>
  );
};

export default SideBar;
