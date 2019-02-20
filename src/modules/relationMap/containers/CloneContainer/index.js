// @flow
import { Container } from 'unstated';
import { cloneTarget as clone } from './clone';

export default class CloneContainer extends Container {
  clone = async ({ client, target, filter }: { client: any, target: Object, filter: Object }) => {
    // const clone = getCloneFunction(focusMode);
    const cloned = await clone({ client, target, filter });
    return cloned;
  };
}
