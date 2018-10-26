// @flow
import * as React from 'react';
import { Container } from 'unstated';
import { removeTypename } from 'utils/data';
import { isEquals } from 'utils/fp';

type objectType = {
  id: string,
  text: string,
};

type FormState = {
  poNo?: Array<objectType>,
  exporterId?: Array<string>,
  tagIds?: Array<string>,
  assignment?: Array<string>,
  created?: Array<string>,
  updatedAt?: Array<string>,
  unBatched?: boolean,
  unShipped?: boolean,
  includeArchived?: boolean,
  onlyArchived?: boolean,

  selectedSections: Array<?string>,
  beforeEditingData: Array<?string>,
  editingSection: string,
  editingForm: ?React.Node,
};

const initValues = {
  poNo: [],
  exporterId: [],
  tagIds: [],
  assignment: [],
  created: [],
  updatedAt: [],
  unBatched: false,
  unShipped: false,
  includeArchived: false,
  onlyArchived: false,

  selectedSections: [],
  beforeEditingData: [],
  editingSection: '',
  editingForm: null,
};

export class OrderFilteredSectionContainer extends Container<FormState> {
  state = initValues;

  originalValues = initValues;

  isDirty = () => !isEquals(this.state, this.originalValues);

  onSuccess = () => {
    this.originalValues = { ...this.state };
    this.setState(this.originalValues);
  };

  generateQuery = ({ selectedSections, poNo = [] }: FormState) => {
    const [firstPoNo] = poNo;
    const query = firstPoNo && firstPoNo.text;
    return {
      filter: {
        query: selectedSections.includes('poNo') ? query : '',
        tagIds: [],
      },
    };
  };

  onAddFilterValue = (name: string, data: objectType) => {
    if (this.state[name] !== undefined) {
      this.setState(prevState => ({
        ...prevState,
        [name]: prevState[name].filter(el => el.id === data.id).length
          ? prevState[name]
          : ([...prevState[name], data]: Array<?objectType>),
      }));
    }
  };

  onRemoveFilterValue = (name: string, data: objectType) => {
    if (this.state[name] !== undefined) {
      this.setState(prevState => ({
        ...prevState,
        [name]:
          prevState[name].findIndex(el => el.id === data.id) !== -1
            ? (prevState[name].filter(el => el.id !== data.id): Array<?objectType>)
            : prevState[name],
      }));
    }
  };

  onToggleSelectSection = (name: string, setFieldValue: ?Function) => {
    this.setState(
      ({ selectedSections, ...rest }) => ({
        selectedSections: selectedSections.includes(name)
          ? (selectedSections.filter(item => item !== name): Array<?string>)
          : ([...selectedSections, name]: Array<?string>),
        ...rest,
      }),
      () => {
        if (setFieldValue) {
          setFieldValue(this.generateQuery(this.state));
        }
      }
    );
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

  onEditSection = (name: string, form: React.Node) => {
    this.setState(
      ({ editingSection, editingForm, beforeEditingData, ...rest }) => ({
        editingSection: name,
        editingForm: form,
        beforeEditingData: rest[name],
        ...rest,
      }),
      () => {
        // this.onToggleSelectSection(name);
        // this.onToggleSelectSection(name);
      }
    );
  };

  onSave = (name: string, setFieldValue: Function) => {
    this.setState(
      ({ editingSection, editingForm, ...rest }) => ({
        editingSection: '',
        editingForm: null,
        ...rest,
      }),
      () => {
        if (setFieldValue) {
          setFieldValue(this.generateQuery(this.state));
        }
      }
    );
  };

  reset = () => {
    this.setState(this.originalValues);
  };

  initDetailValues = (selectedSections: Array<string>) => {
    const parsedValues: Array<any> = removeTypename(selectedSections);
    this.setState({ selectedSections: parsedValues });
    this.originalValues = { selectedSections: parsedValues };
  };
}

export default OrderFilteredSectionContainer;
