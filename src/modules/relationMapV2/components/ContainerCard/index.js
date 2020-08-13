// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FocusedView } from 'modules/relationMapV2/store';
import type { UserPayload } from 'generated/graphql';
import { useHasPermissions } from 'contexts/Permissions';
import { CONTAINER_DELETE, CONTAINER_FORM } from 'modules/permission/constants/container';
import Tag from 'components/Tag';
import FormattedDateTZ from 'components/FormattedDateTZ';
import FormattedNumber from 'components/FormattedNumber';
import { Display, Blackout, Label } from 'components/Form';
import { FullValueTooltip, Tooltip } from 'components/Tooltip';
import Divider from 'components/Divider';
import CardActions from 'modules/relationMapV2/components/CardActions';
import { getMaxVolume } from 'utils/container';
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
  user: UserPayload,
|};

export default function ContainerCard({
  container,
  onViewForm,
  onDeleteContainer,
  organizationId,
  user,
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
    totalVolume,
    containerType,
  } = container;

  const warehouseArrival = warehouseArrivalActualDate || warehouseArrivalAgreedDate;

  const maxVolumeValue = getMaxVolume(containerType);

  // TODO: Replace with real permissions
  const canViewNo = true;
  const canViewTags = true;
  const canViewTotalVolume = true;
  const canViewWarehouse = true;
  const canViewWarehouseArrival = true;
  const canViewLoadingRate = true;

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

        <Label>
          <FormattedMessage id="components.cards.ttlVol" defaultMessage="TTL VOL" />
        </Label>

        <Label>
          <FormattedMessage id="components.cards.loadingRate" defaultMessage="Loading %" />
        </Label>
      </div>

      <div className={BottomRowWrapperStyle}>
        <div className={DeliveryWarehouseWrapperStyle}>
          <Label width="75px">
            <FormattedMessage id="components.cards.deliveryWarehouse" defaultMessage="Delivery" />
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
          <FormattedDateTZ value={warehouseArrival} user={user} />
        </Display>

        <Display blackout={!canViewTotalVolume}>
          {totalVolume && <FormattedNumber value={totalVolume.value} suffix={totalVolume.metric} />}
        </Display>

        <Display blackout={!canViewLoadingRate}>
          <Tooltip
            message={
              maxVolumeValue ? (
                <>
                  <FormattedMessage
                    id="module.container.loadingRateCalculation"
                    defaultMessage="(Total Volume / Max Volume) * 100%"
                  />
                  <Divider />
                  <FormattedMessage
                    id="module.container.loadingRateCalculationValues"
                    defaultMessage="({totalVolume}m³ / {maxVolume}m³) * 100%"
                    values={{
                      totalVolume: totalVolume.value,
                      maxVolume: maxVolumeValue,
                    }}
                  />
                </>
              ) : (
                <FormattedMessage
                  id="module.container.loadingRateTooltip"
                  defaultMessage="Please choose a Container Type in order to calculate this value"
                />
              )
            }
          >
            <span>
              {maxVolumeValue ? (
                <FormattedNumber value={(totalVolume.value / maxVolumeValue) * 100} suffix="%" />
              ) : (
                <FormattedMessage id="components.cards.na" />
              )}
            </span>
          </Tooltip>
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
