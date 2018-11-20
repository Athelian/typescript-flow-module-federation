// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { type EntityTypes } from 'modules/relationMap/common/SortFilter/AdvancedFilter/type';
import messages from './messages';
import {
  EntityTypesWrapperStyle,
  EntityTypeMenuItemStyle,
  EntityTypeLayoutStyle,
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
  const entityTypesMap = [
    {
      name: 'order',
      icon: 'ORDER',
      count: numOfActiveOrderFilters,
    },
    {
      name: 'item',
      icon: 'ORDER_ITEM',
      count: numOfActiveItemFilters,
    },
    {
      name: 'batch',
      icon: 'BATCH',
      count: numOfActiveBatchFilters,
    },
    {
      name: 'shipment',
      icon: 'SHIPMENT',
      count: numOfActiveShipmentFilters,
    },
  ];

  return (
    <div className={EntityTypesWrapperStyle}>
      {entityTypesMap.map(entityType => {
        const { name, icon, count } = entityType;
        const isSelected = selectedEntityType === name;
        const showBadge = count > 0;

        return (
          <button
            className={EntityTypeMenuItemStyle(isSelected)}
            onClick={() => changeEntityType(name)}
            type="button"
          >
            <div className={EntityTypeLayoutStyle}>
              <div className={EntityTypeIconStyle(isSelected)}>
                <Icon icon={icon} />
              </div>
              <div className={EntityTypeLabelStyle(isSelected)}>
                <FormattedMessage {...messages[name]} />
              </div>
              {showBadge && (
                <div className={EntityTypeBadgeStyle(isSelected)}>
                  <FormattedNumber value={count} />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
