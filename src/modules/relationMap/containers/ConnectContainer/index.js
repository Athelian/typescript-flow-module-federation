// @flow
import { Container } from 'unstated';
import ApolloClient from 'apollo-client';
import { connectNewShipment, connectExistingShipment } from './connect';

type State = {
  connectType: string,
  currentStep: number,
};
export default class ConnectContainer extends Container<State> {
  state = {
    connectType: '',
    currentStep: 1,
  };

  setConnectType = (connectType: string) => {
    this.setState({ connectType, currentStep: 2 });
  };

  setCurrentStep = (currentStep: number) => {
    this.setState({ currentStep });
  };

  nextStep = () => {
    this.setState(prevState => prevState.currentStep + 1);
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
