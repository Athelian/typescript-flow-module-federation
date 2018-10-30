// @flow
import * as React from 'react';
import { Container } from 'unstated';
import { removeTypename } from 'utils/data';
import { isEquals } from 'utils/fp';

type MultiSelectDataType = {
  id: string,
  text: string,
};

type OrderFilterFieldMultiSelect = {
  poNo?: Array<MultiSelectDataType>,
  exporterId?: Array<MultiSelectDataType>,
  tagIds?: Array<MultiSelectDataType>,
  assignment?: Array<MultiSelectDataType>,
};
type OrderFilterFieldCheckBox = {
  unBatched?: boolean,
  unShipped?: boolean,
  includeArchived?: boolean,
  onlyArchived?: boolean,
};
type OrderFilterFieldRange = {
  created?: Array<string>,
  updatedAt?: Array<string>,
};
type OrderFilter = {
  multiSelect?: OrderFilterFieldMultiSelect,
  checkbox?: OrderFilterFieldCheckBox,
  range?: OrderFilterFieldRange,
};

type OrderItemFilterFieldMultiSelect = {
  productName?: Array<MultiSelectDataType>,
  productSerial?: Array<MultiSelectDataType>,
  janCode?: Array<MultiSelectDataType>,
  hsCode?: Array<MultiSelectDataType>,
  exporter?: Array<MultiSelectDataType>,
  supplier?: Array<MultiSelectDataType>,
  countryOfOrigin?: Array<MultiSelectDataType>,
  currency?: Array<MultiSelectDataType>,
  packageInfo?: Array<MultiSelectDataType>,
  metadata?: Array<MultiSelectDataType>,
  tag?: Array<MultiSelectDataType>,
};
type OrderItemFilterFieldSelect = {
  unBatched?: boolean,
  unShipped?: boolean,
  includeArchived?: boolean,
  onlyArchived?: boolean,
}
type OrderItemFilterFieldRange = {};
type OrderItemFilter = {
  multiSelect?: OrderItemFilterFieldMultiSelect,
  checkbox?: OrderItemFilterFieldSelect,
  range?: OrderItemFilterFieldRange,
};


type FormState = {
  order: OrderFilter,
  orderItem: OrderItemFilter,

  poNo?: Array<MultiSelectDataType>,
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
  order: {
    multiSelect: {
      poNo: [],
      exporterId: [],
      tagIds: [],
      assignment: [],
    },
    checkbox: {
      unBatched: false,
      unShipped: false,
      includeArchived: false,
      onlyArchived: false,
    },
    range: {
      created: [],
      updatedAt: [],
    },
  },
  orderItem: {
    multiSelect: {
      productName: [],
      productSerial: [],
      janCode: [],
      hsCode: [],
      exporter: [],
      supplier: [],
      countryOfOrigin: [],
      currency: [],
      packageInfo: [],
      metadata: [],
      tag: [],
    },
    checkbox: {
      unBatched: false,
      unShipped: false,
      includeArchived: false,
      onlyArchived: false,
    },
    range: {},
  },

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

export class OrderFiltering extends Container<FormState> {
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

  onAddFilterValue = (name: string, data: MultiSelectDataType) => {
    if (this.state[name] !== undefined) {
      this.setState(prevState => ({
        ...prevState,
        [name]: prevState[name].filter(el => el.id === data.id).length
          ? prevState[name]
          : ([...prevState[name], data]: Array<?MultiSelectDataType>),
      }));
    }
  };

  onRemoveFilterValue = (name: string, data: MultiSelectDataType) => {
    if (this.state[name] !== undefined) {
      this.setState(prevState => ({
        ...prevState,
        [name]:
          prevState[name].findIndex(el => el.id === data.id) !== -1
            ? (prevState[name].filter(el => el.id !== data.id): Array<?MultiSelectDataType>)
            : prevState[name],
      }));
    }
  };

  onToggleSelectSection = (name: string, setFieldValue: ?Function, form: React.Node) => {
    this.setState(
      ({ editingSection, selectedSections, ...rest }) => {
        const isSelecting = selectedSections.includes(name);
        if (!isSelecting) {
          this.onEditSection(name, form);
        }

        return {
          ...rest,
          selectedSections: isSelecting
            ? (selectedSections.filter(item => item !== name): Array<?string>)
            : ([...selectedSections, name]: Array<?string>),
          editingForm: isSelecting ? null : form,
          editingSection: isSelecting ? '' : editingSection,
        };
      },
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

  onApply = (name: string, setFieldValue: Function) => {
    this.setState(
      ({ editingSection, editingForm, ...rest }) => ({
        editingSection: '',
        // editingForm: null,
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

export default OrderFiltering;
