// @flow
import React from 'react';
import { Subscribe } from 'unstated';
import { ApolloConsumer } from 'react-apollo';
import { ObjectValue } from 'react-values';
import { Label } from 'components/Form';
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
  const {
    notSelectAllBatch,
    diffCurrency: { totalDiff, baseCurrency, diffCurrency },
  } = condition;
  const confirmMessages = [];
  if (notSelectAllBatch) {
    confirmMessages.push(<FormattedMessage {...messages.deleteUnSelectBatch} />);
  }
  confirmMessages.push(<br />);
  if (totalDiff === 1) {
    confirmMessages.push(
      <>
        <FormattedMessage {...messages.diffCurrency} />
        <Label className={CurrencyLabelStyle}>{baseCurrency}</Label>
      </>
    );
    confirmMessages.push(
      <>
        <FormattedMessage {...messages.diffSingleCurrency} />
        <Label className={CurrencyLabelStyle}>{diffCurrency}</Label>
      </>
    );
    confirmMessages.push(<FormattedMessage {...messages.diffCurrencyAction} />);
  } else if (totalDiff > 1) {
    confirmMessages.push(
      <>
        <FormattedMessage {...messages.diffCurrency} />
        <Label className={CurrencyLabelStyle}>{baseCurrency}</Label>
      </>
    );
    confirmMessages.push(<FormattedMessage {...messages.diffMultipleCurrency} />);
    confirmMessages.push(<FormattedMessage {...messages.diffCurrencyAction} />);
  }
  return <Label className={ConfirmLabelStyle}>{confirmMessages}</Label>;
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
            { connectExistingShipment, connectExistingOrder, state: { selectedItem } },
            action,
            { state: { targetedItem } }
          ) => (
            <Panel>
              <Label className={LabelConnectStyle}>
                <FormattedMessage {...messages.connect} />
                <Icon icon="CONNECT" />
              </Label>
              <Label className={GroupLabelButtonStyle}>
                {text}
                <BaseButton label="CLEAR" className={FlatButtonStyle} />
                <ObjectValue>
                  {({ value, assign: setDialog, set }) => (
                    <>
                      <BaseButton
                        icon="CONFIRM"
                        label="APPLY"
                        onClick={async () => {
                          if (connectType === 'SHIPMENT') {
                            await connectExistingShipment(client, targetedItem, selectedItem);
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
                          await connectExistingOrder(client, targetedItem, selectedItem, value);
                          set('isOpen', false);
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
