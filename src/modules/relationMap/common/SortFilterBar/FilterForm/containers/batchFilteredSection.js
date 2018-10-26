// @flow
import { Container } from 'unstated';
import { removeTypename } from 'utils/data';
import { isEquals } from 'utils/fp';

type FormState = {
  unBatched?: boolean,
  unShipped?: boolean,
  includeArchived?: boolean,
  onlyArchived?: boolean,
  selectedSections: Array<?string>,
};

const initValues = {
  unBatched: false,
  unShipped: false,
  includeArchived: false,
  onlyArchived: false,
  selectedSections: [],
};

export class BatchFilteredSectionContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  onToggleSection = (name: string) => {
    if (this.state[name] !== undefined && typeof this.state[name] === 'boolean') {
      this.setState(({ selectedSections, ...rest }) => ({
        selectedSections: rest[name]
          ? (selectedSections.filter(item => item !== name): Array<?string>)
          : ([...selectedSections, name]: Array<?string>),
        [name]: !rest[name],
      }));
    }
  };

  initDetailValues = (selectedSections: Array<string>) => {
    const parsedValues: Array<any> = removeTypename(selectedSections);
    this.setState({ selectedSections: parsedValues });
    this.originalValues = { selectedSections: parsedValues };
  };
}

export default BatchFilteredSectionContainer;
