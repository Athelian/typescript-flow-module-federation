// @flow
import type { FilePayload } from 'generated/graphql';
import { Container } from 'unstated';
import { set, cloneDeep } from 'lodash';
import update from 'immutability-helper';
import { isEquals } from 'utils/fp';
import { extractForbiddenId } from 'utils/data';
import type { MetricValue } from 'types';

type Price = {
  amount: number,
  currency: string,
};

type FormState = {
  productProviders: Array<{
    exporter: { id: string, name: string },
    supplier: { id: string, name: string },
    unitVolume: MetricValue,
    unitWeight: MetricValue,
    unitPrice: Price,
    packageGrossWeight: MetricValue,
    packageVolume: MetricValue,
    packageSize: {
      width: MetricValue,
      height: MetricValue,
      length: MetricValue,
    },
  }>,
};

const initValues = {
  needDeletedFiles: [],
  productProviders: [],
};

export default class ProductProvidersContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  setFieldValue = (path: string, value: any) => {
    this.setState(prevState => {
      const newState = set(cloneDeep(prevState), path, value);
      return newState;
    });
  };

  setFieldArrayValue = (index: number, value: any) => {
    this.setState(prevState =>
      update(prevState, {
        productProviders: {
          [index]: {
            $merge: value,
          },
        },
      })
    );
  };

  removeArrayItem = (index: number) => {
    this.setState(prevState => {
      const { productProviders } = prevState;
      return {
        productProviders: productProviders.filter((item, itemIndex) => index !== itemIndex),
      };
    });
  };

  setNeedDeletedFiles = (noNeedDeletedFiles: Array<FilePayload>) => {
    const noNeedDeletedFileIDs = new Set(noNeedDeletedFiles.map(({ id }) => id));

    this.setState(prevState => ({
      needDeletedFiles: prevState.needDeletedFiles.filter(
        ({ id }) => !noNeedDeletedFileIDs.has(id)
      ),
    }));
  };

  unsetNeedDeletedFiles = (needDeletedFiles: Array<FilePayload>) => {
    const prevNeedDeletedFiles = this.state.needDeletedFiles;
    const prevNeedDeletedFileIDs = new Set(prevNeedDeletedFiles.map(({ id }) => id));

    this.setState({
      needDeletedFiles: [
        ...prevNeedDeletedFiles,
        ...needDeletedFiles.filter(({ id }) => !prevNeedDeletedFileIDs.has(id)),
      ],
    });
  };

  resetNeedDeletedFiles = () => {
    this.setState({
      needDeletedFiles: [],
    });
  };

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  initDetailValues = (productProviders: Array<Object>) => {
    const parsedValues: Array<any> = [
      ...productProviders.map(productProvider => extractForbiddenId(productProvider)),
    ];

    this.setState({ productProviders: parsedValues, needDeletedFiles: [] });
    this.originalValues = { productProviders: parsedValues, needDeletedFiles: [] };
  };
}
