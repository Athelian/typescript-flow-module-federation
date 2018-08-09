// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import Card from 'components/EntityCard';
import messages from 'modules/warehouse/messages';
import type { Warehouse } from 'modules/warehouse/type.js.flow';
import Icon from 'components/Icon';
import { WarehouseItemStyle, NameStyle, PlaceStyle, IconStyle } from './style';

type Props = {
  warehouse: Warehouse,
  intl: intlShape,
};

const WarehouseItem = ({ warehouse, intl }: Props) => {
  if (!warehouse) return null;
  const place = [warehouse.region, warehouse.locality].filter(x => x !== null).join(', ');

  return (
    <Card
      color="WAREHOUSE_MUD"
      icon="faWarehouse"
      onClick={() => {}}
      title={intl.formatMessage(messages.tooltipDetails)}
    >
      <div className={WarehouseItemStyle}>
        <div
          className={NameStyle}
          title={intl.formatMessage(messages.tooltipName, { name: warehouse.name })}
        >
          <b>{warehouse.name}</b>
        </div>
        <div className={PlaceStyle} title={intl.formatMessage(messages.tooltipPlace, { place })}>
          <div className={IconStyle}>
            <Icon icon="faPlace" />
          </div>
          <b>{place}</b>
        </div>
      </div>
    </Card>
  );
};

export default injectIntl(WarehouseItem);
