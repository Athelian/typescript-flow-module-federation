// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ApolloConsumer } from 'react-apollo';
import OutsideClickHandler from 'components/OutsideClickHandler';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { Label } from 'components/Form';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import { selectors, actionCreators } from 'modules/relationMapBeta/order/store';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT } from 'modules/relationMap/constants';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import {
  TabItemStyled,
  LoadingContainerStyle,
} from 'modules/relationMap/common/ActionPanel/ActionSubscribe/style';
import messages from 'modules/relationMap/messages';
import TargetToolBar from './TargetToolBar';
import HighLightToolBar from './HighLightToolBar';
import SplitPanel from './SplitPanel';
import { batchEqualSplitMutation, batchSimpleSplitMutation } from './SplitPanel/mutation';
import ConstrainPanel from './ConstrainPanel';
import ErrorPanel from './ErrorPanel';

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
    <ApolloConsumer>
      {client => (
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
                    <FormattedMessage
                      id="modules.RelationMaps.label.split"
                      defaultMessage="SPLIT"
                    />
                  }
                  icon="SPLIT"
                  disabled={!uiSelectors.isAllowToSplitBatch()}
                  active={activeAction === 'split'}
                  onClick={() => setActiveAction('split')}
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
              {state.error && (
                <ErrorPanel onClickCancel={console.warn} onClickRefresh={console.warn} />
              )}
              {activeAction && (
                <OutsideClickHandler ignoreClick onOutsideClick={() => {}}>
                  <Dialog isOpen={state.loading} options={{ width: 300 }} onRequestClose={() => {}}>
                    <div className={LoadingContainerStyle}>
                      <LoadingIcon />
                      <Label align="center">
                        <FormattedMessage {...messages[activeAction]} />
                      </Label>
                      <Label align="center">
                        <FormattedMessage {...messages.waiting} />
                      </Label>
                    </div>
                  </Dialog>
                </OutsideClickHandler>
              )}
              {activeAction === 'split' && uiSelectors.isAllowToSplitBatch() && (
                <SplitPanel
                  onSplit={async inputData => {
                    const { type, quantity } = inputData;
                    const id = uiSelectors.targetedBatchId();
                    try {
                      actions.splitBatch({
                        type,
                        quantity,
                        batchId: id,
                      });
                      // TODO: handle user error if enter the quality bigger than batch's quantity
                      if (type === 'batchEqualSplit') {
                        const result: any = await client.mutate({
                          mutation: batchEqualSplitMutation,
                          variables: { id, input: { precision: 0, divideBy: quantity } },
                        });
                        console.warn(result.data.batchEqualSplit);
                        actions.splitBatchSuccess(result.data.batchEqualSplit);
                      } else {
                        const result: any = await client.mutate({
                          mutation: batchSimpleSplitMutation,
                          variables: { id, input: { quantity } },
                        });
                        console.warn(result.data.batchSimpleSplit);
                        actions.splitBatchSuccess(result.data.batchSimpleSplit);
                      }
                    } catch (error) {
                      console.warn(error);
                      actions.splitBatchFailed(error);
                    }
                  }}
                />
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
      )}
    </ApolloConsumer>
  );
}
