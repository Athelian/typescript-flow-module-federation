// @flow
import { Container } from 'unstated';
import type { Tag } from 'generated/graphql';
import { isEquals } from 'utils/fp';
import { extractForbiddenId } from 'utils/data';

type FormState = {
  tags?: Array<Tag>,
};

const initValues = {
  tags: [],
};

export default class ShipmentTagsContainer extends Container<FormState> {
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

  initDetailValues = (tags: Array<Tag>) => {
    const parsedTags = [...tags.map(tag => extractForbiddenId(tag))];
    this.setState({ tags: parsedTags });
    this.originalValues = { tags: parsedTags };
  };
}
