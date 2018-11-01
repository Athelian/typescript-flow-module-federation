// @flow
import { Container } from 'unstated';
import { connectNewShipment, connectExistingShipment } from './connect';

export default class CloneContainer extends Container {
  connectNewShipment = async (client: any, target: Object) => {
    const newTarget = await connectNewShipment(client, target);
    return newTarget;
  };

  connectExistingShipment = async (client: any, target: Object) => {
    const newTarget = await connectExistingShipment(client, target);
    return newTarget;
  };
}
