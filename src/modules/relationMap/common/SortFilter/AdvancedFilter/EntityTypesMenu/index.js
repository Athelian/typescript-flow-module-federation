// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { type EntityTypes } from 'modules/relationMap/common/SortFilter/AdvancedFilter/type';
import {
  EntityTypesWrapperStyle,
  EntityTypeStyle,
  EntityTypeIconStyle,
  EntityTypeLabelStyle,
  EntityTypeBadgeStyle,
} from './style';

type Props = {
  selectedEntityType: EntityTypes,
  changeEntityType: (entityType: EntityTypes) => void,
  numOfActiveOrderFilters: number,
  numOfActiveItemFilters: number,
  numOfActiveBatchFilters: number,
  numOfActiveShipmentFilters: number,
};

export default function EntityTypesMenu({
  selectedEntityType,
  changeEntityType,
  numOfActiveOrderFilters,
  numOfActiveItemFilters,
  numOfActiveBatchFilters,
  numOfActiveShipmentFilters,
}: Props) {
  const selectedEntityTypeMap = {
    order: selectedEntityType === 'order',
    item: selectedEntityType === 'item',
    batch: selectedEntityType === 'batch',
    shipment: selectedEntityType === 'shipment',
  };

  return (
    <div className={EntityTypesWrapperStyle}>
      <div
        className={EntityTypeStyle(selectedEntityTypeMap.order)}
        onClick={() => changeEntityType('order')}
        role="presentation"
      >
        <div className={EntityTypeIconStyle}>
          <Icon icon="ORDER" />
        </div>
        <div className={EntityTypeLabelStyle}>
          <FormattedMessage id="modules.RelationMaps.filter.order" defaultMessage="ORDER" />
        </div>
        {numOfActiveOrderFilters > 0 && (
          <div className={EntityTypeBadgeStyle(selectedEntityTypeMap.order)}>
            <FormattedNumber value={1} />
          </div>
        )}
      </div>

      <div
        className={EntityTypeStyle(selectedEntityTypeMap.item)}
        onClick={() => changeEntityType('item')}
        role="presentation"
      >
        <div className={EntityTypeIconStyle}>
          <Icon icon="ORDER_ITEM" />
        </div>
        <div className={EntityTypeLabelStyle}>
          <FormattedMessage id="modules.RelationMaps.filter.item" defaultMessage="ITEM" />
        </div>
        {numOfActiveItemFilters > 0 && (
          <div className={EntityTypeBadgeStyle(selectedEntityTypeMap.item)}>
            <FormattedNumber value={1} />
          </div>
        )}
      </div>

      <div
        className={EntityTypeStyle(selectedEntityTypeMap.batch)}
        onClick={() => changeEntityType('batch')}
        role="presentation"
      >
        <div className={EntityTypeIconStyle}>
          <Icon icon="BATCH" />
        </div>
        <div className={EntityTypeLabelStyle}>
          <FormattedMessage id="modules.RelationMaps.filter.batch" defaultMessage="BATCH" />
        </div>
        {numOfActiveBatchFilters > 0 && (
          <div className={EntityTypeBadgeStyle(selectedEntityTypeMap.batch)}>
            <FormattedNumber value={1} />
          </div>
        )}
      </div>

      <div
        className={EntityTypeStyle(selectedEntityTypeMap.shipment)}
        onClick={() => changeEntityType('shipment')}
        role="presentation"
      >
        <div className={EntityTypeIconStyle}>
          <Icon icon="SHIPMENT" />
        </div>
        <div className={EntityTypeLabelStyle}>
          <FormattedMessage id="modules.RelationMaps.filter.shipment" defaultMessage="SHIPMENT" />
        </div>
        {numOfActiveShipmentFilters > 0 && (
          <div className={EntityTypeBadgeStyle(selectedEntityTypeMap.shipment)}>
            <FormattedNumber value={1} />
          </div>
        )}
      </div>
    </div>
  );
}
