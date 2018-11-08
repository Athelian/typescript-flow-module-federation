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
  type: 'SHIPMENT' | 'ORDER',
};

const ApplyPanel = ({ type }: Props) => {
  let text;
  switch (type) {
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
                    const { connectExistingShipment, setCurrentStep } = connect;
                    await connectExistingShipment(client, targetedItem);
                    setCurrentStep(4);
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

ApplyPanel.defaultProps = {
  type: 'SHIPMENT',
};

export default ApplyPanel;
