// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FocusedView } from 'modules/relationMapV2/store';
import { useHasPermissions } from 'contexts/Permissions';
import { CONTAINER_DELETE, CONTAINER_FORM } from 'modules/permission/constants/container';
import Tag from 'components/Tag';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import { Display, Blackout, Label } from 'components/Form';
import { FullValueTooltip } from 'components/Tooltip';
import CardActions from 'modules/relationMapV2/components/CardActions';
import { findSummary } from 'modules/container/form/components/ContainerSection/ContainerSummary/helper';
import {
  ContainerCardWrapperStyle,
  TopRowWrapperStyle,
  TagsWrapperStyle,
  BottomRowWrapperStyle,
  DeliveryWarehouseWrapperStyle,
} from './style';

type Props = {|
  container: Object,
  onViewForm: Event => void,
  onDeleteContainer?: Event => void,
  organizationId: string,
|};

export default function ContainerCard({
  container,
  onViewForm,
  onDeleteContainer,
  organizationId,
}: Props) {
  const { selectors } = FocusedView.useContainer();
  const hasPermissions = useHasPermissions(organizationId);
  const allowToViewForm = hasPermissions(CONTAINER_FORM);
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
  const canViewTotalVolume = true;
  const canViewWarehouse = true;
  const canViewWarehouseArrival = true;

  const { totalVolume } = findSummary(container);

  return (
    <div className={ContainerCardWrapperStyle}>
      <div className={TopRowWrapperStyle}>
        <Display blackout={!canViewNo}>
          <FullValueTooltip message={no}>
            <span>{no}</span>
          </FullValueTooltip>
        </Display>

        {canViewTags ? (
          <div className={TagsWrapperStyle}>
            {tags.map(tag => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </div>
        ) : (
          <Blackout />
        )}

        {canViewTotalVolume && (
          <Label width="75px">
            <FormattedMessage id="components.cards.ttlVol" defaultMessage="TTL VOL" />
          </Label>
        )}
      </div>

      <div className={BottomRowWrapperStyle}>
        <div className={DeliveryWarehouseWrapperStyle}>
          <Label width="75px">
            <FormattedMessage id="components.cards.deliveryWarehouse" />
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

        <Display blackout={!canViewTotalVolume}>
          {totalVolume && <FormattedNumber value={totalVolume.value} suffix={totalVolume.metric} />}
        </Display>
      </div>

      <CardActions
        actions={[
          allowToViewForm
            ? {
                label: (
                  <FormattedMessage
                    id="modules.RelationMap.cards.viewForm"
                    defaultMessage="View Form"
                  />
                ),
                onClick: onViewForm,
              }
            : null,
          allowToDeleteContainer && selectors.isShipmentFocus
            ? {
                label: (
                  <FormattedMessage id="modules.RelationMap.cards.delete" defaultMessage="Delete" />
                ),
                onClick: onDeleteContainer,
              }
            : null,
        ].filter(Boolean)}
      />
    </div>
  );
}
