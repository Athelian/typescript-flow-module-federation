// @flow
import React from 'react';
import { Subscribe } from 'unstated';
import { ApolloConsumer } from 'react-apollo';
import { ObjectValue } from 'react-values';
import { Label } from 'components/Form';
import { isEmpty } from 'utils/fp';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { BaseButton } from 'components/Buttons';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import messages from 'modules/relationMap/messages';
import { ActionContainer, ConnectContainer } from 'modules/relationMap/containers';
import RelationMapContainer from 'modules/relationMap/container';
import { ToggleCollpased } from 'modules/relationMap/orderFocused';
import { FilterContext } from 'modules/relationMap/common/ActionPanel/ActionSubscribe';
import {
  LabelConnectStyle,
  GroupLabelButtonStyle,
  Panel,
  FlatButtonStyle,
  ConfirmLabelStyle,
  CurrencyLabelStyle,
} from './style';
import { isSelectAllBatch, findDiffCurrency } from '../util';

type Props = {
  connectType: 'SHIPMENT' | 'ORDER',
};

type ConfirmMessageProps = {
  condition: Object,
};
const ConfirmMessage = ({ condition }: ConfirmMessageProps) => {
  if (!condition || isEmpty(condition)) {
    return null;
  }
  const {
    notSelectAllBatch,
    diffCurrency: { hasDiffCurrency, totalDiff, baseCurrency, diffCurrency },
  } = condition;
  if (!notSelectAllBatch && !hasDiffCurrency) {
    return (
      <Label className={ConfirmLabelStyle} align="center">
        <FormattedMessage {...messages.areYouSure} />
      </Label>
    );
  }
  return (
    <div>
      {notSelectAllBatch && (
        <Label className={ConfirmLabelStyle} align="center">
          <FormattedMessage {...messages.deleteUnSelectBatch} />
        </Label>
      )}
      {hasDiffCurrency && (
        <Label className={ConfirmLabelStyle} align="center">
          <FormattedMessage {...messages.diffCurrency} />
          <Label className={CurrencyLabelStyle} align="center">
            {baseCurrency}
          </Label>
          {totalDiff === 1 && (
            <Label align="center">
              <FormattedMessage {...messages.diffSingleCurrency} />
              <Label className={CurrencyLabelStyle} align="center">
                {diffCurrency}
              </Label>
            </Label>
          )}
          {totalDiff > 1 && <FormattedMessage {...messages.diffMultipleCurrency} />}
          <FormattedMessage {...messages.diffCurrencyAction} />
          <FormattedMessage {...messages.areYouSure} />
        </Label>
      )}
    </div>
  );
};

const ApplyPanel = ({ connectType }: Props) => {
  let text;
  switch (connectType) {
    default:
    case 'SHIPMENT':
      text = <FormattedMessage {...messages.askConnectToShipment} />;
      break;
    case 'ORDER':
      text = <FormattedMessage {...messages.askConnectToOrder} />;
  }

  return (
    <ApolloConsumer>
      {client => (
        <Subscribe to={[ConnectContainer, ActionContainer, RelationMapContainer]}>
          {(
            {
              connectExistingShipment,
              connectExistingOrder,
              setSuccess,
              reset,
              state: { selectedItem },
            },
            { setLoading },
            { state: { targetedItem }, isHighlighted, selectFocusItem, addNewResult }
          ) => (
            <Panel>
              <Label className={LabelConnectStyle}>
                <FormattedMessage {...messages.connect} />
                <Icon icon="CONNECT" />
              </Label>
              <Label className={GroupLabelButtonStyle}>
                {text}
                <BaseButton label="CLEAR" className={FlatButtonStyle} onClick={reset} />
                <FilterContext.Consumer>
                  {filter => (
                    <ObjectValue>
                      {({ value, assign: setDialog, set }) => (
                        <>
                          <BaseButton
                            icon="CONFIRM"
                            label={
                              <FormattedMessage
                                id="components.NavBar.filter.apply"
                                defaultMessage="APPLY"
                              />
                            }
                            onClick={async () => {
                              if (connectType === 'SHIPMENT') {
                                setLoading(true);
                                await connectExistingShipment(client, targetedItem, selectedItem);
                                const { batch = {} } = targetedItem;
                                const isFocus = Object.keys(batch).some(batchId =>
                                  isHighlighted(batchId, 'batch')
                                );
                                if (isFocus) {
                                  selectFocusItem(prevFocus => ({
                                    ...prevFocus,
                                    shipment: { [selectedItem.id]: true },
                                  }));
                                }
                                setSuccess(true);
                                setLoading(false);
                              } else if (connectType === 'ORDER') {
                                const notSelectAllBatch = !isSelectAllBatch(targetedItem);
                                const diffCurrency = findDiffCurrency(targetedItem, selectedItem);
                                if (notSelectAllBatch || diffCurrency) {
                                  setDialog({
                                    isOpen: true,
                                    notSelectAllBatch,
                                    diffCurrency,
                                  });
                                } else {
                                  connectExistingOrder(client, targetedItem, selectedItem, filter);
                                }
                              }
                            }}
                          />
                          <ToggleCollpased>
                            {({ set: setCollapsed }) => (
                              <ConfirmDialog
                                width={400}
                                isOpen={value.isOpen}
                                onRequestClose={() => set('isOpen', false)}
                                onCancel={() => set('isOpen', false)}
                                message={<ConfirmMessage condition={value} />}
                                onConfirm={async () => {
                                  set('isOpen', false);
                                  setLoading(true);
                                  const results = await connectExistingOrder(
                                    client,
                                    targetedItem,
                                    selectedItem,
                                    filter
                                  );
                                  setSuccess(true);
                                  setCollapsed(selectedItem.id, false);
                                  addNewResult(...results);
                                  setLoading(false);
                                }}
                              />
                            )}
                          </ToggleCollpased>
                        </>
                      )}
                    </ObjectValue>
                  )}
                </FilterContext.Consumer>
              </Label>
            </Panel>
          )}
        </Subscribe>
      )}
    </ApolloConsumer>
  );
};

export default ApplyPanel;
