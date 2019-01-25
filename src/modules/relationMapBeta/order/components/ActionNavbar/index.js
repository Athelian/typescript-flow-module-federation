// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import { selectors, actionCreators } from 'modules/relationMapBeta/order/store';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT } from 'modules/relationMap/constants';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import { TabItemStyled } from 'modules/relationMap/common/ActionPanel/ActionSubscribe/style';
import TargetToolBar from './TargetToolBar';
import HighLightToolBar from './HighLightToolBar';
import SplitPanel from './SplitPanel';
import ConstrainPanel from './ConstrainPanel';

type Props = {
  highLightEntities: Array<string>,
};

export default function ActionNavbar({ highLightEntities }: Props) {
  const [activeAction, setActiveAction] = React.useState('');
  const context = React.useContext(ActionDispatch);
  const { state, dispatch } = context;
  const uiSelectors = selectors(state);
  const actions = actionCreators(dispatch);
  return (
    <>
      {uiSelectors.isTargetAnyItem() && (
        <>
          <TargetToolBar
            totalOrder={uiSelectors.countTargetBy(ORDER)}
            totalOrderItem={uiSelectors.countTargetBy(ORDER_ITEM)}
            totalBatch={uiSelectors.countTargetBy(BATCH)}
            totalShipment={uiSelectors.countTargetBy(SHIPMENT)}
            onCancel={() => actions.clearAllBy('TARGET')}
          >
            <TabItem
              className={TabItemStyled}
              allowClickOnDisable
              label={
                <FormattedMessage id="modules.RelationMaps.label.split" defaultMessage="SPLIT" />
              }
              icon="SPLIT"
              disabled={!uiSelectors.isAllowToSplitBatch()}
              active={activeAction === 'SPLIT'}
              onClick={() => setActiveAction('SPLIT')}
            />
          </TargetToolBar>
          {activeAction !== '' && (
            <ConstrainPanel
              disable={{
                disabledSplit: !uiSelectors.isAllowToSplitBatch(),
                disabledMoveToShipment: false,
                disabledMoveToOrder: false,
              }}
            />
          )}
          {activeAction === 'SPLIT' && uiSelectors.isAllowToSplitBatch() && (
            <SplitPanel onSplit={console.warn} />
          )}
        </>
      )}
      {uiSelectors.isHighLightAnyItem() && (
        <HighLightToolBar
          totalOrder={uiSelectors.countHighLightBy(highLightEntities, ORDER)}
          totalOrderItem={uiSelectors.countHighLightBy(highLightEntities, ORDER_ITEM)}
          totalBatch={uiSelectors.countHighLightBy(highLightEntities, BATCH)}
          totalShipment={uiSelectors.countHighLightBy(highLightEntities, SHIPMENT)}
          onCancel={() => actions.clearAllBy('HIGHLIGHT')}
        />
      )}
    </>
  );
}
