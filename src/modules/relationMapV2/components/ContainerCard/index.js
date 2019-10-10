// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { FocusedView } from 'modules/relationMapV2/store';
import { useEntityHasPermissions } from 'components/Context/Permissions';
import { CONTAINER_DELETE } from 'modules/permission/constants/container';
import Tag from 'components/Tag';
import FormattedDate from 'components/FormattedDate';
import { Display, Blackout, Label } from 'components/Form';
import {
  ContainerCardWrapperStyle,
  TopRowWrapperStyle,
  TagsWrapperStyle,
  BottomRowWrapperStyle,
  DeliveryWarehouseWrapperStyle,
  DeleteButtonStyle,
} from './style';

type Props = {|
  container: Object,
  onDeleteContainer?: Event => void,
|};

export default function ContainerCard({ container, onDeleteContainer }: Props) {
  const { selectors } = FocusedView.useContainer();
  const hasPermissions = useEntityHasPermissions(container);
  const allowToDeleteContainer = hasPermissions(CONTAINER_DELETE);
  const {
    no,
    tags = [],
    warehouse,
    warehouseArrivalAgreedDate,
    warehouseArrivalActualDate,
  } = container;

  const warehouseArrival = warehouseArrivalActualDate || warehouseArrivalAgreedDate;

  // TODO: Replace with real permissions
  const canViewNo = true;
  const canViewTags = true;
  const canViewWarehouse = true;
  const canViewWarehouseArrival = true;

  return (
    <div className={ContainerCardWrapperStyle}>
      <div className={TopRowWrapperStyle}>
        <Display blackout={!canViewNo}>{no}</Display>

        {canViewTags ? (
          <div className={TagsWrapperStyle}>
            {tags.map(tag => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </div>
        ) : (
          <Blackout />
        )}
      </div>

      <div className={BottomRowWrapperStyle}>
        <div className={DeliveryWarehouseWrapperStyle}>
          <Label width="75px">
            <FormattedMessage id="components.cards.delivery" />
          </Label>
          <Display
            blackout={!canViewWarehouse}
            width="150px"
            color={warehouse?.id ? 'BLACK' : 'GRAY_LIGHT'}
          >
            {warehouse?.name ?? (
              <FormattedMessage id="components.cards.noWarehouse" defaultMessage="No warehouse" />
            )}
          </Display>
        </div>

        <Display blackout={!canViewWarehouseArrival}>
          <FormattedDate value={warehouseArrival} mode="datetime" />
        </Display>
      </div>

      {allowToDeleteContainer && selectors.isShipmentFocus && (
        <button onClick={onDeleteContainer} className={DeleteButtonStyle} type="button">
          <Icon icon="REMOVE" />
        </button>
      )}
    </div>
  );
}
