// @flow
import { Container } from 'unstated';
import { getSplitFunction, getSplitResult, getSplitFocus, getSplitType } from './split';
import { getDefaultResult, getDefaultFocus } from '../action';

type Split = { client: any, target: Object, data: Object, filter: Object };
export default class SplitContainer extends Container {
  split = async ({ client, target, data, filter }: Split) => {
    const split = getSplitFunction(data.tabIndex);
    const splitType = getSplitType(data.tabIndex);
    const results = await split({ client, target, data, filter });
    return [
      {
        ...getDefaultResult(),
        batch: getSplitResult(results, splitType, target),
      },
      {
        ...getDefaultFocus(),
        batch: getSplitFocus(results, splitType, target),
      },
    ];
  };
}
