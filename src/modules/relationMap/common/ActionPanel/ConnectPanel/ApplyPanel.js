// @flow
import React from 'react';
import { Subscribe } from 'unstated';
import { ApolloConsumer } from 'react-apollo';
import { Label } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { BaseButton } from 'components/Buttons';
import messages from 'modules/relationMap/messages';
import { ActionContainer, ConnectContainer } from 'modules/relationMap/containers';
import RelationMapContainer from 'modules/relationMap/container';
import { LabelConnectStyle, GroupLabelButtonStyle, Panel, FlatButtonStyle } from './style';

type Props = {
  connectType: 'SHIPMENT' | 'ORDER',
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
          {(connect, action, { state: { targetedItem } }) => (
            <Panel>
              <Label className={LabelConnectStyle}>
                <FormattedMessage {...messages.connect} />
                <Icon icon="CONNECT" />
              </Label>
              <Label className={GroupLabelButtonStyle}>
                {text}
                <BaseButton label="CLEAR" className={FlatButtonStyle} />
                <BaseButton
                  icon="CONFIRM"
                  label="APPLY"
                  onClick={async () => {
                    if (connectType === 'SHIPMENT') {
                      const { connectExistingShipment } = connect;
                      await connectExistingShipment(client, targetedItem);
                    }
                  }}
                />
              </Label>
            </Panel>
          )}
        </Subscribe>
      )}
    </ApolloConsumer>
  );
};

export default ApplyPanel;
