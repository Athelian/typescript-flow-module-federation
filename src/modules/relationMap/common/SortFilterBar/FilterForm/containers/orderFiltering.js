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
};
type OrderItemFilterFieldRange = {};
type OrderItemFilter = {
  multiSelect?: OrderItemFilterFieldMultiSelect,
  checkbox?: OrderItemFilterFieldSelect,
  range?: OrderItemFilterFieldRange,
};

type BatchFilterFieldMultiSelect = {
  tagIds?: Array<MultiSelectDataType>,
};
type BatchFilterFieldCheckBox = {};
type BatchFilterFieldRange = {
  deliveryDate?: Array<string>,
  desiredDate?: Array<string>,
  expiryDate?: Array<string>,
  productionDate?: Array<string>,
};
type BatchFilter = {
  multiSelect?: BatchFilterFieldMultiSelect,
  checkbox?: BatchFilterFieldCheckBox,
  range?: BatchFilterFieldRange,
};

type ShipmentFilterFieldMultiSelect = {
  tagIds?: Array<MultiSelectDataType>,
  carrier?: Array<MultiSelectDataType>,
  forwarder?: Array<MultiSelectDataType>,
  loadPortName?: Array<MultiSelectDataType>,
  dischargePortName?: Array<MultiSelectDataType>,
  transitPort1Name?: Array<MultiSelectDataType>,
  transitPort2Name?: Array<MultiSelectDataType>,
};
type ShipmentFilterFieldCheckBox = {
  cargoReady?: boolean,
  departureFromLoadPort?: boolean,
  arrivalAtDischargePort?: boolean,
  arrivalAtTransitPort1?: boolean,
  departureFromTransitPort1?: boolean,
  arrivalAtTransitPort2?: boolean,
  departureFromTransitPort2?: boolean,
  customClearance?: boolean,
  warehouseArrival?: boolean,
};
type ShipmentFilterFieldRange = {
  cargoReadyDate?: Array<string>,
  departureFromLoadPortDate?: Array<string>,
  arrivalAtDischargePortDate?: Array<string>,
  arrivalAtTransitPort1Date?: Array<string>,
  departureFromTransitPort1Date?: Array<string>,
  arrivalAtTransitPort2Date?: Array<string>,
  departureFromTransitPort2Date?: Array<string>,
  customClearanceDate?: Array<string>,
  warehouseArrivalDate?: Array<string>,
  deliveryReadyDate?: Array<string>,
};
type ShipmentFilter = {
  multiSelect?: ShipmentFilterFieldMultiSelect,
  checkbox?: ShipmentFilterFieldCheckBox,
  range?: ShipmentFilterFieldRange,
};

type FormState = {
  order: OrderFilter,
  orderItem: OrderItemFilter,
  batch: BatchFilter,
  shipment: ShipmentFilter,

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
  batch: {
    multiSelect: {
      tagIds: [],
    },
    checkbox: {},
    range: {
      deliveryDate: [],
      desiredDate: [],
      expiryDate: [],
      productionDate: [],
    },
  },
  shipment: {
    multiSelect: {
      tagIds: [],
      carrier: [],
      forwarder: [],
      loadPortName: [],
      dischargePortName: [],
      transitPort1Name: [],
      transitPort2Name: [],
      warehouseName: [],
    },
    range: {
      cargoReadyDate: [],
      departureFromLoadPortDate: [],
      arrivalAtDischargePortDate: [],
      arrivalAtTransitPort1Date: [],
      departureFromTransitPort1Date: [],
      arrivalAtTransitPort2Date: [],
      departureFromTransitPort2Date: [],
      customClearanceDate: [],
      warehouseArrivalDate: [],
      deliveryReadyDate: [],
    },
    checkbox: {
      cargoReady: false,
      departureFromLoadPort: false,
      arrivalAtDischargePort: false,
      arrivalAtTransitPort1: false,
      departureFromTransitPort1: false,
      arrivalAtTransitPort2: false,
      departureFromTransitPort2: false,
      customClearance: false,
      warehouseArrival: false,
      deliveryReady: false,
    },
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

  getFilterNoInSection = (section: string) => {
    if (this.state[section] === undefined) {
      return null;
    }

    const sectionObj = this.state[section];

    const multiSelectNo = Object.keys(sectionObj.multiSelect).reduce((prev, key) => {
      const up = sectionObj.multiSelect[key].length > 0 ? 1 : 0;
      return prev + up;
    }, 0);
    const checkboxNo = Object.keys(sectionObj.checkbox)
      ? Object.keys(sectionObj.checkbox).reduce(
          (prev, key) => prev + sectionObj.checkbox[key] || 0,
          0
        )
      : 0;
    const rangeNo = Object.keys(sectionObj.range)
      ? Object.keys(sectionObj.range).reduce(
          (prev, key) => (prev + sectionObj.range[key] && sectionObj.range[key].length) || 0,
          0
        )
      : 0;

    return multiSelectNo + checkboxNo + rangeNo;
  };

  onAddFilterMultiSelectValue = (filterName: string, data: MultiSelectDataType) => {
    const filterNameObj = filterName.split('.');
    const [section, type, name] = filterNameObj;
    if (
      this.state[section] === undefined ||
      this.state[section][type] === undefined ||
      !this.state[section][type][name] === undefined ||
      typeof this.state[section][type][name] !== 'object'
    ) {
      return;
    }

    this.setState(({ [section]: prevSection, ...restState }) => {
      const { [type]: prevType, ...restType } = prevSection;
      const { [name]: prevName, ...restName } = prevType;

      return {
        [section]: {
          [type]: {
            [name]: prevName.filter(el => el.id === data.id).length
              ? prevName
              : ([...prevName, data]: Array<?MultiSelectDataType>),
            ...restName,
          },
          ...restType,
        },
        ...restState,
      };
    });
  };

  onRemoveFilterMultiSelectValue = (filterName: string, data: MultiSelectDataType) => {
    const filterNameObj = filterName.split('.');
    const [section, type, name] = filterNameObj;
    if (
      this.state[section] === undefined ||
      this.state[section][type] === undefined ||
      !this.state[section][type][name] === undefined ||
      typeof this.state[section][type][name] !== 'object'
    ) {
      return;
    }

    this.setState(({ [section]: prevSection, ...restState }) => {
      const { [type]: prevType, ...restType } = prevSection;
      const { [name]: prevName, ...restName } = prevType;

      return {
        [section]: {
          [type]: {
            [name]:
              prevName.findIndex(el => el.id === data.id) !== -1
                ? (prevName.filter(el => el.id !== data.id): Array<?MultiSelectDataType>)
                : prevName,
            ...restName,
          },
          ...restType,
        },
        ...restState,
      };
    });
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

  onToggleFilterCheckBox = (filterName: string) => {
    const filterNameObj = filterName.split('.');
    const [section, type, name] = filterNameObj;
    if (
      this.state[section] === undefined ||
      this.state[section][type] === undefined ||
      !this.state[section][type][name] === undefined ||
      typeof this.state[section][type][name] !== 'boolean'
    ) {
      return;
    }

    this.setState(({ [section]: prevSection, ...restState }) => {
      const { [type]: prevType, ...restType } = prevSection;
      const { [name]: prevName, ...restName } = prevType;

      return {
        [section]: {
          [type]: {
            [name]: !prevName,
            ...restName,
          },
          ...restType,
        },
        ...restState,
      };
    });
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
