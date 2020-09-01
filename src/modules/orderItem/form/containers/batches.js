// @flow
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { cleanFalsyAndTypeName } from 'utils/data';
import { initDatetimeToContainer } from 'utils/date';

export type State = {
  batches: Array<Object>,
};

export const initValues = {
  batches: [],
};

export default class OrderItemBatchesContainer extends Container<State> {
  state = initValues;

  originalValues = initValues;

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = this.state;
    this.setState(this.originalValues);
  };

  initDetailValues = ({ batches }: Object, timezone: string) => {
    const parsedBatches: Array<Object> = batches.map(batch => ({
      ...batch,
      ...initDatetimeToContainer(batch?.deliveredAt ?? null, 'deliveredAt', timezone),
      ...initDatetimeToContainer(batch?.desiredAt ?? null, 'desiredAt', timezone),
      ...initDatetimeToContainer(batch?.expiredAt ?? null, 'expiredAt', timezone),
      ...initDatetimeToContainer(batch?.producedAt ?? null, 'producedAt', timezone),
    }));

    this.setState({ batches: parsedBatches });
    this.originalValues = { batches: parsedBatches };
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  setDeepFieldValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };
}
