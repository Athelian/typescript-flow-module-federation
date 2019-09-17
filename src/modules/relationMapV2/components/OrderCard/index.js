// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { useHasPermissions } from 'components/Context/Permissions';
import { ORDER_ITEMS_CREATE } from 'modules/permission/constants/orderItem';
import { WrapperStyle, ItemIconsStyle } from './style';

type Props = {|
  poNo: string,
  onCreateItem: Event => void,
  organizationId: string,
|};

export default function OrderCard({ poNo, onCreateItem, organizationId }: Props) {
  const hasPermissions = useHasPermissions(organizationId);
  const allowToCreateItem = hasPermissions(ORDER_ITEMS_CREATE);
  return (
    <div className={WrapperStyle}>
      {poNo}
      {allowToCreateItem && (
        <div onClick={onCreateItem} role="presentation" className={ItemIconsStyle}>
          <Icon icon="ORDER_ITEM" />
          <Icon icon="ADD" />
        </div>
      )}
    </div>
  );
}
