// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeNulls, cleanFalsyAndTypeName } from 'utils/data';
import { calculatePackageVolume, calculateUnitVolume } from 'utils/batch';
import { defaultDistanceMetric, defaultVolumeMetric, defaultWeightMetric } from 'utils/metric';

type Price = {
  amount: number,
  currency: string,
};

type Metric = {
  value: number,
  metric: string,
};

type FormState = {
  isNew?: boolean,
  name: string,
  exporter?: ?Object,
  supplier?: ?Object,
  origin?: string,
  packageName?: string,
  packageCapacity?: number,
  productionLeadTime?: number,
  unitType?: string,
  unitVolume: Metric,
  unitWeight: Metric,
  unitPrice: Price,
  unitSize: {
    width: Metric,
    height: Metric,
    length: Metric,
  },
  inspectionFee: Price,
  packageGrossWeight: Metric,
  packageVolume: Metric,
  autoCalculatePackageVolume: boolean,
  autoCalculateUnitVolume: boolean,
  packageSize: {
    width: Metric,
    height: Metric,
    length: Metric,
  },
  customFields: Object,
  memo: string,
  files?: Array<Document>,
};

export const initValues = {
  supplier: null,
  origin: null,
  name: null,
  packageName: null,
  unitType: null,
  packageCapacity: 0,
  productionLeadTime: 0,
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
  inspectionFee: {
    currency: 'USD',
    amount: 0,
  },
  packageGrossWeight: {
    metric: defaultWeightMetric,
    value: 0,
  },
  packageVolume: {
    metric: defaultVolumeMetric,
    value: 0,
  },
  autoCalculatePackageVolume: true,
  autoCalculateUnitVolume: true,
  packageSize: {
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
    this.originalValues = Object.assign({}, parsedValues);
  };

  calculateUnitVolume = () => {
    this.setState(prevState => ({
      unitVolume: calculateUnitVolume(prevState),
    }));
  };

  toggleAutoCalculateUnitVolume = () => {
    const { autoCalculateUnitVolume } = this.state;
    if (!autoCalculateUnitVolume) {
      this.setState(prevState => ({
        unitVolume: calculateUnitVolume(prevState),
        autoCalculateUnitVolume: !autoCalculateUnitVolume,
      }));
    } else {
      this.setState({
        autoCalculateUnitVolume: !autoCalculateUnitVolume,
      });
    }
  };

  toggleAutoCalculatePackageVolume = () => {
    const { autoCalculatePackageVolume } = this.state;
    if (!autoCalculatePackageVolume) {
      this.setState(prevState => ({
        packageVolume: calculatePackageVolume(prevState),
        autoCalculatePackageVolume: !autoCalculatePackageVolume,
      }));
    } else {
      this.setState({
        autoCalculatePackageVolume: !autoCalculatePackageVolume,
      });
    }
  };

  calculatePackageVolume = () => {
    this.setState(prevState => ({
      packageVolume: calculatePackageVolume(prevState),
    }));
  };
}
