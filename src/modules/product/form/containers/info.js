// @flow
import { Container } from 'unstated';
import type { Product } from 'generated/graphql';
import { set, unset, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeNulls, cleanFalsyAndTypeName } from 'utils/data';

const initValues: Product = {
  customFields: {
    mask: null,
    fieldValues: [],
  },
  memo: null,
};

export default class ProductInfoContainer extends Container<Product> {
  state = initValues;

  originalValues = initValues;

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

  removeArrayItem = (path: string) => {
    this.setState(prevState => {
      const cloneState = cloneDeep(prevState);
      unset(cloneState, path);
      return removeNulls(cloneState);
    });
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...values };
    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };

  onChangePartners = (newPartners: Array<Object>) => {
    this.setState(({ followers = [], organizations: oldPartners = [] }) => {
      const removedPartners = oldPartners.filter(
        oldPartner => !newPartners.some(newPartner => newPartner.id === oldPartner.id)
      );

      if (oldPartners.length > 0 && removedPartners.length > 0) {
        const cleanedFollowers = followers.filter(
          follower =>
            !removedPartners.some(
              removedPartner => removedPartner.id === follower?.organization?.id
            )
        );

        return { organizations: newPartners, followers: cleanedFollowers };
      }

      return { organizations: newPartners };
    });
  };
}
