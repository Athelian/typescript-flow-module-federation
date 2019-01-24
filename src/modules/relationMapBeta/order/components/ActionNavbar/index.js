// @flow

import * as React from 'react';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import { selectors } from 'modules/relationMapBeta/order/store';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT } from 'modules/relationMap/constants';
import TargetToolBar from './TargetToolBar';
import HighLightToolBar from './HighLightToolBar';

type Props = {
  highLightEntities: Array<string>,
};

export default function ActionNavbar({ highLightEntities }: Props) {
  const context = React.useContext(ActionDispatch);
  const { state } = context;
  const uiSelectors = selectors(state);
  return (
    <>
      {uiSelectors.isTargetAnyItem() && (
        <TargetToolBar
          totalOrder={uiSelectors.countTargetBy(ORDER)}
          totalOrderItem={uiSelectors.countTargetBy(ORDER_ITEM)}
          totalBatch={uiSelectors.countTargetBy(BATCH)}
          totalShipment={uiSelectors.countTargetBy(SHIPMENT)}
          onCancel={console.warn}
        >
          Test
        </TargetToolBar>
      )}
      {uiSelectors.isHighLightAnyItem() && (
        <HighLightToolBar
          totalOrder={uiSelectors.countHighLightBy(highLightEntities, ORDER)}
          totalOrderItem={uiSelectors.countHighLightBy(highLightEntities, ORDER_ITEM)}
          totalBatch={uiSelectors.countHighLightBy(highLightEntities, BATCH)}
          totalShipment={uiSelectors.countHighLightBy(highLightEntities, SHIPMENT)}
          onCancel={console.warn}
        />
      )}
    </>
  );
}
