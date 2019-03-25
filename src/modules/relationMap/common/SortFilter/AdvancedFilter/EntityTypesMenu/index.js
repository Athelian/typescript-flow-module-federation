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
  dispatch: (action: { type: string, payload: Object }) => void,
  activeFilters: {
    order: Array<string>,
    item: Array<string>,
    batch: Array<string>,
    shipment: Array<string>,
  },
};

function EntityTypesMenu({ selectedEntityType, dispatch, activeFilters }: Props) {
  const entityTypesMap = [
    {
      name: 'order',
      icon: 'ORDER',
      count: activeFilters.order.length,
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
            onClick={() => dispatch({ type: 'CHANGE_ENTITY', payload: { entityType: name } })}
            type="button"
            key={name}
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

export default React.memo<Props>(EntityTypesMenu);
