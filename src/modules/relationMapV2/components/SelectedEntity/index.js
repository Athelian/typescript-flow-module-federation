// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { Label } from 'components/Form';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import {
  SelectedEntitiesWrapperStyle,
  EntitiesWrapperStyle,
  EntityWrapperStyle,
  EntityIconStyle,
  EntityCountStyle,
  ClearEntityButtonStyle,
  TotalEntitiesStyle,
  ClearTotalButtonStyle,
} from './style';

type Props = {
  targets: Array<string>,
};

// TODO: Move to helpers file
const getEntityCounts = (targets: Array<string>) => {
  let orderCount = 0;
  let itemCount = 0;
  let batchCount = 0;
  let containerCount = 0;
  let shipmentCount = 0;
  let totalCount = 0;

  targets.forEach(target => {
    if (target.includes(`${ORDER}-`)) {
      orderCount += 1;
      totalCount += 1;
    } else if (target.includes(`${ORDER_ITEM}-`)) {
      itemCount += 1;
      totalCount += 1;
    } else if (target.includes(`${BATCH}-`)) {
      batchCount += 1;
      totalCount += 1;
    } else if (target.includes(`${CONTAINER}-`)) {
      containerCount += 1;
      totalCount += 1;
    } else if (target.includes(`${SHIPMENT}-`)) {
      shipmentCount += 1;
      totalCount += 1;
    }
  });

  return { orderCount, itemCount, batchCount, containerCount, shipmentCount, totalCount };
};

export default function SelectedEntity({ targets }: Props) {
  const {
    orderCount,
    itemCount,
    batchCount,
    containerCount,
    shipmentCount,
    totalCount,
  } = getEntityCounts(targets);

  return (
    <div className={SelectedEntitiesWrapperStyle}>
      <div className={EntitiesWrapperStyle}>
        <div className={EntityWrapperStyle(orderCount)}>
          <div className={EntityIconStyle}>
            <Icon icon="ORDER" />
          </div>
          <div className={EntityCountStyle}>
            <FormattedNumber value={orderCount} />
          </div>
          <button
            className={ClearEntityButtonStyle}
            onClick={() => {
              // TODO: Clear all selected orders
            }}
            type="button"
          >
            <Icon icon="CLEAR" />
          </button>
        </div>

        <div className={EntityWrapperStyle(itemCount)}>
          <div className={EntityIconStyle}>
            <Icon icon="ORDER_ITEM" />
          </div>
          <div className={EntityCountStyle}>
            <FormattedNumber value={itemCount} />
          </div>
          <button
            className={ClearEntityButtonStyle}
            onClick={() => {
              // TODO: Clear all selected items
            }}
            type="button"
          >
            <Icon icon="CLEAR" />
          </button>
        </div>

        <div className={EntityWrapperStyle(batchCount)}>
          <div className={EntityIconStyle}>
            <Icon icon="BATCH" />
          </div>
          <div className={EntityCountStyle}>
            <FormattedNumber value={batchCount} />
          </div>
          <button
            className={ClearEntityButtonStyle}
            onClick={() => {
              // TODO: Clear all selected batches
            }}
            type="button"
          >
            <Icon icon="CLEAR" />
          </button>
        </div>

        <div className={EntityWrapperStyle(containerCount)}>
          <div className={EntityIconStyle}>
            <Icon icon="CONTAINER" />
          </div>
          <div className={EntityCountStyle}>
            <FormattedNumber value={containerCount} />
          </div>
          <button
            className={ClearEntityButtonStyle}
            onClick={() => {
              // TODO: Clear all selected containers
            }}
            type="button"
          >
            <Icon icon="CLEAR" />
          </button>
        </div>

        <div className={EntityWrapperStyle(shipmentCount)}>
          <div className={EntityIconStyle}>
            <Icon icon="SHIPMENT" />
          </div>
          <div className={EntityCountStyle}>
            <FormattedNumber value={shipmentCount} />
          </div>
          <button
            className={ClearEntityButtonStyle}
            onClick={() => {
              // TODO: Clear all selected shipments
            }}
            type="button"
          >
            <Icon icon="CLEAR" />
          </button>
        </div>
      </div>

      <div className={TotalEntitiesStyle}>
        <Label color="TEAL" align="center">
          <FormattedNumber value={totalCount} /> SELECTED
        </Label>
        <button
          className={ClearTotalButtonStyle}
          onClick={() => {
            // TODO: Clear all selected
          }}
          type="button"
        >
          <Icon icon="CLEAR" />
        </button>
      </div>
    </div>
  );
}
