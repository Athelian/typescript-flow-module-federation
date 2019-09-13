// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { useHasPermissions } from 'components/Context/Permissions';
import { BATCH_DELETE } from 'modules/permission/constants/batch';
import { WrapperStyle, TrashIconsStyle } from './style';

type Props = {|
  no: string,
  onDeleteBatch: Event => void,
  organizationId: string,
|};

export default function BatchCard({ no, onDeleteBatch, organizationId }: Props) {
  const hasPermissions = useHasPermissions(organizationId);
  const allowToDeleteItem = hasPermissions(BATCH_DELETE);
  return (
    <div className={WrapperStyle}>
      {allowToDeleteItem && (
        <div onClick={onDeleteBatch} role="presentation" className={`${TrashIconsStyle} icons`}>
          <Icon icon="REMOVE" />
        </div>
      )}
      {no}
    </div>
  );
}
