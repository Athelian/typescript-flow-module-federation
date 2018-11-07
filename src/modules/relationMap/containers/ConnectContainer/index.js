// @flow
import { Container } from 'unstated';
import { connectNewShipment, connectExistingShipment } from './connect';

type State = {
  connectType: string,
  connectedItem: boolean,
  selectedShipment: boolean,
};
export default class ConnectContainer extends Container<State> {
  state = {
    connectType: '',
    connectedItem: false,
    selectedShipment: false,
  };

  setConnectType = (connectType: string) => {
    this.setState({ connectType });
  };

  setConnectItem = (connectedItem: boolean) => {
    this.setState({ connectedItem });
  };

  selectShipment = (selectedShipment: boolean) => {
    this.setState({ selectedShipment });
  };

  step = () => {
    const { connectType, connectedItem } = this.state;
    let step;
    if (!connectType) {
      step = 1;
    } else if (!connectedItem) {
      step = 2;
    } else {
      step = 3;
    }
    return step;
  };

  connectNewShipment = async (client: any, target: Object) => {
    const newTarget = await connectNewShipment(client, target);
    return newTarget;
  };

  connectExistingShipment = async (client: any, target: Object) => {
    const newTarget = await connectExistingShipment(client, target);
    return newTarget;
  };
}
