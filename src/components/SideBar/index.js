// @flow
import React from 'react';
import { Location } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import {
  RM_ORDER_FOCUS_LIST,
  RM_PRODUCT_FOCUS_LIST,
} from 'modules/permission/constants/relationMap';
import { ORDER_LIST } from 'modules/permission/constants/order';
import { ORDER_ITEMS_LIST } from 'modules/permission/constants/orderItem';
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
import { PROJECT_LIST } from 'modules/permission/constants/project';
import { DOCUMENT_LIST } from 'modules/permission/constants/file';
import {
  PROJECT_TEMPLATE_LIST,
  TASK_LIST,
  TASK_TEMPLATE_LIST,
} from 'modules/permission/constants/task';
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
  beta?: boolean,
  submenu?: Array<{
    label: any,
    icon: string,
    path: string,
    overrideFullPath?: string,
    permitted?: HasPermissions => boolean,
    hidden?: boolean,
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
      hasPermissions(ORDER_LIST) ||
      hasPermissions(RM_ORDER_FOCUS_LIST) ||
      hasPermissions(RM_PRODUCT_FOCUS_LIST),
    submenu: [
      {
        label: <FormattedMessage {...messages.relationMap} />,
        icon: 'RELATION_MAP',
        path: 'relation-map',
        legacy: true,
      },
      {
        label: <FormattedMessage {...messages.map} />,
        icon: 'MAP',
        path: 'map',
        beta: true,
      },
      {
        label: <FormattedMessage {...messages.table} />,
        icon: 'TABLE',
        path: 'table',
        beta: true,
      },
      {
        label: <FormattedMessage {...messages.cards} />,
        icon: 'CARDS',
        path: 'cards',
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.orderItem} />,
    icon: 'ORDER_ITEM',
    path: 'order-item',
    permitted: hasPermissions => hasPermissions(ORDER_ITEMS_LIST),
  },
  {
    label: <FormattedMessage {...messages.batch} />,
    icon: 'BATCH',
    path: 'batch',
    permitted: hasPermissions => hasPermissions(BATCH_LIST),
  },
  {
    label: <FormattedMessage {...messages.shipment} />,
    icon: 'SHIPMENT',
    path: 'shipment',
    permitted: hasPermissions => hasPermissions(SHIPMENT_LIST),
    submenu: [
      {
        label: <FormattedMessage {...messages.map} />,
        icon: 'MAP',
        path: 'map',
        beta: true,
      },
      {
        label: <FormattedMessage {...messages.table} />,
        icon: 'TABLE',
        path: 'table',
        beta: true,
        hidden: !isEnableBetaFeature,
      },
      {
        label: <FormattedMessage {...messages.cards} />,
        icon: 'CARDS',
        path: 'cards',
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.container} />,
    icon: 'CONTAINER',
    path: 'container',
    permitted: hasPermissions => hasPermissions(CONTAINER_LIST),
  },
  {
    label: <FormattedMessage {...messages.product} />,
    icon: 'PRODUCT',
    path: 'product',
    permitted: hasPermissions => hasPermissions(PRODUCT_LIST, RM_PRODUCT_FOCUS_LIST),
    submenu: [
      {
        label: <FormattedMessage {...messages.cards} />,
        icon: 'PRODUCT',
        path: 'product',
        overrideFullPath: 'product',
        permitted: hasPermissions => hasPermissions(PRODUCT_LIST),
      },
      {
        label: <FormattedMessage {...messages.map} />,
        icon: 'MAP',
        path: 'map',
        permitted: hasPermissions => hasPermissions(RM_PRODUCT_FOCUS_LIST),
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.project} />,
    icon: 'PROJECT',
    path: 'project',
    permitted: hasPermissions => hasPermissions([PROJECT_LIST, TASK_LIST]),
    submenu: [
      {
        label: <FormattedMessage {...messages.project} />,
        icon: 'PROJECT',
        path: 'project',
        overrideFullPath: 'project',
        permitted: hasPermissions => hasPermissions(PROJECT_LIST),
      },
      {
        label: <FormattedMessage {...messages.task} />,
        icon: 'TASK',
        path: 'task',
        overrideFullPath: 'task',
        permitted: hasPermissions => hasPermissions(TASK_LIST),
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.documents} />,
    icon: 'DOCUMENT',
    path: 'document',
    permitted: hasPermissions => hasPermissions(DOCUMENT_LIST),
  },
  {
    label: <FormattedMessage {...messages.network} />,
    icon: 'NETWORK',
    path: 'network',
    permitted: hasPermissions => hasPermissions([WAREHOUSE_LIST, PARTNER_LIST, STAFF_LIST]),
    submenu: [
      {
        label: <FormattedMessage {...messages.warehouse} />,
        icon: 'WAREHOUSE',
        path: 'warehouse',
        overrideFullPath: 'warehouse',
        permitted: hasPermissions => hasPermissions(WAREHOUSE_LIST),
      },
      {
        label: <FormattedMessage {...messages.partner} />,
        icon: 'PARTNER',
        path: 'partner',
        overrideFullPath: 'partner',
        permitted: hasPermissions => hasPermissions(PARTNER_LIST),
      },
      {
        label: <FormattedMessage {...messages.staff} />,
        icon: 'STAFF',
        path: 'staff',
        overrideFullPath: 'staff',
        permitted: hasPermissions => hasPermissions(STAFF_LIST),
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.templates} />,
    icon: 'TEMPLATE',
    path: 'templates',
    permitted: hasPermissions =>
      hasPermissions([
        CUSTOM_FIELD_DEFINITIONS_LIST,
        TEMPLATE_LIST,
        TASK_TEMPLATE_LIST,
        PROJECT_TEMPLATE_LIST,
      ]),
    submenu: [
      {
        label: <FormattedMessage {...messages.metadata} />,
        icon: 'METADATA',
        path: 'metadata',
        permitted: hasPermissions => hasPermissions(CUSTOM_FIELD_DEFINITIONS_LIST),
      },
      {
        label: <FormattedMessage {...messages.template} />,
        icon: 'EDIT_TABLE',
        path: 'table-template',
        permitted: hasPermissions => hasPermissions(TEMPLATE_LIST),
      },
      {
        label: <FormattedMessage {...messages.taskTemplate} />,
        icon: 'TASK',
        path: 'task-template',
        permitted: hasPermissions => hasPermissions(TASK_TEMPLATE_LIST),
      },
      {
        label: <FormattedMessage {...messages.project} />,
        icon: 'PROJECT',
        path: 'project',
        permitted: hasPermissions => hasPermissions(PROJECT_TEMPLATE_LIST),
      },
    ],
  },
  {
    label: <FormattedMessage {...messages.tags} />,
    icon: 'TAG',
    path: 'tags',
    permitted: hasPermissions => hasPermissions(TAG_LIST),
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
