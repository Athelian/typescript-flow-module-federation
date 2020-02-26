// @flow
import type { Partner } from 'generated/graphql';
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';

export const partnerInfoInitValues: Partner = {
  name: '',
  code: '',
  types: {
    value: '',
  },
};

export default class PartnerInfoContainer extends Container<Partner> {
  state = partnerInfoInitValues;

  originalValues = partnerInfoInitValues;

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  setFieldArrayValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...partnerInfoInitValues, ...values };
    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };
}
