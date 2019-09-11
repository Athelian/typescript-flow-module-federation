// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { useHasPermissions } from 'components/Context/Permissions';
import { BATCH_CREATE } from 'modules/permission/constants/batch';
import { WrapperStyle, BatchIconsStyle } from './style';

type Props = {|
  no: string,
  onCreateBatch: Event => void,
  organizationId: string,
|};

export default function OrderItemCard({ no, onCreateBatch, organizationId }: Props) {
  const hasPermissions = useHasPermissions(organizationId);
  const allowToCreateBatch = hasPermissions(BATCH_CREATE);
  return (
    <div className={WrapperStyle}>
      {no}
      {allowToCreateBatch && (
        <div onClick={onCreateBatch} role="presentation" className={BatchIconsStyle}>
          <Icon icon="BATCH" />
          <Icon icon="ADD" />
        </div>
      )}
    </div>
  );
}
