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
    diffCurrency: { totalDiff, baseCurrency, diffCurrency },
  } = condition;
  return (
    <div>
      {notSelectAllBatch && (
        <Label className={ConfirmLabelStyle} align="center">
          <FormattedMessage {...messages.deleteUnSelectBatch} />
        </Label>
      )}
      {totalDiff && (
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
                <ObjectValue>
                  {({ value, assign: setDialog, set }) => (
                    <>
                      <BaseButton
                        icon="CONFIRM"
                        label="APPLY"
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
                              connectExistingOrder(client, targetedItem, selectedItem);
                            }
                          }
                        }}
                      />
                      <ConfirmDialog
                        width={400}
                        isOpen={value.isOpen}
                        onRequestClose={() => set('isOpen', false)}
                        onCancel={() => set('isOpen', false)}
                        message={<ConfirmMessage condition={value} />}
                        onConfirm={async () => {
                          set('isOpen', false);
                          setLoading(true);
                          await connectExistingOrder(client, targetedItem, selectedItem, value);
                          addNewResult(
                            {
                              order: [selectedItem],
                              orderItem: {},
                              batch: {},
                            },
                            {
                              order: { [selectedItem.id]: selectedItem },
                              orderItem: {},
                              batch: {},
                            }
                          );
                          setSuccess(true);
                          setLoading(false);
                        }}
                      />
                    </>
                  )}
                </ObjectValue>
              </Label>
            </Panel>
          )}
        </Subscribe>
      )}
    </ApolloConsumer>
  );
};

export default ApplyPanel;
