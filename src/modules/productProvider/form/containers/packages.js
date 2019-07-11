// @flow
import type { ProductProviderPackagePayload } from 'generated/graphql';
import { Container } from 'unstated';
import update from 'immutability-helper';
import { cloneDeep, set } from 'lodash';
import { calculatePackageVolume } from 'utils/batch';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import { generatePackaging } from 'utils/product';

type FormState = {
  packages: Array<ProductProviderPackagePayload>,
  defaultPackage: ProductProviderPackagePayload,
};

const generatePackage = generatePackaging();

export const initValues = {
  packages: [generatePackage],
  defaultPackage: generatePackage,
};

export default class ProductProviderPackagesContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  setFieldValue = (path: string, value: mixed) => {
    this.setState((prevState: FormState): FormState => set(cloneDeep(prevState), path, value));
  };

  initDetailValues = ({
    packages,
    defaultPackage,
  }: {
    packages: Array<ProductProviderPackagePayload>,
    defaultPackage: ProductProviderPackagePayload,
  }) => {
    const parsedValues: Object = { packages, defaultPackage: defaultPackage || packages[0] };
    this.setState(parsedValues);
    this.originalValues = { ...parsedValues };
  };

  newPackaging = (): ProductProviderPackagePayload => {
    const newPkg = generatePackaging();
    this.setState(prevState => {
      return {
        ...prevState,
        packages: [...prevState.packages, newPkg],
      };
    });
    return newPkg;
  };

  removePackage = (id: string) => {
    const index = this.state.packages.findIndex(pkg => pkg.id === id);
    const isDefault = id === this.state.defaultPackage.id;

    if (isDefault) {
      this.setState(prevState =>
        update(prevState, {
          packages: {
            $splice: [[index, 1]],
          },
          defaultPackage: {
            $set: prevState.packages.filter(pkg => pkg.id !== id)[0],
          },
        })
      );
    } else {
      this.setState(prevState =>
        update(prevState, {
          packages: {
            $splice: [[index, 1]],
          },
        })
      );
    }
  };

  setDefault = (defaultPackage: ProductProviderPackagePayload) => {
    this.setState(prevState => ({
      ...prevState,
      defaultPackage,
    }));
  };

  getActivePackage = (
    id: string
  ): {
    values: ProductProviderPackagePayload,
    originalValues: ProductProviderPackagePayload,
    isNew: boolean,
  } => {
    const values = this.state.packages.find(pkg => pkg.id === id) || {};
    const originalValues = this.originalValues.packages.find(pkg => pkg.id === id) || {};
    return {
      values,
      originalValues,
      isNew: getByPathWithDefault(false, 'isNew', values),
    };
  };

  setPackageValue = ({
    id,
    value,
    autoCalculate,
  }: {
    id: string,
    value: ProductProviderPackagePayload,
    autoCalculate: boolean,
  }) => {
    const index = this.state.packages.findIndex(pkg => pkg.id === id);
    const pkg = { ...value };
    if (autoCalculate) {
      pkg.volume = calculatePackageVolume({
        packageSize: getByPathWithDefault(null, 'size', pkg),
        packageVolume: getByPathWithDefault(null, 'volume', pkg),
      });
    }
    this.setState(prevState =>
      update(prevState, {
        packages: {
          [index]: {
            $merge: pkg,
          },
        },
      })
    );
  };
}
