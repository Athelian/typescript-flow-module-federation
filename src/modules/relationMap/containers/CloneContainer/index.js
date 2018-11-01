// @flow
import { Container } from 'unstated';
import { getCloneFunction } from './clone';

export default class CloneContainer extends Container {
  clone = async (client: any, target: Object, focusMode: string) => {
    const clone = getCloneFunction(focusMode);
    const cloned = await clone(client, target);
    return cloned;
  };
}
