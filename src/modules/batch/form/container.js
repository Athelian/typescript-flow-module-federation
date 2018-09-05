// @flow
import { Container } from 'unstated';
import * as Yup from 'yup';
import { isEquals } from 'utils/fp';
import logger from 'utils/logger';
import { removeTypename, removeNulls } from 'utils/data';

type FormState = {
  batchAdjustments: Array<any>,
  packageGrossWeight: {
    value: any,
    metric: any,
  },
  packageVolume: {
    value: any,
    metric: any,
  },
  packageSize: {
    length: {
      value: any,
      metric: any,
    },
    width: {
      value: any,
      metric: any,
    },
    height: {
      value: any,
      metric: any,
    },
  },
  packageSizeLength: {
    value: any,
    metric: any,
  },
  packageSizeWidth: {
    value: any,
    metric: any,
  },
  packageSizeHeight: {
    value: any,
    metric: any,
  },
};

const initValues = {
  batchAdjustments: [],
  packageGrossWeight: {
    value: 0,
    metric: 'kg',
  },
  packageVolume: {
    value: 0,
    metric: 'cm³',
  },
  packageSize: {
    length: {
      value: 0,
      metric: 'cm',
    },
    width: {
      value: 0,
      metric: 'cm',
    },
    height: {
      value: 0,
      metric: 'cm',
    },
  },
  packageSizeLength: {
    value: 0,
    metric: 'cm',
  },
  packageSizeWidth: {
    value: 0,
    metric: 'cm',
  },
  packageSizeHeight: {
    value: 0,
    metric: 'cm',
  },
};

export default class BatchFormContainer extends Container<FormState> {
  state = initValues;

  batch = initValues;

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  isDirty = (values: any) => !isEquals(values, this.batch);

  initDetailValues = (values: any) => {
    const parsedValues = removeTypename(removeNulls(values));
    logger.warn('parsedValues', parsedValues);
    // $FlowFixMe: missing type define for map's ramda function
    this.setState(parsedValues);
    this.batch = parsedValues;

    logger.warn('setValues for batch detail', parsedValues);
    logger.warn('batch detail', this.batch);
  };

  validationRules = () =>
    Yup.object().shape({
      no: Yup.string().required(),
      orderItem: Yup.string().required(),
      quantity: Yup.number().required(),
    });
}
