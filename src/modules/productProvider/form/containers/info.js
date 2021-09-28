// @flow
import { Container } from 'unstated';
import type { MetricValue, Size, Price } from 'generated/graphql';
import { set, unset, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeNulls, cleanFalsyAndTypeName } from 'utils/data';
import { calculateVolume } from 'utils/batch';
import { defaultDistanceMetric, defaultVolumeMetric, defaultWeightMetric } from 'utils/metric';

type FormState = {
  isNew?: boolean,
  name: ?string,
  exporter?: ?Object,
  supplier?: ?Object,
  importer?: ?Array<Object>,
  organizations?: ?Array<Object>,
  origin: ?string,

  unitType: ?string,
  unitVolume: MetricValue,
  unitWeight: MetricValue,
  unitPrice: Price,
  unitSize: Size,

  autoCalculateUnitVolume: boolean,
  customFields: Object,
  memo: ?string,
  files?: Array<Document>,
};

export const initValues: FormState = {
  supplier: null,
  importers: null,
  origin: null,
  name: null,
  unitType: null,
  organizations: [],
  unitVolume: {
    metric: defaultVolumeMetric,
    value: 0,
  },
  unitSize: {
    width: {
      metric: defaultDistanceMetric,
      value: 0,
    },
    height: {
      metric: defaultDistanceMetric,
      value: 0,
    },
    length: {
      metric: defaultDistanceMetric,
      value: 0,
    },
  },
  unitWeight: {
    metric: defaultWeightMetric,
    value: 0,
  },
  unitPrice: {
    currency: 'USD',
    amount: 0,
  },

  autoCalculateUnitVolume: true,
  customFields: {
    mask: null,
    fieldValues: [],
  },
  memo: null,
  files: [],
};

export default class ProductProviderInfoContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  setFieldValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
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

  isDirty = () =>
    !isEquals(cleanFalsyAndTypeName(this.state), cleanFalsyAndTypeName(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...values };
    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };

  calculateUnitVolume = () => {
    this.setState(prevState => ({
      unitVolume: calculateVolume(prevState.unitVolume, prevState.unitSize),
    }));
  };

  toggleAutoCalculateUnitVolume = () => {
    const { autoCalculateUnitVolume } = this.state;
    if (!autoCalculateUnitVolume) {
      this.setState(prevState => ({
        unitVolume: calculateVolume(prevState.unitVolume, prevState.unitSize),
        autoCalculateUnitVolume: !autoCalculateUnitVolume,
      }));
    } else {
      this.setState({
        autoCalculateUnitVolume: !autoCalculateUnitVolume,
      });
    }
  };

  calculatePackageVolume = () => {
    this.setState(prevState => ({
      packageVolume: calculateVolume(prevState.packageVolume, prevState.packageSize),
    }));
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
