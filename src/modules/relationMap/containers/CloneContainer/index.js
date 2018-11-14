// @flow
import { Container } from 'unstated';
import { getCloneFunction } from './clone';

export default class CloneContainer extends Container {
  clone = async ({
    client,
    target,
    focusMode,
    filter,
  }: {
    client: any,
    target: Object,
    focusMode: string,
    filter: Object,
  }) => {
    const clone = getCloneFunction(focusMode);
    const cloned = await clone({ client, target, filter });
    return cloned;
  };
}
