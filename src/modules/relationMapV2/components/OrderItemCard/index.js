// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { useHasPermissions } from 'components/Context/Permissions';
import { BATCH_CREATE } from 'modules/permission/constants/batch';
import { ORDER_ITEMS_DELETE } from 'modules/permission/constants/orderItem';
import { WrapperStyle, BatchIconsStyle, TrashIconsStyle } from './style';

type Props = {|
  no: string,
  onCreateBatch: Event => void,
  onDeleteItem: Event => void,
  organizationId: string,
|};

export default function OrderItemCard({ no, onCreateBatch, onDeleteItem, organizationId }: Props) {
  const hasPermissions = useHasPermissions(organizationId);
  const allowToCreateBatch = hasPermissions(BATCH_CREATE);
  const allowToDeleteItem = hasPermissions(ORDER_ITEMS_DELETE);
  return (
    <div className={WrapperStyle}>
      {allowToDeleteItem && (
        <div onClick={onDeleteItem} role="presentation" className={`${TrashIconsStyle} icons`}>
          <Icon icon="REMOVE" />
        </div>
      )}
      {no}
      {allowToCreateBatch && (
        <div onClick={onCreateBatch} role="presentation" className={`${BatchIconsStyle} icons`}>
          <Icon icon="BATCH" />
          <Icon icon="ADD" />
        </div>
      )}
    </div>
  );
}
