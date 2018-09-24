// @flow
import { Container } from 'unstated';
import { isEquals } from 'utils/fp';
import { removeTypename } from 'utils/data';

type FormState = {
  name?: string,
  serial?: string,
  janCode?: ?string,
  hsCode?: ?string,
  material?: ?string,
  tags?: Array<{
    id: string,
    name: string,
    color: string,
  }>,
  productProviders?: Array<Object>,
  files?: Array<Object>,
};

const initValues = {
  tags: [],
};

export default class ProductInfoContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
  };

  setFieldValue = (name: string, value: mixed) => {
    this.setState({
      [name]: value,
    });
  };

  initDetailValues = (values: any) => {
    const parsedValues = removeTypename(values);
    // $FlowFixMe: missing type define for map's ramda function
    this.setState(parsedValues);
    this.originalValues = parsedValues;
  };
}
