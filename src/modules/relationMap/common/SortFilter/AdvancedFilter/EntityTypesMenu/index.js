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
  activeFilters: {
    order: Array<string>,
    item: Array<string>,
    batch: Array<string>,
    shipment: Array<string>,
  },
};

export default function EntityTypesMenu({
  selectedEntityType,
  changeEntityType,
  activeFilters,
}: Props) {
  const entityTypesMap = [
    {
      name: 'order',
      icon: 'ORDER',
      count: activeFilters.order.length,
    },
    {
      name: 'item',
      icon: 'ORDER_ITEM',
      count: activeFilters.item.length,
    },
    {
      name: 'batch',
      icon: 'BATCH',
      count: activeFilters.batch.length,
    },
    {
      name: 'shipment',
      icon: 'SHIPMENT',
      count: activeFilters.shipment.length,
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
