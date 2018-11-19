// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import {
  EntityTypesWrapperStyle,
  EntityTypeStyle,
  EntityTypeIconStyle,
  EntityTypeLabelStyle,
  EntityTypeBadgeStyle,
} from './style';

type Props = {
  activeEntityType: 'order' | 'item' | 'batch' | 'shipment',
  changeEntityType: (entityType: 'order' | 'item' | 'batch' | 'shipment') => void,
  numOfActiveOrderFilters: number,
  numOfActiveItemFilters: number,
  numOfActiveBatchFilters: number,
  numOfActiveShipmentFilters: number,
};

export default function EntityTypesMenu({
  activeEntityType,
  changeEntityType,
  numOfActiveOrderFilters,
  numOfActiveItemFilters,
  numOfActiveBatchFilters,
  numOfActiveShipmentFilters,
}: Props) {
  return (
    <div className={EntityTypesWrapperStyle}>
      <div
        className={EntityTypeStyle(activeEntityType === 'order')}
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
          <div className={EntityTypeBadgeStyle(activeEntityType === 'order')}>
            <FormattedNumber value={1} />
          </div>
        )}
      </div>

      <div
        className={EntityTypeStyle(activeEntityType === 'item')}
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
          <div className={EntityTypeBadgeStyle(activeEntityType === 'item')}>
            <FormattedNumber value={1} />
          </div>
        )}
      </div>

      <div
        className={EntityTypeStyle(activeEntityType === 'batch')}
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
          <div className={EntityTypeBadgeStyle(activeEntityType === 'batch')}>
            <FormattedNumber value={1} />
          </div>
        )}
      </div>

      <div
        className={EntityTypeStyle(activeEntityType === 'shipment')}
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
          <div className={EntityTypeBadgeStyle(activeEntityType === 'shipment')}>
            <FormattedNumber value={1} />
          </div>
        )}
      </div>
    </div>
  );
}
