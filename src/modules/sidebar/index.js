// @flow
import React from 'react';
import { Location } from '@reach/router';
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
import { TASK_LIST, TASK_TEMPLATE_LIST } from 'modules/permission/constants/task';
import usePermission from 'hooks/usePermission';
import { FormattedMessage } from 'react-intl';
import { UIConsumer } from 'modules/ui';
import { Logo, MenuItem, SubMenu } from './components';
import { SideBarWrapperStyle, SideBarBodyStyle } from './style';
import messages from './messages';
import {
  PATH_RM,
  PATH_ORDER,
  PATH_ORDER_ITEM,
  PATH_BATCH,
  PATH_SHIPMENT,
  PATH_CONTAINER,
  PATH_PRODUCT,
  PATH_TASK,
  PATH_WAREHOUSE,
  PATH_PARTNER,
  PATH_STAFF,
  PATH_METADATA,
  PATH_TABLE_TEMPLATE,
  PATH_TASK_TEMPLATE,
  PATH_TAG,
  PATH_PROJECT,
  PATH_DOCUMENT,
} from './constants';

const SideBar = () => {
  const { hasPermission } = usePermission();
  return (
    <Location>
      {({ location }) => {
        if (location.pathname !== '/login') {
          const pathnameSplit = location.pathname.split('/');
          return (
            <UIConsumer>
              {uiState => (
                <div className={SideBarWrapperStyle(uiState.isSideBarExpanded)}>
                  <Logo {...uiState} />
                  <div className={SideBarBodyStyle}>
                    {(hasPermission(RM_ORDER_FOCUS_LIST) ||
                      hasPermission(RM_PRODUCT_FOCUS_LIST)) && (
                      <MenuItem
                        path={`/${PATH_RM}`}
                        isActive={pathnameSplit[1] === PATH_RM}
                        icon="RELATION_MAP"
                        label={<FormattedMessage {...messages.relationMap} />}
                      />
                    )}
                    {hasPermission([ORDER_LIST, BATCH_LIST, ORDER_ITEMS_LIST]) && (
                      <SubMenu
                        hasActiveChild={[PATH_ORDER, PATH_ORDER_ITEM, PATH_BATCH].includes(
                          pathnameSplit[1]
                        )}
                        icon="ORDER"
                        label={<FormattedMessage {...messages.order} />}
                      >
                        {hasPermission(ORDER_LIST) && (
                          <MenuItem
                            path={`/${PATH_ORDER}`}
                            isActive={pathnameSplit[1] === PATH_ORDER}
                            icon="ORDER"
                            label={<FormattedMessage {...messages.order} />}
                          />
                        )}
                        {hasPermission(ORDER_ITEMS_LIST) && (
                          <MenuItem
                            path={`/${PATH_ORDER_ITEM}`}
                            isActive={pathnameSplit[1] === PATH_ORDER_ITEM}
                            icon="ORDER_ITEM"
                            label={<FormattedMessage {...messages.orderItem} />}
                          />
                        )}
                        {hasPermission(BATCH_LIST) && (
                          <MenuItem
                            path={`/${PATH_BATCH}`}
                            isActive={pathnameSplit[1] === PATH_BATCH}
                            icon="BATCH"
                            label={<FormattedMessage {...messages.batch} />}
                          />
                        )}
                      </SubMenu>
                    )}
                    {hasPermission([SHIPMENT_LIST, CONTAINER_LIST]) && (
                      <SubMenu
                        hasActiveChild={
                          pathnameSplit[1] === PATH_SHIPMENT || pathnameSplit[1] === PATH_CONTAINER
                        }
                        icon="SHIPMENT"
                        label={<FormattedMessage {...messages.shipment} />}
                      >
                        {hasPermission(SHIPMENT_LIST) && (
                          <MenuItem
                            path={`/${PATH_SHIPMENT}`}
                            isActive={pathnameSplit[1] === PATH_SHIPMENT}
                            icon="SHIPMENT"
                            label={<FormattedMessage {...messages.shipment} />}
                          />
                        )}
                        {hasPermission(CONTAINER_LIST) && (
                          <MenuItem
                            path={`/${PATH_CONTAINER}`}
                            isActive={pathnameSplit[1] === PATH_CONTAINER}
                            icon="CONTAINER"
                            label={<FormattedMessage {...messages.container} />}
                          />
                        )}
                      </SubMenu>
                    )}
                    {hasPermission(PRODUCT_LIST) && (
                      <MenuItem
                        path={`/${PATH_PRODUCT}`}
                        isActive={pathnameSplit[1] === PATH_PRODUCT}
                        icon="PRODUCT"
                        label={<FormattedMessage {...messages.product} />}
                      />
                    )}
                    {hasPermission([PROJECT_LIST, TASK_LIST]) && (
                      <SubMenu
                        hasActiveChild={
                          pathnameSplit[1] === PATH_PROJECT || pathnameSplit[1] === PATH_TASK
                        }
                        icon="PROJECT"
                        label={<FormattedMessage {...messages.project} />}
                      >
                        {hasPermission(PROJECT_LIST) && (
                          <MenuItem
                            path={`/${PATH_PROJECT}`}
                            isActive={pathnameSplit[1] === PATH_PROJECT}
                            icon="PROJECT"
                            label={<FormattedMessage {...messages.project} />}
                          />
                        )}
                        {hasPermission(TASK_LIST) && (
                          <MenuItem
                            path={`/${PATH_TASK}`}
                            isActive={pathnameSplit[1] === PATH_TASK}
                            icon="TASK"
                            label={<FormattedMessage {...messages.task} />}
                          />
                        )}
                      </SubMenu>
                    )}
                    {hasPermission(DOCUMENT_LIST) && (
                      <MenuItem
                        path={`/${PATH_DOCUMENT}`}
                        isActive={pathnameSplit[1] === PATH_DOCUMENT}
                        icon="DOCUMENT"
                        label={<FormattedMessage {...messages.document} />}
                      />
                    )}
                    {hasPermission([WAREHOUSE_LIST, PARTNER_LIST, STAFF_LIST]) && (
                      <SubMenu
                        hasActiveChild={
                          pathnameSplit[1] === PATH_WAREHOUSE ||
                          pathnameSplit[1] === PATH_PARTNER ||
                          pathnameSplit[1] === PATH_STAFF
                        }
                        icon="NETWORK"
                        label={<FormattedMessage {...messages.network} />}
                      >
                        {hasPermission(WAREHOUSE_LIST) && (
                          <MenuItem
                            path={`/${PATH_WAREHOUSE}`}
                            isActive={pathnameSplit[1] === PATH_WAREHOUSE}
                            icon="WAREHOUSE"
                            label={<FormattedMessage {...messages.warehouse} />}
                          />
                        )}
                        {hasPermission(PARTNER_LIST) && (
                          <MenuItem
                            path={`/${PATH_PARTNER}`}
                            isActive={pathnameSplit[1] === PATH_PARTNER}
                            icon="PARTNER"
                            label={<FormattedMessage {...messages.partner} />}
                          />
                        )}
                        {hasPermission(STAFF_LIST) && (
                          <MenuItem
                            path={`/${PATH_STAFF}`}
                            isActive={pathnameSplit[1] === PATH_STAFF}
                            icon="STAFF"
                            label={<FormattedMessage {...messages.staff} />}
                          />
                        )}
                      </SubMenu>
                    )}
                    {hasPermission([
                      CUSTOM_FIELD_DEFINITIONS_LIST,
                      TEMPLATE_LIST,
                      TASK_TEMPLATE_LIST,
                    ]) && (
                      <SubMenu
                        hasActiveChild={
                          pathnameSplit[2] === PATH_METADATA ||
                          pathnameSplit[2] === PATH_TABLE_TEMPLATE ||
                          pathnameSplit[2] === PATH_TASK_TEMPLATE
                        }
                        icon="TEMPLATE"
                        label={<FormattedMessage {...messages.templates} />}
                      >
                        {hasPermission(CUSTOM_FIELD_DEFINITIONS_LIST) && (
                          <MenuItem
                            path={`/templates/${PATH_METADATA}`}
                            isActive={pathnameSplit[2] === PATH_METADATA}
                            icon="METADATA"
                            label={<FormattedMessage {...messages.metadata} />}
                          />
                        )}
                        {hasPermission(TEMPLATE_LIST) && (
                          <MenuItem
                            path={`/templates/${PATH_TABLE_TEMPLATE}`}
                            isActive={pathnameSplit[2] === PATH_TABLE_TEMPLATE}
                            icon="EDIT_TABLE"
                            label={<FormattedMessage {...messages.template} />}
                          />
                        )}
                        {hasPermission(TASK_TEMPLATE_LIST) && (
                          <MenuItem
                            path={`/templates/${PATH_TASK_TEMPLATE}`}
                            isActive={pathnameSplit[2] === PATH_TASK_TEMPLATE}
                            icon="TASK"
                            label={
                              <FormattedMessage id="modules.SideBar.task" defaultMessage="TASKS" />
                            }
                          />
                        )}
                      </SubMenu>
                    )}
                    {hasPermission(TAG_LIST) && (
                      <MenuItem
                        path={`/${PATH_TAG}`}
                        isActive={pathnameSplit[1] === PATH_TAG}
                        icon="TAG"
                        label={<FormattedMessage {...messages.tags} />}
                      />
                    )}
                  </div>
                </div>
              )}
            </UIConsumer>
          );
        }
        return null;
      }}
    </Location>
  );
};
export default SideBar;
