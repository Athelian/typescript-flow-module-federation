// @flow
import { Container } from 'unstated';
import ApolloClient from 'apollo-client';
import { isEmpty } from 'utils/fp';
import { connectNewShipment, connectExistingShipment } from './connect';

type State = {
  connectType: string,
  selectedItem: Object,
  success: boolean,
};

const getInitialState = () => ({ connectType: '', selectedItem: {}, success: false });
export default class ConnectContainer extends Container<State> {
  state = getInitialState();

  setConnectType = (connectType: string) => {
    this.setState({ connectType });
  };

  setSelectedItem = (selectedItem: Object) => {
    this.setState({ selectedItem });
  };

  reset = () => {
    this.setState(getInitialState);
  };

  resetSelectedItem = () => {
    this.setState({ selectedItem: {} });
  };

  isSelectedItem = (id?: string) => {
    const { selectedItem } = this.state;
    const isSameId = id ? selectedItem.id === id : true;
    return isSameId && selectedItem && !isEmpty(selectedItem);
  };

  setSuccess = (success: boolean) => {
    this.setState({ ...getInitialState(), success });
  };

  connectNewShipment = async (client: any, target: Object) => {
    const newTarget = await connectNewShipment(client, target);
    return newTarget;
  };

  connectExistingShipment = async (client: ApolloClient<any>, target?: Object) => {
    const newTarget = await connectExistingShipment(client, target);
    return newTarget;
  };
}
