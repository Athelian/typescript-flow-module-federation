// @flow
import { Container } from 'unstated';
import ApolloClient from 'apollo-client';
import { isEmpty } from 'utils/fp';
import {
  connectNewShipment,
  connectExistingShipment,
  connectExistingOrder,
  disconnectShipment,
  deleteItem,
  deleteItemAndBatchInOrder,
} from './connect';

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

  isSelected = (id: string, selectedItem: Object) => id === selectedItem.id;

  isSelectedItem = (id?: string) => {
    const { selectedItem } = this.state;
    const isSelected = selectedItem && !isEmpty(selectedItem);
    if (!id) {
      return isSelected;
    }
    const isSameId = selectedItem.id === id;
    return isSameId && isSelected;
  };

  setSuccess = (success: boolean) => {
    this.setState({ ...getInitialState(), success });
  };

  connectNewShipment = async (client: any, target: Object) => {
    const newTarget = await connectNewShipment(client, target);
    return newTarget;
  };

  connectExistingShipment = async (
    client: ApolloClient<any>,
    target: Object,
    selectedItem: Object
  ) => {
    const newTarget = await connectExistingShipment(client, target, selectedItem);
    return newTarget;
  };

  connectExistingOrder = async (
    client: ApolloClient<any>,
    target: Object,
    selectedItem: Object,
    filter: Object
  ) => {
    const newTarget = await connectExistingOrder(client, target, selectedItem);
    await deleteItemAndBatchInOrder(client, target, filter);
    return newTarget;
  };

  disconnectShipment = async (client: ApolloClient<any>, target: Object) => {
    const newTarget = await disconnectShipment(client, target);
    return newTarget;
  };

  deleteItem = async (client: ApolloClient<any>, target: Object) => {
    const newTarget = await deleteItem(client, target);
    return newTarget;
  };

  deleteItemAndBatchInOrder = async (client: ApolloClient<any>, target: Object) => {
    const newTarget = await deleteItemAndBatchInOrder(client, target);
    return newTarget;
  };
}
