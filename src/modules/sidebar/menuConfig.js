// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import farPOV from '@fortawesome/fontawesome-pro-regular/faGlasses';
import fasPOV from '@fortawesome/fontawesome-pro-solid/faGlasses';
import farSales from '@fortawesome/fontawesome-pro-regular/faStreetView';
import fasSales from '@fortawesome/fontawesome-pro-solid/faStreetView';
import farShip from '@fortawesome/fontawesome-pro-regular/faShip';
import fasShip from '@fortawesome/fontawesome-pro-solid/faShip';
import farBatch from '@fortawesome/fontawesome-pro-regular/faBox';
import fasBatch from '@fortawesome/fontawesome-pro-solid/faBox';
import farOrder from '@fortawesome/fontawesome-pro-regular/faFileEdit';
import fasOrder from '@fortawesome/fontawesome-pro-solid/faFileEdit';
import farProduct from '@fortawesome/fontawesome-pro-regular/faCube';
import fasProduct from '@fortawesome/fontawesome-pro-solid/faCube';
import farNetwork from '@fortawesome/fontawesome-pro-regular/faAddressBook';
import fasNetwork from '@fortawesome/fontawesome-pro-solid/faAddressBook';
import farPartner from '@fortawesome/fontawesome-pro-regular/faHandshake';
import fasPartner from '@fortawesome/fontawesome-pro-solid/faHandshake';
import farStaff from '@fortawesome/fontawesome-pro-regular/faUsers';
import fasStaff from '@fortawesome/fontawesome-pro-solid/faUsers';
import farWarehouse from '@fortawesome/fontawesome-pro-regular/faWarehouseAlt';
import fasWarehouse from '@fortawesome/fontawesome-pro-solid/faWarehouseAlt';
import farSettings from '@fortawesome/fontawesome-pro-regular/faCog';
import fasSettings from '@fortawesome/fontawesome-pro-solid/faCog';
import farTags from '@fortawesome/fontawesome-pro-regular/faTags';
import fasTags from '@fortawesome/fontawesome-pro-solid/faTags';
import messages from './messages';

export type MenuItemType = {|
  type: 'menuitem',
  id: number,
  name: React.Element<*>,
  activeIcon: any,
  inactiveIcon: any,
  path: string,
|};

type SubMenuType = {|
  type: 'submenu',
  id: number,
  name: React.Element<*>,
  activeIcon: any,
  inactiveIcon: any,
  menuItems: Array<{|
    name: React.Element<*>,
    activeIcon: any,
    inactiveIcon: any,
    path: string,
  |}>,
|};

type MenuConfig = Array<MenuItemType | SubMenuType>;

const menuConfig: MenuConfig = [
  {
    type: 'submenu',
    id: 0,
    name: <FormattedMessage {...messages.pov} />,
    inactiveIcon: farPOV,
    activeIcon: fasPOV,
    menuItems: [
      {
        name: <FormattedMessage {...messages.sales} />,
        inactiveIcon: farSales,
        activeIcon: fasSales,
        path: '/pov/sales',
      },
    ],
  },
  {
    type: 'menuitem',
    id: 1,
    name: <FormattedMessage {...messages.order} />,
    inactiveIcon: farOrder,
    activeIcon: fasOrder,
    path: '/order',
  },
  {
    type: 'menuitem',
    id: 2,
    name: <FormattedMessage {...messages.batch} />,
    inactiveIcon: farBatch,
    activeIcon: fasBatch,
    path: '/batch',
  },
  {
    type: 'menuitem',
    id: 3,
    name: <FormattedMessage {...messages.shipment} />,
    inactiveIcon: farShip,
    activeIcon: fasShip,
    path: '/shipment',
  },
  {
    type: 'menuitem',
    id: 4,
    name: <FormattedMessage {...messages.product} />,
    inactiveIcon: farProduct,
    activeIcon: fasProduct,
    path: '/product',
  },
  {
    type: 'menuitem',
    id: 5,
    name: <FormattedMessage {...messages.warehouse} />,
    inactiveIcon: farWarehouse,
    activeIcon: fasWarehouse,
    path: '/warehouse',
  },
  {
    type: 'submenu',
    id: 6,
    name: <FormattedMessage {...messages.network} />,
    inactiveIcon: farNetwork,
    activeIcon: fasNetwork,
    menuItems: [
      {
        name: <FormattedMessage {...messages.partner} />,
        inactiveIcon: farPartner,
        activeIcon: fasPartner,
        path: '/partner',
      },
      {
        name: <FormattedMessage {...messages.staff} />,
        inactiveIcon: farStaff,
        activeIcon: fasStaff,
        path: '/staff',
      },
    ],
  },
  {
    type: 'submenu',
    id: 7,
    name: <FormattedMessage {...messages.settings} />,
    inactiveIcon: farSettings,
    activeIcon: fasSettings,
    menuItems: [
      {
        name: <FormattedMessage {...messages.tags} />,
        inactiveIcon: farTags,
        activeIcon: fasTags,
        path: '/tags',
      },
    ],
  },
];

export default menuConfig;
