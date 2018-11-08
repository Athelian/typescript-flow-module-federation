// @flow
import { Container } from 'unstated';
import { set, unset, cloneDeep } from 'lodash';
import { isEquals } from 'utils/fp';
import { removeNulls, cleanFalsy, cleanUpData } from 'utils/data';
import { calculateVolume } from 'modules/batch/form/container';

type Price = {
  amount: number,
  currency: string,
};

type Metric = {
  value: number,
  metric: string,
};

type FormState = {
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
  packageSize: {
    width: Metric,
    height: Metric,
    length: Metric,
  },
};

const initValues = {
  exporter: null,
  supplier: null,
  origin: '',
  packageName: '',
  packageCapacity: 0,
  productionLeadTime: 0,
  unitType: '',
  unitVolume: {
    metric: 'm³',
    value: 0,
  },
  unitSize: {
    width: {
      metric: 'm',
      value: 0,
    },
    height: {
      metric: 'm',
      value: 0,
    },
    length: {
      metric: 'm',
      value: 0,
    },
  },
  unitWeight: {
    metric: 'kg',
    value: 0,
  },
  unitPrice: {
    currency: 'JPY',
    amount: 0,
  },
  inspectionFee: {
    currency: 'JPY',
    amount: 0,
  },
  packageGrossWeight: {
    metric: 'kg',
    value: 0,
  },
  packageVolume: {
    metric: 'm³',
    value: 0,
  },
  packageSize: {
    width: {
      metric: 'm',
      value: 0,
    },
    height: {
      metric: 'm',
      value: 0,
    },
    length: {
      metric: 'm',
      value: 0,
    },
  },
};

export default class ProductProviderContainer extends Container<FormState> {
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

  isDirty = () => !isEquals(cleanFalsy(this.state), cleanFalsy(this.originalValues));

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (values: Object) => {
    const parsedValues: Object = { ...initValues, ...cleanUpData(values) };
    this.setState(parsedValues);
    this.originalValues = Object.assign({}, parsedValues);
  };

  calculateUnitVolume = () => {
    // TODO: use https://github.com/ben-ng/convert-units for converting unit
    this.setState(prevState => {
      const newState = set(
        cloneDeep(prevState),
        'unitVolume.value',
        calculateVolume(
          prevState.unitVolume.metric,
          prevState.unitSize.height,
          prevState.unitSize.width,
          prevState.unitSize.length
        )
      );
      return newState;
    });
  };

  calculatePackageVolume = () => {
    this.setState(prevState => ({
      packageVolume: {
        metric: prevState.packageVolume.metric,
        value: calculateVolume(
          prevState.packageVolume.metric,
          prevState.packageSize.height,
          prevState.packageSize.width,
          prevState.packageSize.length
        ),
      },
    }));
  };
}
