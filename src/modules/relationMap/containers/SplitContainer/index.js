// @flow
import { Container } from 'unstated';
import { getSplitFunction, getSplitResult, getSplitFocus, getSplitType } from './split';
import { getDefaultResult, getDefaultFocus } from '../action';

export default class SplitContainer extends Container {
  split = async (client: any, target: Object, data: Object) => {
    const split = getSplitFunction(data.tabIndex);
    const splitType = getSplitType(data.tabIndex);
    const results = await split(client, target, data);
    return [
      {
        ...getDefaultResult(),
        batch: getSplitResult(results, splitType),
      },
      {
        ...getDefaultFocus(),
        batch: getSplitFocus(results, splitType),
      },
    ];
  };
}
