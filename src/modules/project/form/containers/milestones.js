// @flow
import { Container } from 'unstated';
import type { Milestone } from 'generated/graphql';
import { isEquals } from 'utils/fp';

type FormState = {
  milestones: Array<Milestone>,
};

const initValues: FormState = {
  milestones: [],
};

export default class ProjectMilestonesContainer extends Container<FormState> {
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

  initDetailValues = (milestones: Array<Milestone>) => {
    this.setState({ milestones });
    this.originalValues = { milestones };
  };
}
